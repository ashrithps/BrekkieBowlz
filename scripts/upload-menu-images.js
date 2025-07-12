#!/usr/bin/env node

/**
 * Utility script to upload menu images to Vercel Blob storage
 * 
 * Usage:
 * 1. Place your menu images in a local folder (e.g., ./menu-images/)
 * 2. Make sure the images are named with the menu item IDs:
 *    - smoothie-bowl.jpg
 *    - overnight-oats.jpg  
 *    - filter-coffee.jpg
 * 3. Set your BLOB_READ_WRITE_TOKEN environment variable
 * 4. Run: node scripts/upload-menu-images.js
 */

const fs = require('fs')
const path = require('path')
const FormData = require('form-data')
const fetch = require('node-fetch')

const IMAGES_DIR = path.join(__dirname, '../menu-images')
const API_ENDPOINT = 'http://localhost:3000/api/upload-menu-images'

// Map of file names to menu item IDs
const FILE_TO_MENU_ID = {
  'smoothie-bowl.jpg': 'smoothie-bowl',
  'smoothie-bowl.png': 'smoothie-bowl',
  'overnight-oats.jpg': 'overnight-oats',
  'overnight-oats.png': 'overnight-oats',
  'filter-coffee.jpg': 'filter-coffee-hot',
  'filter-coffee.png': 'filter-coffee-hot',
  'coffee.jpg': 'filter-coffee-hot',
  'coffee.png': 'filter-coffee-hot'
}

async function uploadImage(filePath, menuItemId) {
  try {
    const formData = new FormData()
    formData.append('file', fs.createReadStream(filePath))
    formData.append('menuItemId', menuItemId)

    console.log(`Uploading ${path.basename(filePath)} for menu item: ${menuItemId}...`)

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      body: formData,
    })

    const result = await response.json()

    if (response.ok) {
      console.log(`✅ Successfully uploaded: ${result.url}`)
      return result
    } else {
      console.error(`❌ Failed to upload ${filePath}:`, result.error)
      return null
    }
  } catch (error) {
    console.error(`❌ Error uploading ${filePath}:`, error.message)
    return null
  }
}

async function uploadAllImages() {
  console.log('🚀 Starting menu image upload to Vercel Blob storage...\n')

  // Check if images directory exists
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`❌ Images directory not found: ${IMAGES_DIR}`)
    console.log('Please create the directory and add your menu images.')
    process.exit(1)
  }

  // Get all image files from directory
  const files = fs.readdirSync(IMAGES_DIR)
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png|webp)$/i.test(file)
  )

  if (imageFiles.length === 0) {
    console.log('❌ No image files found in the images directory.')
    console.log('Supported formats: .jpg, .jpeg, .png, .webp')
    process.exit(1)
  }

  console.log(`Found ${imageFiles.length} image file(s):`)
  imageFiles.forEach(file => console.log(`  - ${file}`))
  console.log('')

  const results = []

  // Upload each image
  for (const fileName of imageFiles) {
    const filePath = path.join(IMAGES_DIR, fileName)
    const menuItemId = FILE_TO_MENU_ID[fileName.toLowerCase()]

    if (!menuItemId) {
      console.log(`⚠️  Skipping ${fileName} - no matching menu item ID found`)
      console.log('   Expected file names: smoothie-bowl.jpg, overnight-oats.jpg, filter-coffee.jpg')
      continue
    }

    const result = await uploadImage(filePath, menuItemId)
    if (result) {
      results.push({
        fileName,
        menuItemId,
        url: result.url
      })
    }

    // Small delay between uploads
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  console.log('\n📊 Upload Summary:')
  console.log(`✅ Successfully uploaded: ${results.length}`)
  console.log(`❌ Failed: ${imageFiles.length - results.length}`)

  if (results.length > 0) {
    console.log('\n🔗 Uploaded URLs:')
    results.forEach(result => {
      console.log(`  ${result.menuItemId}: ${result.url}`)
    })

    console.log('\n📝 Next Steps:')
    console.log('1. Update your backend webhook to return these Blob URLs in the menu JSON')
    console.log('2. Replace placeholder URLs in menu-service.ts fallback data')
    console.log('3. Test the application to ensure images load correctly')
  }
}

// Check for required environment variable
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('❌ BLOB_READ_WRITE_TOKEN environment variable is required')
  console.log('Please set it in your .env.local file or environment')
  process.exit(1)
}

// Run the upload script
uploadAllImages().catch(error => {
  console.error('❌ Script failed:', error.message)
  process.exit(1)
})