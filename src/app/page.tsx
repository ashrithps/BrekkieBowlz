'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { CartItem, CustomerInfo, MenuData, MenuItem } from '@/lib/types'
import { MenuService } from '@/lib/menu-service'
import { calculateTotal, validateForm, getCustomerInfo, saveCustomerInfo, formatPrice } from '@/lib/utils'
import MenuItemCard from '@/components/MenuItemCard'
import CustomerForm from '@/components/CustomerForm'
import OrderSummary from '@/components/OrderSummary'
import Header from '@/components/Header'
import UPIPayment from '@/components/UPIPayment'
import WhatsAppCheckout from '@/components/WhatsAppCheckout'
import DateSelector from '@/components/DateSelector'

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    mobile: '',
    apartmentNumber: '',
    towerNumber: '',
    deliveryDate: '',
    comments: ''
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [menuData, setMenuData] = useState<MenuData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load menu data and customer info on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await MenuService.fetchMenuData()
        setMenuData(data)
        const savedCustomerInfo = getCustomerInfo()
        setCustomerInfo(savedCustomerInfo)
      } catch (error) {
        console.error('Failed to load menu data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  // Auto-save customer info when it changes
  useEffect(() => {
    if (customerInfo.mobile || customerInfo.apartmentNumber || customerInfo.towerNumber) {
      saveCustomerInfo(customerInfo)
    }
  }, [customerInfo])

  const addToCart = (menuItem: any, customizations?: any[]) => {
    // Check if we can add more of this item (across all customizations)
    const totalInCart = getTotalQuantityInCart(menuItem.id)
    if (totalInCart >= menuItem.qtyAvailable) {
      return // Can't add more, already at stock limit
    }

    setCartItems(prev => {
      const itemId = customizations && customizations.length > 0 
        ? `${menuItem.id}-${customizations.map(c => c.id).join('-')}`
        : menuItem.id
      
      const existingItem = prev.find(item => item.id === itemId)
      
      if (existingItem) {
        return prev.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      
      const customizationPrice = customizations ? customizations.reduce((total, c) => total + c.priceChange, 0) : 0
      const itemWithCustomizations = {
        ...menuItem,
        id: itemId,
        price: menuItem.price + customizationPrice,
        customizations: customizations || [],
        quantity: 1,
        baseItemId: menuItem.id, // Store the original item ID for stock tracking
        qtyAvailable: menuItem.qtyAvailable // Keep the original stock limit
      }
      
      
      return [...prev, itemWithCustomizations]
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    // Handle special case for removing items with customizations
    if (id.endsWith('-remove-one')) {
      const baseItemId = id.replace('-remove-one', '')
      setCartItems(prev => {
        // Find the first item with this base item ID and remove one quantity
        const items = prev.filter(item => item.id === baseItemId || item.id.startsWith(`${baseItemId}-`))
        if (items.length === 0) return prev
        
        // Find the item with the highest quantity to reduce from
        const itemToReduce = items.reduce((max, current) => 
          current.quantity > max.quantity ? current : max
        )
        
        if (itemToReduce.quantity === 1) {
          // Remove the item entirely
          return prev.filter(item => item.id !== itemToReduce.id)
        } else {
          // Reduce quantity by 1
          return prev.map(item =>
            item.id === itemToReduce.id ? { ...item, quantity: item.quantity - 1 } : item
          )
        }
      })
      return
    }

    if (quantity === 0) {
      setCartItems(prev => prev.filter(item => item.id !== id))
    } else {
      setCartItems(prev => {
        const item = prev.find(item => item.id === id)
        if (!item) return prev
        
        // Get the base item ID for stock checking
        const baseItemId = item.baseItemId || item.id
        const totalInCart = getTotalQuantityInCart(baseItemId)
        const currentItemQuantity = item.quantity
        const quantityChange = quantity - currentItemQuantity
        
        // Check if the new total would exceed stock
        if (totalInCart + quantityChange > item.qtyAvailable) {
          return prev // Don't update if it would exceed stock
        }
        
        return prev.map(cartItem =>
          cartItem.id === id ? { ...cartItem, quantity } : cartItem
        )
      })
    }
  }

  const handleDateChange = (date: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      deliveryDate: date
    }))
  }

  const handlePaymentSuccess = () => {
    setCartItems([])
    setErrors({})
    setIsSubmitting(false)
    // Note: customerInfo is preserved for future orders
  }

  const total = calculateTotal(cartItems)

  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0)
  const deliveryInfoRef = useRef<HTMLDivElement>(null)

  const scrollToDeliveryInfo = () => {
    if (deliveryInfoRef.current) {
      deliveryInfoRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  // Calculate total quantity in cart for a base menu item (across all customizations)
  const getTotalQuantityInCart = (baseItemId: string) => {
    return cartItems
      .filter(item => item.id === baseItemId || item.id.startsWith(`${baseItemId}-`))
      .reduce((total, item) => total + item.quantity, 0)
  }

  // Find the cart item ID for a base item (for items without customizations)
  const findCartItemIdByBaseId = (baseItemId: string) => {
    const item = cartItems.find(item => item.id === baseItemId)
    return item ? item.id : null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    )
  }

  if (!menuData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load menu data</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-pink-500 text-white px-4 py-2 rounded-full"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!MenuService.isStoreOpen(menuData.storeConfig)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header cartItemCount={0} />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center px-6">
            <div className="mb-6">
              <Image 
                src="/logos/brekkiebowlz_transparent.png"
                alt="Brekkie Bowlz"
                width={120}
                height={96}
                className="h-24 w-auto mx-auto opacity-60 mb-4"
                priority={false}
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              {menuData.storeConfig.name}
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              {menuData.storeConfig.closedMessage}
            </p>
            <div className="text-sm text-gray-500">
              🕒 We&apos;ll be back during operating hours
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartItemCount={totalCartItems} onCartClick={scrollToDeliveryInfo} />
      
      <main className="px-4 py-6">
        {/* Hero Section */}
        <section className="mb-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-gray-900 mb-3">
              {menuData?.storeConfig.heroSection?.title || '🥣 Bowls & More'}
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              {menuData?.storeConfig.heroSection?.subtitle || 'Crafted with love, served with passion ✨'}
            </p>
          </div>
          
          {/* Hero Image */}
          <div className="flex items-center justify-center mb-8">
            <Image 
              src="/logos/hero_png.png" 
              alt="Brekkie Bowlz"
              width={200}
              height={128}
              className="h-32 w-auto object-contain animate-fade-in-float"
              priority={true}
              quality={90}
            />
          </div>
        </section>

        {/* Menu Items */}
        <section className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🍽️ Our Menu 🍽️
            </h2>
            <p className="text-gray-600">
              Handcrafted deliciousness in every bite 😋
            </p>
            <div className="w-20 h-1 bg-pink-500 rounded-full mx-auto mt-4"></div>
          </div>
          <div className="space-y-4">
            {menuData.menu.map(item => (
              <MenuItemCard
                key={item.id}
                item={item}
                onAddToCart={addToCart}
                cartQuantity={getTotalQuantityInCart(item.id)}
                onUpdateQuantity={updateQuantity}
                findCartItemId={findCartItemIdByBaseId}
              />
            ))}
          </div>
        </section>

        {/* Order Summary */}
        {cartItems.length > 0 && (
          <div ref={deliveryInfoRef}>
            <OrderSummary items={cartItems} total={total} />
          </div>
        )}

        {/* Customer Form */}
        {cartItems.length > 0 && (
          <CustomerForm
            customerInfo={customerInfo}
            onChange={setCustomerInfo}
            errors={errors}
          />
        )}

        {/* Date Selector */}
        {cartItems.length > 0 && (
          <DateSelector
            selectedDate={customerInfo.deliveryDate}
            onDateChange={handleDateChange}
            skipDates={menuData.storeConfig.skipDates}
          />
        )}

        {/* Dynamic Checkout - Payment or WhatsApp */}
        {cartItems.length > 0 && (
          <>
            {(!menuData.storeConfig.checkout_type || menuData.storeConfig.checkout_type === 'payment') ? (
              <UPIPayment
                cartItems={cartItems}
                customerInfo={customerInfo}
                onPaymentSuccess={handlePaymentSuccess}
                isSubmitting={isSubmitting}
                errors={errors}
                setErrors={setErrors}
              />
            ) : (
              <WhatsAppCheckout
                cartItems={cartItems}
                customerInfo={customerInfo}
                onOrderSuccess={handlePaymentSuccess}
                isSubmitting={isSubmitting}
                errors={errors}
                setErrors={setErrors}
              />
            )}
          </>
        )}

        {/* Empty Cart Message */}
        {cartItems.length === 0 && (
          <div className="text-center py-16">
            <div className="flex justify-center mb-6">
              <Image 
                src="/logos/brekkiebowlz_transparent.png"
                alt="Brekkie Bowlz"
                width={160}
                height={128}
                className="h-32 w-auto opacity-60"
                priority={false}
              />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Your cart is empty 😢
            </h3>
            <p className="text-gray-600">
              Add some delicious items to get started! 🍓✨
            </p>
          </div>
        )}
      </main>

      {/* Floating Cart Button */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <button
            onClick={scrollToDeliveryInfo}
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center space-x-3"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
              <path stroke="currentColor" strokeWidth="2" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/>
            </svg>
            <span>View Cart • {formatPrice(total)}</span>
            <div className="bg-white bg-opacity-20 rounded-full px-2 py-1">
              <span className="text-sm font-bold">{totalCartItems}</span>
            </div>
          </button>
        </div>
      )}
    </div>
  )
}