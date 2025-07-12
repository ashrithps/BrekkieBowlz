# BrekkieBowlz Design System

## Design Inspiration
The design is inspired by the modern mobile app aesthetic with clean lines, rounded corners, and a pink color scheme reminiscent of acai bowl branding.

## Color Palette

### Primary Colors
- **Pink 500**: `#ec4899` - Primary brand color, used for buttons and accents
- **Pink 600**: `#db2777` - Darker pink for hover states and brand text
- **Pink Gradient**: Linear gradient from `#e91e63` to `#ad1457` to `#880e4f` - Background gradient

### Neutral Colors
- **White**: `#ffffff` - Container backgrounds, text on colored backgrounds
- **Gray 50**: `#f9fafb` - Light gray for card backgrounds
- **Gray 500**: `#6b7280` - Muted text and labels
- **Gray 600**: `#4b5563` - Secondary text
- **Gray 800**: `#1f2937` - Primary text

## Layout Structure

### Mobile-First Design
- **Container Width**: Max 375px (iPhone width)
- **Responsive Behavior**: 
  - Mobile: Full width with no border radius
  - Desktop: Centered with rounded corners (25px) and shadow
- **Phone Container**: White background with subtle shadow on desktop

### Spacing System
- **Padding**: 16px (4 Tailwind units) for main content areas
- **Margins**: Consistent 24px (6 Tailwind units) between sections
- **Component Spacing**: 16px between related elements

## Typography

### Font Family
- **Primary**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Text Hierarchy
- **Brand Title**: 20px, font-weight 700, pink-600
- **Hero Title**: 24px, font-weight 600, pink-600
- **Section Headers**: 18px, font-weight 600, gray-800
- **Card Titles**: 16px, font-weight 500, gray-800
- **Body Text**: 14px, font-weight 400, gray-600
- **Labels**: 12px, font-weight 400, uppercase, gray-500

## Component Styles

### Header
- **Background**: White with sticky positioning
- **Layout**: Three-column layout (menu, logo, cart)
- **Icons**: 24px, gray-600 color
- **Brand Logo**: "acai" in pink-600, font-weight 700

### Hero Section
- **Image Container**: 256px circular with 4px pink-500 border
- **Image**: Rounded full with object-cover
- **Title**: Pink-600 color, centered
- **CTA Button**: Full-width, pink-500 background, rounded-full, white text

### Menu Cards
- **Background**: Gray-50 (#f9fafb)
- **Border Radius**: 16px (xl in Tailwind)
- **Padding**: 16px
- **Layout**: Horizontal flex with image and content
- **Image**: 64px square with rounded-xl corners
- **Label**: "Customized" in uppercase, gray-500
- **Price**: Right-aligned, gray-800, font-weight 600

### Buttons

#### Primary Button (CTA)
- **Background**: Pink-500 (#ec4899)
- **Text**: White, font-weight 600
- **Padding**: 16px vertical, 24px horizontal
- **Border Radius**: Full (9999px)
- **Font Size**: 18px

#### Secondary Button (Add to Cart)
- **Background**: Transparent
- **Text**: Pink-500, font-weight 500
- **Font Size**: 14px

#### Quantity Controls
- **Size**: 24px circle
- **Background**: Pink-500
- **Text**: White, centered
- **Border Radius**: Full

### Fixed Elements
- **Bottom Button**: Fixed positioning, 16px from edges
- **Z-index**: Ensures visibility above content

## Interactive States

### Hover Effects
- **Buttons**: Slight color darkening
- **Cards**: Subtle scale transform (1.02x)

### Active States
- **Buttons**: Scale down (0.98x) for tactile feedback

## Responsive Behavior

### Mobile (< 768px)
- Full-width container
- No border radius on main container
- Touch-optimized spacing

### Desktop (≥ 768px)
- Centered container with max-width
- Rounded corners on main container
- Box shadow for depth
- Margins around container

## Accessibility Considerations
- High contrast ratios for text readability
- Touch targets minimum 44px for mobile
- Semantic HTML structure
- Alt text for images
- Focus states for keyboard navigation

## File Structure
- **Global Styles**: `src/app/globals.css`
- **Component Styles**: Inline Tailwind classes
- **Custom CSS**: Phone container and responsive utilities