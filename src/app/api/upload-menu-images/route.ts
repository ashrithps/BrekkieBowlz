import { NextRequest, NextResponse } from 'next/server'
import { put, list, del } from '@vercel/blob'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const menuItemId = formData.get('menuItemId') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!menuItemId) {
      return NextResponse.json({ error: 'Menu item ID is required' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }

    // Create a consistent filename for the menu item
    const fileExtension = file.name.split('.').pop()
    const filename = `menu-images/${menuItemId}.${fileExtension}`

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      contentType: file.type,
      cacheControlMaxAge: 31536000, // 1 year cache
    })

    return NextResponse.json({
      success: true,
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      pathname: blob.pathname,
    })
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // List all menu images
    const { blobs } = await list({
      prefix: 'menu-images/',
    })

    return NextResponse.json({
      success: true,
      images: blobs.map(blob => ({
        pathname: blob.pathname,
        url: blob.url,
        downloadUrl: blob.downloadUrl,
      })),
    })
  } catch (error) {
    console.error('Error listing blob images:', error)
    return NextResponse.json(
      { error: 'Failed to list images' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pathname = searchParams.get('pathname')

    if (!pathname) {
      return NextResponse.json({ error: 'Pathname is required' }, { status: 400 })
    }

    await del(pathname)

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting blob image:', error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}