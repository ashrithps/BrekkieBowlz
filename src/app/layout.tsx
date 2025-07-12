import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://bowlz.iloop.me'),
  title: 'Order Brekkie Bowlz RTB',
  description: 'Fresh smoothie bowls, overnight oats & specialty coffee delivered 9-10 AM. Order now for tomorrow!',
  keywords: ['smoothie bowls', 'healthy food', 'breakfast', 'overnight oats', 'coffee', 'RTB', 'delivery'],
  
  // Open Graph (Facebook, WhatsApp, LinkedIn)
  openGraph: {
    title: 'Order Brekkie Bowlz RTB',
    description: 'Fresh smoothie bowls, overnight oats & specialty coffee delivered 9-10 AM. Order now for tomorrow!',
    url: 'https://bowlz.iloop.me',
    siteName: 'Brekkie Bowlz RTB',
    images: [
      {
        url: 'https://bowlz.iloop.me/logos/brekkiwbowlz.png',
        width: 800,
        height: 800,
        alt: 'Brekkie Bowlz RTB Logo',
        type: 'image/png',
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
    images: ['https://bowlz.iloop.me/logos/brekkiwbowlz.png'],
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
    'og:image:width': '800',
    'og:image:height': '800',
    'og:image:type': 'image/png',
    'og:image:secure_url': 'https://bowlz.iloop.me/logos/brekkiwbowlz.png',
    'og:image:alt': 'Brekkie Bowlz RTB Logo',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 min-h-screen`}>
        <div className="max-w-sm mx-auto bg-white min-h-screen shadow-2xl md:rounded-3xl md:my-4 md:min-h-[calc(100vh-2rem)] overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  )
}