#!/usr/bin/env node

/**
 * Script to fetch menu data from webhook, download images, upload to Vercel Blob, 
 * and generate updated JSON with Blob URLs
 * 
 * Usage:
 * 1. Make sure your dev server is running (npm run dev)
 * 2. Set your BLOB_READ_WRITE_TOKEN environment variable
 * 3. Run: node scripts/sync-webhook-images.js
 */

const fs = require('fs')
const path = require('path')
const https = require('https')
const http = require('http')
const FormData = require('form-data')

// Use dynamic import for node-fetch
let fetch

const WEBHOOK_URL = 'https://n8n.swooshd.xyz/webhook/4e77ced1-69cd-408e-a90e-d32ec7760c56'
const API_ENDPOINT = 'http://localhost:3000/api/upload-menu-images'
const OUTPUT_DIR = path.join(__dirname, '../updated-menu-data')
const TEMP_DIR = path.join(__dirname, '../temp-images')

// Ensure directories exist
function ensureDirectories() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true })
  }
}

// Download image from URL
function downloadImage(url, filePath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https://') ? https : http
    
    const request = protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filePath)
        response.pipe(fileStream)
        fileStream.on('finish', () => {
          fileStream.close()
          resolve(filePath)
        })
        fileStream.on('error', reject)
      } else if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        // Handle redirects
        downloadImage(response.headers.location, filePath).then(resolve).catch(reject)
      } else {
        reject(new Error(`Failed to download image: ${response.statusCode} ${response.statusMessage}`))
      }
    })
    
    request.on('error', reject)
    request.setTimeout(30000, () => {
      request.destroy()
      reject(new Error('Download timeout'))
    })
  })
}

// Upload image to Vercel Blob
async function uploadToBlob(filePath, menuItemId) {
  try {
    const formData = new FormData()
    formData.append('file', fs.createReadStream(filePath))
    formData.append('menuItemId', menuItemId)

    console.log(`Uploading ${path.basename(filePath)} to Vercel Blob...`)

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      body: formData,
    })

    const result = await response.json()

    if (response.ok) {
      console.log(`✅ Successfully uploaded: ${result.url}`)
      return result.url
    } else {
      console.error(`❌ Failed to upload ${filePath}:`, result.error)
      return null
    }
  } catch (error) {
    console.error(`❌ Error uploading ${filePath}:`, error.message)
    return null
  }
}

// Get file extension from URL or content type
function getFileExtension(url, contentType) {
  // Try to get extension from URL
  const urlPath = new URL(url).pathname
  const urlExt = path.extname(urlPath).toLowerCase()
  
  if (urlExt && ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(urlExt)) {
    return urlExt
  }
  
  // Fallback to content type
  if (contentType) {
    const typeMap = {
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'image/gif': '.gif'
    }
    return typeMap[contentType.toLowerCase()] || '.jpg'
  }
  
  return '.jpg' // Default fallback
}

// Process a single menu item
async function processMenuItem(item, index) {
  try {
    console.log(`\nProcessing: ${item.name} (${item.id})`)
    
    if (!item.image || typeof item.image !== 'string') {
      console.log(`⚠️  No image URL found for ${item.id}, skipping...`)
      return item
    }

    // Skip if already a Blob URL
    if (item.image.includes('blob.vercel-storage.com')) {
      console.log(`✓ Already using Blob URL for ${item.id}`)
      return item
    }

    // Skip if it's a local path
    if (item.image.startsWith('/') || item.image.startsWith('./')) {
      console.log(`⚠️  Local path detected for ${item.id}, skipping...`)
      return item
    }

    console.log(`📥 Downloading image from: ${item.image}`)
    
    // Get file extension
    const extension = getFileExtension(item.image)
    const tempFilePath = path.join(TEMP_DIR, `${item.id}${extension}`)
    
    // Download the image
    await downloadImage(item.image, tempFilePath)
    console.log(`✓ Downloaded to: ${tempFilePath}`)
    
    // Upload to Vercel Blob
    const blobUrl = await uploadToBlob(tempFilePath, item.id)
    
    // Clean up temporary file
    try {
      fs.unlinkSync(tempFilePath)
    } catch (err) {
      console.warn(`Warning: Could not delete temp file ${tempFilePath}`)
    }
    
    if (blobUrl) {
      return {
        ...item,
        image: blobUrl,
        originalImage: item.image // Keep track of original URL
      }
    } else {
      console.log(`❌ Failed to upload ${item.id}, keeping original URL`)
      return item
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${item.id}:`, error.message)
    return item // Return original item if processing fails
  }
}

// Main function
async function syncWebhookImages() {
  try {
    // Import fetch dynamically
    const fetchModule = await import('node-fetch')
    fetch = fetchModule.default

    console.log('🚀 Starting webhook image sync to Vercel Blob storage...\n')
    
    ensureDirectories()
    
    // Fetch menu data from webhook
    console.log('📡 Fetching menu data from webhook...')
    const response = await fetch(WEBHOOK_URL)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch webhook data: ${response.status} ${response.statusText}`)
    }
    
    const menuData = await response.json()
    console.log(`✓ Fetched menu data with ${menuData.menu?.length || 0} items`)
    
    // Save original data
    const originalFile = path.join(OUTPUT_DIR, 'original-menu-data.json')
    fs.writeFileSync(originalFile, JSON.stringify(menuData, null, 2))
    console.log(`✓ Saved original data to: ${originalFile}`)
    
    if (!menuData.menu || !Array.isArray(menuData.menu)) {
      throw new Error('Invalid menu data structure: menu array not found')
    }
    
    // Process each menu item
    console.log('\n📸 Processing menu item images...')
    const updatedMenu = []
    
    for (let i = 0; i < menuData.menu.length; i++) {
      const item = menuData.menu[i]
      const updatedItem = await processMenuItem(item, i)
      updatedMenu.push(updatedItem)
      
      // Small delay between requests
      if (i < menuData.menu.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
    
    // Create updated menu data
    const updatedMenuData = {
      ...menuData,
      menu: updatedMenu,
      updatedAt: new Date().toISOString(),
      blobStorageSync: true
    }
    
    // Save updated data
    const updatedFile = path.join(OUTPUT_DIR, 'updated-menu-data.json')
    fs.writeFileSync(updatedFile, JSON.stringify(updatedMenuData, null, 2))
    
    // Clean up temp directory
    try {
      fs.rmSync(TEMP_DIR, { recursive: true, force: true })
    } catch (err) {
      console.warn('Warning: Could not clean up temp directory')
    }
    
    // Summary
    const successCount = updatedMenu.filter(item => 
      item.image && item.image.includes('blob.vercel-storage.com')
    ).length
    
    console.log('\n📊 Sync Summary:')
    console.log(`✅ Successfully synced: ${successCount} images`)
    console.log(`❌ Failed/Skipped: ${updatedMenu.length - successCount} images`)
    console.log(`📁 Updated menu data saved to: ${updatedFile}`)
    
    if (successCount > 0) {
      console.log('\n🔗 New Blob URLs:')
      updatedMenu.forEach(item => {
        if (item.image && item.image.includes('blob.vercel-storage.com')) {
          console.log(`  ${item.id}: ${item.image}`)
        }
      })
    }
    
    console.log('\n✨ Sync completed successfully!')
    console.log('\n📝 Next Steps:')
    console.log('1. Review the updated-menu-data.json file')
    console.log('2. Update your backend webhook to return the new Blob URLs')
    console.log('3. Test your application with the new image URLs')
    
  } catch (error) {
    console.error('❌ Sync failed:', error.message)
    process.exit(1)
  }
}

// Check for required environment variable
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('❌ BLOB_READ_WRITE_TOKEN environment variable is required')
  console.log('Please set it in your .env.local file or environment')
  process.exit(1)
}

// Run the sync script
syncWebhookImages().catch(error => {
  console.error('❌ Script failed:', error.message)
  process.exit(1)
})