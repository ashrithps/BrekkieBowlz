#!/usr/bin/env node

/**
 * Simple test script to fetch and examine webhook data structure
 */

const WEBHOOK_URL = 'https://n8n.swooshd.xyz/webhook/4e77ced1-69cd-408e-a90e-d32ec7760c56'

async function testWebhook() {
  try {
    // Import fetch dynamically
    const fetchModule = await import('node-fetch')
    const fetch = fetchModule.default

    console.log('🔍 Testing webhook data structure...\n')
    console.log(`📡 Fetching from: ${WEBHOOK_URL}`)
    
    const response = await fetch(WEBHOOK_URL)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log('\n✅ Successfully fetched webhook data')
    console.log(`📊 Data structure:`)
    console.log(`   - Type: ${typeof data}`)
    console.log(`   - Keys: ${Object.keys(data).join(', ')}`)
    
    if (data.menu && Array.isArray(data.menu)) {
      console.log(`   - Menu items: ${data.menu.length}`)
      console.log('\n🍽️  Menu items with images:')
      
      data.menu.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.name} (${item.id})`)
        console.log(`      Image: ${item.image || 'No image'}`)
        if (item.image) {
          const isUrl = item.image.startsWith('http')
          const isLocal = item.image.startsWith('/')
          const isBlob = item.image.includes('blob.vercel-storage.com')
          console.log(`      Type: ${isBlob ? 'Blob URL' : isUrl ? 'External URL' : isLocal ? 'Local path' : 'Unknown'}`)
        }
        console.log('')
      })
    } else {
      console.log('   - ⚠️  No menu array found in data')
    }
    
    // Save sample data for inspection
    const fs = require('fs')
    const path = require('path')
    const outputPath = path.join(__dirname, '../webhook-sample.json')
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2))
    console.log(`💾 Sample data saved to: ${outputPath}`)
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    process.exit(1)
  }
}

testWebhook()