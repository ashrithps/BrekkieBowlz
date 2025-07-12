export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  ingredients?: string[]
}

export interface CartItem extends MenuItem {
  quantity: number
}

export interface CustomerInfo {
  mobile: string
  apartmentNumber: string
  towerNumber: string
  deliveryDate: string
}

export interface DeliveryDate {
  date: string
  label: string
  dayName: string
  dateDisplay: string
}

export interface Order {
  items: CartItem[]
  customerInfo: CustomerInfo
  total: number
  timestamp: Date
}