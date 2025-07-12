import { MenuItem } from './types'

export const menuItems: MenuItem[] = [
  {
    id: 'smoothie-bowl',
    name: '🥤 Smoothie Bowl',
    description: '24G Plant Protein, blueberries, strawberries, banana, hazelnuts, pecan nuts, other seeds 🍓🍌',
    price: 299,
    image: '/images/menu/smoothie-bowl.jpg',
    ingredients: ['🌿 24G Plant Protein', '🫐 Blueberries', '🍓 Strawberries', '🍌 Banana', '🌰 Hazelnuts', '🥜 Pecan nuts', '🌱 Seeds'],
    qtyAvailable: 8
  },
  {
    id: 'overnight-oats',
    name: '🥣 Overnight Oats with Berries and Nuts',
    description: 'Creamy overnight oats topped with fresh berries and crunchy nuts 🫐🥜',
    price: 199,
    image: '/images/menu/overnight-oats.jpg',
    ingredients: ['🌾 Rolled oats', '🫐 Fresh berries', '🥜 Mixed nuts', '🌱 Chia seeds', '🥛 Almond milk'],
    qtyAvailable: 0
  },
  {
    id: 'filter-coffee-hot',
    name: '☕ Filter Black Coffee (Hot)',
    description: 'Freshly Brewed premium beans black filter coffee iced or hot 🔥',
    price: 99,
    image: '/images/menu/filter-coffee.jpg',
    ingredients: ['☕ Premium coffee beans', '💧 Filtered water'],
    qtyAvailable: 2
  },
  {
    id: 'filter-coffee-iced',
    name: '🧊 Filter Black Coffee (Iced)',
    description: 'Freshly Brewed premium beans black filter coffee iced or hot ❄️',
    price: 99,
    image: '/images/menu/filter-coffee.jpg',
    ingredients: ['☕ Premium coffee beans', '💧 Filtered water', '🧊 Ice'],
    qtyAvailable: 4
  }
]