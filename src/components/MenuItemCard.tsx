import Image from 'next/image'
import { MenuItem } from '@/lib/types'
import { formatPrice } from '@/lib/utils'

interface MenuItemCardProps {
  item: MenuItem
  onAddToCart: (item: MenuItem) => void
  cartQuantity: number
  onUpdateQuantity: (id: string, quantity: number) => void
}

export default function MenuItemCard({ 
  item, 
  onAddToCart, 
  cartQuantity, 
  onUpdateQuantity 
}: MenuItemCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex items-start space-x-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to Unsplash images if local images aren't available
                const fallbackUrls = {
                  'smoothie-bowl': 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=200&h=200&fit=crop&crop=center',
                  'overnight-oats': 'https://images.unsplash.com/photo-1517982258267-41e4a6f7ee2c?w=200&h=200&fit=crop&crop=center',
                  'filter-coffee-hot': 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=200&h=200&fit=crop&crop=center',
                  'filter-coffee-iced': 'https://images.unsplash.com/photo-1461023058943-07fcf677d9e2?w=200&h=200&fit=crop&crop=center'
                }
                e.currentTarget.src = fallbackUrls[item.id as keyof typeof fallbackUrls] || fallbackUrls['smoothie-bowl']
              }}
            />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="bg-pink-100 text-pink-700 text-xs font-semibold px-3 py-1 rounded-full mb-2 inline-block">
                ✨ CUSTOMIZED
              </span>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-pink-600 transition-colors duration-200">
                {item.name}
              </h3>
            </div>
            <span className="text-xl font-black text-pink-600">
              {formatPrice(item.price)}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            {item.description}
          </p>

          {cartQuantity === 0 ? (
            <button
              onClick={() => onAddToCart(item)}
              className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2.5 px-5 rounded-xl text-sm hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              🛒 Add to Cart
            </button>
          ) : (
            <div className="flex items-center justify-between bg-pink-50 rounded-xl p-3 border border-pink-100">
              <button
                onClick={() => onUpdateQuantity(item.id, cartQuantity - 1)}
                className="w-8 h-8 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-bold flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 shadow-sm"
              >
                −
              </button>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-pink-600">
                  {cartQuantity}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  🛒 in cart
                </span>
              </div>
              <button
                onClick={() => onUpdateQuantity(item.id, cartQuantity + 1)}
                className="w-8 h-8 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-bold flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 shadow-sm"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}