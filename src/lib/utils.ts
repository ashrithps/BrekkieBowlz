import { CartItem, CustomerInfo, DeliveryDate } from './types'

export const formatPrice = (price: number): string => {
  return `₹${price}`
}

export const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0)
}

export const formatOrderData = (items: CartItem[], customerInfo: CustomerInfo, total: number) => {
  const orderItems = items.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    subtotal: item.price * item.quantity,
    customizations: item.customizations || []
  }))

  return {
    customerInfo: {
      name: customerInfo.name,
      mobile: customerInfo.mobile,
      apartmentNumber: customerInfo.apartmentNumber,
      towerNumber: customerInfo.towerNumber,
      deliveryDate: customerInfo.deliveryDate
    },
    delivery: {
      date: customerInfo.deliveryDate,
      timeSlot: getDeliveryTimeSlot(),
      formattedDate: formatDeliveryDate(customerInfo.deliveryDate)
    },
    items: orderItems,
    total: total,
    timestamp: new Date().toISOString(),
    orderId: `ORDER_${Date.now()}`
  }
}

export const sendOrderWebhook = async (orderData: any): Promise<void> => {
  const webhookURL = 'https://n8n.swooshd.xyz/webhook/565e2509-0f16-4e83-87ab-54c4e9c3479c'
  
  try {
    const response = await fetch(webhookURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    })

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status}`)
    }
  } catch (error) {
    console.error('Webhook error:', error)
    throw error
  }
}

export const formatOrderForWhatsApp = (items: CartItem[], customerInfo: CustomerInfo, total: number): string => {
  const orderItems = items.map(item => {
    let itemText = `• ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`
    
    // Add customizations if any
    if (item.customizations && item.customizations.length > 0) {
      const customizationText = item.customizations
        .map(c => `  ↳ ${c.name}${c.priceChange !== 0 ? ` (${c.priceChange > 0 ? '+' : ''}${formatPrice(c.priceChange)})` : ''}`)
        .join('\n')
      itemText += '\n' + customizationText
    }
    
    return itemText
  }).join('\n')

  let message = `🥤 *Brekkie Bowlz Order*

👤 Name: ${customerInfo.name}
📱 Mobile: ${customerInfo.mobile}
🏠 Apartment: ${customerInfo.apartmentNumber}
🏢 Tower: ${customerInfo.towerNumber}`

  // Add comments if provided
  if (customerInfo.comments && customerInfo.comments.trim()) {
    message += `\n💬 Comments: ${customerInfo.comments.trim()}`
  }

  message += `

*Order Details:*
${orderItems}

💰 *Total: ${formatPrice(total)}*

Thank you for your order! 🙏`

  return message
}

export const generateWhatsAppURL = (message: string, phoneNumber: string = '919742462600'): string => {
  // Use encodeURI instead of encodeURIComponent to preserve emoji characters
  const encodedMessage = encodeURI(message)
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`
}

export const validateMobile = (mobile: string): boolean => {
  const mobileRegex = /^[6-9]\d{9}$/
  return mobileRegex.test(mobile)
}

export const validateForm = (customerInfo: CustomerInfo): { [key: string]: string } => {
  const errors: { [key: string]: string } = {}

  if (!customerInfo.name.trim()) {
    errors.name = 'Name is required'
  } else if (customerInfo.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long'
  }

  if (!customerInfo.mobile) {
    errors.mobile = 'Mobile number is required'
  } else if (!validateMobile(customerInfo.mobile)) {
    errors.mobile = 'Please enter a valid 10-digit mobile number'
  }

  if (!customerInfo.apartmentNumber.trim()) {
    errors.apartmentNumber = 'Apartment number is required'
  }

  if (!customerInfo.towerNumber.trim()) {
    errors.towerNumber = 'Tower number is required'
  }

  if (!customerInfo.deliveryDate) {
    errors.deliveryDate = 'Delivery date is required'
  } else {
    const selectedDate = new Date(customerInfo.deliveryDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (selectedDate < today) {
      errors.deliveryDate = 'Delivery date cannot be in the past'
    }
  }

  return errors
}

const CUSTOMER_INFO_KEY = 'brekkiebowlz_customer_info'

export const saveCustomerInfo = (customerInfo: CustomerInfo): void => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(CUSTOMER_INFO_KEY, JSON.stringify(customerInfo))
    }
  } catch (error) {
    console.warn('Failed to save customer info to localStorage:', error)
  }
}

export const getCustomerInfo = (): CustomerInfo => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem(CUSTOMER_INFO_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        const defaultDeliveryDate = tomorrow.toISOString().split('T')[0]
        
        return {
          name: parsed.name || '',
          mobile: parsed.mobile || '',
          apartmentNumber: parsed.apartmentNumber || '',
          towerNumber: parsed.towerNumber || '',
          deliveryDate: parsed.deliveryDate || defaultDeliveryDate,
          comments: parsed.comments || ''
        }
      }
    }
  } catch (error) {
    console.warn('Failed to load customer info from localStorage:', error)
  }
  
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const defaultDeliveryDate = tomorrow.toISOString().split('T')[0]
  
  return {
    name: '',
    mobile: '',
    apartmentNumber: '',
    towerNumber: '',
    deliveryDate: defaultDeliveryDate,
    comments: ''
  }
}

export const clearCustomerInfo = (): void => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(CUSTOMER_INFO_KEY)
    }
  } catch (error) {
    console.warn('Failed to clear customer info from localStorage:', error)
  }
}

export const getNextFourDays = (): DeliveryDate[] => {
  const days: DeliveryDate[] = []
  const today = new Date()
  
  for (let i = 1; i <= 4; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    
    const dayName = i === 1 ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'short' })
    const dateDisplay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const isoDate = date.toISOString().split('T')[0]
    
    days.push({
      date: isoDate,
      label: `${dayName}\n${dateDisplay}`,
      dayName,
      dateDisplay
    })
  }
  
  return days
}

export const getDeliveryTimeSlot = (): string => {
  return '9:00 AM - 10:00 AM'
}

export const formatDeliveryDate = (date: string): string => {
  const deliveryDate = new Date(date)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  
  if (deliveryDate.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow'
  }
  
  return deliveryDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  })
}