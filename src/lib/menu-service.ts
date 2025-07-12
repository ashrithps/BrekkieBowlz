import { MenuData, MenuItem } from './types'

const WEBHOOK_URL = 'https://n8n.swooshd.xyz/webhook/4e77ced1-69cd-408e-a90e-d32ec7760c56'

export class MenuService {
  private static cache: MenuData | null = null
  private static lastFetch: number = 0
  private static readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  static async fetchMenuData(): Promise<MenuData> {
    const now = Date.now()
    
    // Return cached data if it's still fresh
    if (this.cache && (now - this.lastFetch) < this.CACHE_DURATION) {
      return this.cache
    }

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: MenuData = await response.json()
      
      // Validate the data structure
      if (!this.isValidMenuData(data)) {
        throw new Error('Invalid menu data structure received from webhook')
      }

      this.cache = data
      this.lastFetch = now
      
      return data
    } catch (error) {
      console.error('Failed to fetch menu data from webhook:', error)
      
      // Return fallback data if webhook fails
      return this.getFallbackMenuData()
    }
  }

  static isStoreOpen(storeConfig: MenuData['storeConfig']): boolean {
    if (!storeConfig.isOpen) {
      return false
    }

    const today = new Date().toISOString().split('T')[0]
    return !storeConfig.skipDates.includes(today)
  }

  static getAvailableDeliveryDates(skipDates: string[]): Array<{
    date: string
    label: string
    dayName: string
    dateDisplay: string
  }> {
    const dates = []
    const today = new Date()
    
    // Always check only the next 4 days (tomorrow + 3 more), don't go beyond that
    for (let dayOffset = 1; dayOffset <= 4; dayOffset++) {
      const date = new Date(today)
      date.setDate(today.getDate() + dayOffset)
      
      const dateString = date.toISOString().split('T')[0]
      
      // Only add dates that are NOT in the skipDates array
      if (!skipDates.includes(dateString)) {
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
        const dateDisplay = date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
        
        let label = dayOffset === 1 ? 'Tomorrow' : `${dayName}, ${dateDisplay}`
        
        dates.push({
          date: dateString,
          label,
          dayName,
          dateDisplay
        })
      }
    }
    
    return dates
  }

  private static isValidMenuData(data: any): data is MenuData {
    return (
      data &&
      typeof data === 'object' &&
      data.storeConfig &&
      typeof data.storeConfig.isOpen === 'boolean' &&
      typeof data.storeConfig.name === 'string' &&
      typeof data.storeConfig.closedMessage === 'string' &&
      Array.isArray(data.storeConfig.skipDates) &&
      Array.isArray(data.menu) &&
      data.menu.every((item: any) => 
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        typeof item.price === 'number'
      )
    )
  }

  private static getFallbackMenuData(): MenuData {
    // Fallback to local menu data if webhook fails
    return {
      storeConfig: {
        isOpen: true,
        name: "BrekkieBowlz",
        closedMessage: "We'll be back soon! Thank you for your patience.",
        skipDates: [],
        operatingHours: {
          open: "08:00",
          close: "20:00"
        }
      },
      menu: [
        {
          id: 'smoothie-bowl',
          name: '🥤 Smoothie Bowl',
          description: '24G Plant Protein, blueberries, strawberries, banana, hazelnuts, pecan nuts, other seeds 🍓🍌',
          price: 299,
          image: '/images/menu/smoothie-bowl.jpg',
          ingredients: ['🌿 24G Plant Protein', '🫐 Blueberries', '🍓 Strawberries', '🍌 Banana', '🌰 Hazelnuts', '🥜 Pecan nuts', '🌱 Seeds'],
          customizations: []
        },
        {
          id: 'overnight-oats',
          name: '🥣 Overnight Oats with Berries and Nuts',
          description: 'Creamy overnight oats topped with fresh berries and crunchy nuts 🫐🥜',
          price: 199,
          image: '/images/menu/overnight-oats.jpg',
          ingredients: ['🌾 Rolled oats', '🫐 Fresh berries', '🥜 Mixed nuts', '🌱 Chia seeds', '🥛 Almond milk', '🍯 Honey'],
          customizations: [
            {
              id: 'no-honey',
              name: 'No Honey',
              description: 'Remove honey from the recipe',
              priceChange: 0,
              type: 'remove'
            }
          ]
        },
        {
          id: 'filter-coffee-hot',
          name: '☕ Filter Black Coffee (Hot)',
          description: 'Freshly Brewed premium beans black filter coffee iced or hot 🔥',
          price: 99,
          image: '/images/menu/filter-coffee.jpg',
          ingredients: ['☕ Premium coffee beans', '💧 Filtered water'],
          customizations: []
        },
        {
          id: 'filter-coffee-iced',
          name: '🧊 Filter Black Coffee (Iced)',
          description: 'Freshly Brewed premium beans black filter coffee iced or hot ❄️',
          price: 99,
          image: '/images/menu/filter-coffee.jpg',
          ingredients: ['☕ Premium coffee beans', '💧 Filtered water', '🧊 Ice'],
          customizations: []
        }
      ]
    }
  }
}