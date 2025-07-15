export interface Customization {
  id: string
  name: string
  description: string
  priceChange: number
  type: 'add' | 'remove' | 'substitute'
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  ingredients?: string[]
  customizations?: Customization[]
  qtyAvailable: number
}

export interface StoreConfig {
  isOpen: boolean
  name: string
  closedMessage: string
  skipDates: string[]
  operatingHours: {
    open: string
    close: string
  }
  heroSection?: {
    title: string
    subtitle: string
  }
  checkout_type?: 'payment' | 'whatsapp'
}

export interface MenuData {
  storeConfig: StoreConfig
  menu: MenuItem[]
}

export interface CartItem extends MenuItem {
  quantity: number
  baseItemId?: string
}

export interface CustomerInfo {
  name: string
  mobile: string
  apartmentNumber: string
  towerNumber: string
  deliveryDate: string
  comments?: string
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