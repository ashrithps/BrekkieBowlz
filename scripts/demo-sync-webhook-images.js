#!/usr/bin/env node

/**
 * Demo version of the webhook sync script that shows what would happen
 * without actually uploading to Vercel Blob (for when BLOB_READ_WRITE_TOKEN is not available)
 */

const fs = require('fs')
const path = require('path')
const https = require('https')
const http = require('http')

const WEBHOOK_URL = 'https://n8n.swooshd.xyz/webhook/4e77ced1-69cd-408e-a90e-d32ec7760c56'
const OUTPUT_DIR = path.join(__dirname, '../updated-menu-data')

// Ensure directories exist
function ensureDirectories() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }
}

// Get file extension from URL
function getFileExtension(url) {
  try {
    const urlPath = new URL(url).pathname
    const urlExt = path.extname(urlPath).toLowerCase()
    
    if (urlExt && ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(urlExt)) {
      return urlExt
    }
  } catch (err) {
    // URL parsing failed
  }
  
  return '.jpg' // Default fallback
}

// Check if image URL is accessible
function checkImageUrl(url) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https://') ? https : http
    
    const request = protocol.get(url, (response) => {
      const isSuccess = response.statusCode === 200
      const contentType = response.headers['content-type'] || ''
      const isImage = contentType.startsWith('image/')
      
      resolve({
        accessible: isSuccess,
        contentType,
        isImage,
        size: response.headers['content-length'] || 'unknown'
      })
      
      response.destroy() // Don't actually download
    })
    
    request.on('error', () => {
      resolve({ accessible: false, contentType: null, isImage: false, size: 0 })
    })
    
    request.setTimeout(5000, () => {
      request.destroy()
      resolve({ accessible: false, contentType: null, isImage: false, size: 0 })
    })
  })
}

// Generate mock Blob URL
function generateMockBlobUrl(menuItemId, extension) {
  const timestamp = Date.now()
  return `https://xyz123.public.blob.vercel-storage.com/menu-images/${menuItemId}-${timestamp}${extension}`
}

// Process a single menu item
async function processMenuItem(item, index) {
  try {
    console.log(`\n${index + 1}. Processing: ${item.name} (${item.id})`)
    
    if (!item.image || typeof item.image !== 'string') {
      console.log(`   ⚠️  No image URL found, skipping...`)
      return item
    }

    // Skip if already a Blob URL
    if (item.image.includes('blob.vercel-storage.com')) {
      console.log(`   ✓ Already using Blob URL`)
      return item
    }

    // Skip if it's a local path
    if (item.image.startsWith('/') || item.image.startsWith('./')) {
      console.log(`   ⚠️  Local path detected, would skip...`)
      return item
    }

    console.log(`   📥 Checking image: ${item.image}`)
    
    // Check if image is accessible
    const imageInfo = await checkImageUrl(item.image)
    
    if (imageInfo.accessible && imageInfo.isImage) {
      console.log(`   ✅ Image accessible (${imageInfo.contentType}, ${imageInfo.size} bytes)`)
      
      const extension = getFileExtension(item.image)
      const mockBlobUrl = generateMockBlobUrl(item.id, extension)
      
      console.log(`   🚀 Would upload to Blob: ${mockBlobUrl}`)
      
      return {
        ...item,
        image: mockBlobUrl,
        originalImage: item.image // Keep track of original URL
      }
    } else {
      console.log(`   ❌ Image not accessible or invalid format`)
      return item
    }
    
  } catch (error) {
    console.error(`   ❌ Error processing ${item.id}:`, error.message)
    return item
  }
}

// Main function
async function demoSyncWebhookImages() {
  try {
    // Import fetch dynamically
    const fetchModule = await import('node-fetch')
    const fetch = fetchModule.default

    console.log('🎭 DEMO: Webhook image sync to Vercel Blob storage...\n')
    console.log('📝 This is a simulation - no actual uploads will occur\n')
    
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
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }
    
    // Create updated menu data
    const updatedMenuData = {
      ...menuData,
      menu: updatedMenu,
      updatedAt: new Date().toISOString(),
      blobStorageSync: true,
      demo: true,
      note: "This is demo data with mock Blob URLs. Use the real sync script with BLOB_READ_WRITE_TOKEN for actual uploads."
    }
    
    // Save updated data
    const updatedFile = path.join(OUTPUT_DIR, 'demo-updated-menu-data.json')
    fs.writeFileSync(updatedFile, JSON.stringify(updatedMenuData, null, 2))
    
    // Summary
    const successCount = updatedMenu.filter(item => 
      item.image && item.image.includes('blob.vercel-storage.com')
    ).length
    
    console.log('\n📊 Demo Sync Summary:')
    console.log(`✅ Would sync: ${successCount} images`)
    console.log(`❌ Would skip: ${updatedMenu.length - successCount} images`)
    console.log(`📁 Demo updated menu data saved to: ${updatedFile}`)
    
    if (successCount > 0) {
      console.log('\n🔗 Mock Blob URLs that would be created:')
      updatedMenu.forEach(item => {
        if (item.image && item.image.includes('blob.vercel-storage.com')) {
          console.log(`  ${item.id}: ${item.image}`)
        }
      })
    }
    
    console.log('\n✨ Demo completed successfully!')
    console.log('\n📝 To run the real sync:')
    console.log('1. Set your BLOB_READ_WRITE_TOKEN environment variable')
    console.log('2. Ensure your dev server is running (npm run dev)')
    console.log('3. Run: node scripts/sync-webhook-images.js')
    
  } catch (error) {
    console.error('❌ Demo failed:', error.message)
    process.exit(1)
  }
}

// Run the demo
demoSyncWebhookImages().catch(error => {
  console.error('❌ Demo script failed:', error.message)
  process.exit(1)
})