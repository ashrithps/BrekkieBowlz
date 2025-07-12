# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BrekkieBowlz is a Next.js 15 food ordering app for smoothie bowls, overnight oats, and specialty coffee. It's a single-page checkout application that allows customers to browse menu items, add them to cart, and submit orders via WhatsApp.

## Development Commands

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler without emitting files

## Architecture

### Core Structure
- **Next.js App Router**: Uses `src/app/` directory structure with `layout.tsx` and `page.tsx`
- **TypeScript**: Strict mode enabled with path aliases (`@/*` maps to `./src/*`)
- **Tailwind CSS**: Custom theme with primary (pink) and secondary (blue) color palettes
- **Client-side only**: Single page app with all state management via React hooks

### Key Components
- `src/app/page.tsx` - Main checkout page with cart management and order submission
- `src/components/MenuItemCard.tsx` - Individual menu item display and add-to-cart
- `src/components/CustomerForm.tsx` - Customer info collection form
- `src/components/OrderSummary.tsx` - Cart summary display
- `src/components/Header.tsx` - App header component

### Data Layer
- `src/lib/types.ts` - TypeScript interfaces for MenuItem, CartItem, CustomerInfo, Order
- `src/lib/menu-data.ts` - Static menu items array
- `src/lib/utils.ts` - Utility functions for pricing, WhatsApp integration, form validation

### Key Features
- **Cart Management**: Add/remove items, update quantities
- **Form Validation**: Mobile number (Indian format), apartment/tower details
- **WhatsApp Integration**: Orders are sent via WhatsApp to phone number 919742462600
- **Image Integration**: Uses Unsplash images with domains configured in next.config.js

## Design System

### Visual Theme
- **Mobile-first design** inspired by modern food delivery apps
- **Pink gradient background** (#e91e63 to #880e4f) with white phone container
- **Acai branding** with clean "acai" logo in header
- **Card-based layout** with rounded corners and subtle shadows

### Component Styling
- **Header**: Three-column layout with hamburger menu, "acai" logo, and cart icon
- **Hero Section**: Large circular image with pink border, centered title, and CTA button
- **Menu Cards**: Horizontal layout with thumbnail images, "Customized" labels, and pricing
- **Buttons**: Pink (#ec4899) with rounded-full styling and white text
- **Phone Container**: Max-width 375px, white background, rounded on desktop

### Responsive Behavior
- **Mobile**: Full-width container, no border radius
- **Desktop**: Centered container with 25px border radius and shadow
- **Fixed Elements**: Bottom navigation button with pink styling

See `styles.md` for complete design system documentation.

## External Dependencies

- Uses Unsplash images (domains: images.unsplash.com, unsplash.com)
- WhatsApp Web API for order submission
- Inter font from Google Fonts
- @tailwindcss/postcss for CSS processing