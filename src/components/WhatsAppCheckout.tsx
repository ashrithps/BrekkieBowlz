'use client'

import Image from 'next/image'
import { useState } from 'react'
import { CartItem, CustomerInfo } from '@/lib/types'
import { calculateTotal, formatOrderForWhatsApp, generateWhatsAppURL, validateForm } from '@/lib/utils'

interface WhatsAppCheckoutProps {
  cartItems: CartItem[]
  customerInfo: CustomerInfo
  onOrderSuccess: () => void
  isSubmitting: boolean
  errors: { [key: string]: string }
  setErrors: (errors: { [key: string]: string }) => void
}

export default function WhatsAppCheckout({ 
  cartItems, 
  customerInfo, 
  onOrderSuccess, 
  isSubmitting, 
  errors, 
  setErrors 
}: WhatsAppCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false)
  const total = calculateTotal(cartItems)

  const handleWhatsAppOrder = async () => {
    // Validate form before proceeding
    const formErrors = validateForm(customerInfo)
    setErrors(formErrors)

    if (Object.keys(formErrors).length > 0 || cartItems.length === 0) {
      return
    }

    setIsLoading(true)

    try {
      // Format order message for WhatsApp
      const orderMessage = formatOrderForWhatsApp(cartItems, customerInfo, total)
      
      // Generate WhatsApp URL with order details
      const whatsappURL = generateWhatsAppURL(orderMessage, '919742462600')
      
      // Open WhatsApp with the order
      window.open(whatsappURL, '_blank')
      
      // Call success callback
      onOrderSuccess()
      
    } catch (error) {
      console.error('WhatsApp order error:', error)
      alert('Failed to send order via WhatsApp. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
        📱 Send Order via WhatsApp
      </h3>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-xl">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-700">Total Amount:</span>
          <span className="text-2xl font-bold text-green-600">₹{total}</span>
        </div>
      </div>

      <div className="mb-4 p-4 bg-pink-50 rounded-xl border border-pink-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-pink-600 text-lg">💬</span>
          <span className="text-sm font-medium text-pink-700">How it works:</span>
        </div>
        <div className="text-xs text-pink-600 space-y-1">
          <p>• Your order details will be sent to our WhatsApp</p>
          <p>• We&apos;ll confirm your order and delivery time</p>
          <p>• Payment can be made on delivery or via UPI</p>
        </div>
      </div>

      <button
        onClick={handleWhatsAppOrder}
        disabled={isSubmitting || isLoading}
        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-3 min-h-[60px]"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Opening WhatsApp...</span>
          </>
        ) : (
          <>
            <Image
              src="/payment_logos/icons8-whatsapp.svg"
              alt="WhatsApp"
              width={28}
              height={28}
              className="filter brightness-0 invert"
            />
            <span>Send Order via WhatsApp</span>
          </>
        )}
      </button>

      <div className="mt-4 text-center text-sm text-gray-600">
        <p>🔒 Secure order via WhatsApp</p>
        <p className="mt-1">Message will be sent to: +91 97424 62600</p>
      </div>
    </div>
  )
}