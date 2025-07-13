import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://bowlz.xyz'),
  title: 'Order Brekkie Bowlz RTB',
  description: 'Fresh smoothie bowls, overnight oats & specialty coffee delivered 9-10 AM. Order now for tomorrow!',
  keywords: ['smoothie bowls', 'healthy food', 'breakfast', 'overnight oats', 'coffee', 'RTB', 'delivery'],
  
  // Open Graph (Facebook, WhatsApp, LinkedIn)
  openGraph: {
    title: 'Order Brekkie Bowlz RTB',
    description: 'Fresh smoothie bowls, overnight oats & specialty coffee delivered 9-10 AM. Order now for tomorrow!',
    url: 'https://bowlz.xyz',
    siteName: 'Brekkie Bowlz RTB',
    images: [
      {
        url: 'https://bowlz.xyz/logos/whatshare.jpg',
        width: 1200,
        height: 630,
        alt: 'Delicious Brekkie Bowlz smoothie bowl with fresh fruits and toppings',
        type: 'image/jpeg',
      }
    ],
    type: 'website',
    locale: 'en_US',
  },
  
  // Twitter Cards
  twitter: {
    card: 'summary_large_image',
    title: 'Order Brekkie Bowlz RTB',
    description: 'Fresh smoothie bowls, overnight oats & specialty coffee delivered 9-10 AM',
    images: ['https://bowlz.xyz/logos/whatshare.jpg'],
    creator: '@brekkiebowlz',
  },
  
  // App manifest & icons
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '192x192',
        url: '/icon-192.png',
      },
      {
        rel: 'icon',
        type: 'image/png', 
        sizes: '512x512',
        url: '/icon-512.png',
      },
    ],
  },
  
  // Additional meta tags for better social sharing
  other: {
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:type': 'image/jpeg',
    'og:image:secure_url': 'https://bowlz.xyz/logos/whatshare.jpg',
    'og:image:alt': 'Delicious Brekkie Bowlz smoothie bowl with fresh fruits and toppings',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Performance Optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" href="/logos/brekkiebowlz_transparent.png" as="image" />
        <link rel="preload" href="/logos/hero_png.png" as="image" />
        
        {/* PWA Meta Tags for Full Screen */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Brekkie Bowlz" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#7c3aed" />
        <meta name="msapplication-TileColor" content="#7c3aed" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Prevent zoom on input focus */}
        <meta name="format-detection" content="telephone=no" />
        
        {/* Web App Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/apple-touch-icon.png" />
      </head>
      <body className={`${inter.className} bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 min-h-screen`}>
        <div className="max-w-sm mx-auto bg-white min-h-screen shadow-2xl md:rounded-3xl md:my-4 md:min-h-[calc(100vh-2rem)] overflow-hidden">
          {children}
        </div>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}