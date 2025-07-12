'use client'

import { CartItem, CustomerInfo } from '@/lib/types'
import { calculateTotal, formatOrderData, sendOrderWebhook, validateForm } from '@/lib/utils'

interface UPIPaymentProps {
  cartItems: CartItem[]
  customerInfo: CustomerInfo
  onPaymentSuccess: () => void
  isSubmitting: boolean
  errors: { [key: string]: string }
  setErrors: (errors: { [key: string]: string }) => void
}

const paymentApps = [
  {
    id: 'phonepe',
    name: 'PhonePe',
    package: 'com.phonepe.app',
    scheme: 'phonepe://pay',
    logo: 'PhonePe',
    color: 'bg-purple-600',
    textColor: 'text-white'
  },
  {
    id: 'gpay',
    name: 'Google Pay',
    package: 'com.google.android.apps.nbu.paisa.user',
    scheme: 'tez://upi/pay',
    logo: 'GPay',
    color: 'bg-blue-600',
    textColor: 'text-white'
  },
  {
    id: 'bhim',
    name: 'BHIM',
    package: 'in.org.npci.upiapp',
    scheme: 'upi://pay',
    logo: 'BHIM',
    color: 'bg-orange-600',
    textColor: 'text-white'
  },
  {
    id: 'paytm',
    name: 'Paytm',
    package: 'net.one97.paytm',
    scheme: 'paytm://pay',
    logo: 'Paytm',
    color: 'bg-blue-500',
    textColor: 'text-white'
  }
]

const UPI_ID = 'bowlz@axl'
const PAYEE_NAME = 'Shruthi M'

export default function UPIPayment({ cartItems, customerInfo, onPaymentSuccess, isSubmitting, errors, setErrors }: UPIPaymentProps) {
  const total = calculateTotal(cartItems)

  const generateUPIIntent = (app: typeof paymentApps[0]) => {
    const orderData = formatOrderData(cartItems, customerInfo, total)
    const transactionNote = `Order from ${customerInfo.mobile}`
    const transactionRef = `TXN_${Date.now()}`
    
    const upiParams = new URLSearchParams({
      pa: UPI_ID,
      pn: PAYEE_NAME,
      am: total.toString(),
      cu: 'INR',
      tn: transactionNote,
      tr: transactionRef
    })

    // Return app-specific deep link
    return `${app.scheme}?${upiParams.toString()}`
  }

  const handlePayment = async (app: typeof paymentApps[0]) => {
    // Validate form before proceeding
    const formErrors = validateForm(customerInfo)
    setErrors(formErrors)

    if (Object.keys(formErrors).length > 0 || cartItems.length === 0) {
      return
    }

    try {
      const upiIntent = generateUPIIntent(app)
      
      // Create order data for webhook
      const orderData = formatOrderData(cartItems, customerInfo, total)
      
      // Send webhook first
      await sendOrderWebhook(orderData)
      
      // Then trigger UPI payment with app-specific intent
      window.location.href = upiIntent
      
      // Call success callback
      onPaymentSuccess()
    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment failed. Please try again.')
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
        💳 Choose Payment Method
      </h3>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-xl">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-700">Total Amount:</span>
          <span className="text-2xl font-bold text-pink-600">₹{total}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {paymentApps.map((app) => (
          <button
            key={app.id}
            onClick={() => handlePayment(app)}
            disabled={isSubmitting}
            className={`${app.color} ${app.textColor} p-4 rounded-xl font-bold text-center transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex flex-col items-center justify-center min-h-[80px]`}
          >
            <div className="text-lg font-black mb-1">{app.logo}</div>
            <div className="text-xs opacity-90">{app.name}</div>
          </button>
        ))}
      </div>

      <div className="mt-6 text-center text-sm text-gray-600">
        <p>🔒 Secure UPI Payment</p>
        <p className="mt-1">Pay to: {PAYEE_NAME} ({UPI_ID})</p>
      </div>
    </div>
  )
}