import Image from 'next/image'
import { MenuItem, Customization } from '@/lib/types'
import { formatPrice } from '@/lib/utils'
import { useState } from 'react'

interface MenuItemCardProps {
  item: MenuItem
  onAddToCart: (item: MenuItem, customizations?: Customization[]) => void
  cartQuantity: number
  onUpdateQuantity: (id: string, quantity: number) => void
  findCartItemId?: (baseItemId: string) => string | null
}

export default function MenuItemCard({ 
  item, 
  onAddToCart, 
  cartQuantity, 
  onUpdateQuantity,
  findCartItemId
}: MenuItemCardProps) {
  const [selectedCustomizations, setSelectedCustomizations] = useState<Customization[]>([])
  const [showCustomizations, setShowCustomizations] = useState(false)

  const handleCustomizationToggle = (customization: Customization) => {
    setSelectedCustomizations(prev => {
      const exists = prev.find(c => c.id === customization.id)
      if (exists) {
        return prev.filter(c => c.id !== customization.id)
      } else {
        return [...prev, customization]
      }
    })
  }

  const getTotalPrice = () => {
    const customizationPrice = selectedCustomizations.reduce((total, c) => total + c.priceChange, 0)
    return item.price + customizationPrice
  }

  const handleAddToCart = () => {
    if (item.qtyAvailable > 0) {
      onAddToCart(item, selectedCustomizations)
      setSelectedCustomizations([])
      setShowCustomizations(false)
    }
  }

  const isOutOfStock = item.qtyAvailable === 0
  const isLowStock = item.qtyAvailable > 0 && item.qtyAvailable <= 3
  const canAddMore = cartQuantity < item.qtyAvailable
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
              <div className="flex items-center gap-2 mb-2">
                {item.customizations && item.customizations.length > 0 && (
                  <span className="bg-pink-100 text-pink-700 text-xs font-semibold px-3 py-1 rounded-full">
                    ✨ CUSTOMIZE
                  </span>
                )}
                {isOutOfStock && (
                  <span className="bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">
                    ❌ OUT OF STOCK
                  </span>
                )}
                {isLowStock && !isOutOfStock && (
                  <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">
                    ⚠️ LOW STOCK ({item.qtyAvailable} left)
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-pink-600 transition-colors duration-200">
                {item.name}
              </h3>
            </div>
            <div className="text-right">
              {selectedCustomizations.length > 0 && (
                <div className="text-sm text-gray-500 line-through">
                  {formatPrice(item.price)}
                </div>
              )}
              <span className="text-xl font-black text-pink-600">
                {formatPrice(getTotalPrice())}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            {item.description}
          </p>

          {/* Customizations */}
          {item.customizations && item.customizations.length > 0 && (
            <div className="mb-4">
              <button
                onClick={() => setShowCustomizations(!showCustomizations)}
                className="text-sm text-pink-600 font-medium hover:text-pink-700 flex items-center mb-2"
              >
                🔧 Customize
                <span className="ml-1">{showCustomizations ? '▲' : '▼'}</span>
              </button>
              
              {showCustomizations && (
                <div className="space-y-2 mt-2">
                  {item.customizations.map((customization) => (
                    <label
                      key={customization.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedCustomizations.some(c => c.id === customization.id)}
                          onChange={() => handleCustomizationToggle(customization)}
                          className="mr-2 text-pink-500 focus:ring-pink-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {customization.name}
                        </span>
                      </div>
                      {customization.priceChange !== 0 && (
                        <span className="text-sm text-gray-600">
                          {customization.priceChange > 0 ? '+' : ''}{formatPrice(customization.priceChange)}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {cartQuantity === 0 ? (
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`font-semibold py-2.5 px-5 rounded-xl text-sm transition-all duration-200 shadow-sm ${
                isOutOfStock
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-pink-500 hover:bg-pink-600 text-white hover:scale-105 active:scale-95 hover:shadow-md'
              }`}
            >
              {isOutOfStock ? '❌ Out of Stock' : '🛒 Add to Cart'}
            </button>
          ) : (
            <div className="flex items-center justify-between bg-pink-50 rounded-xl p-3 border border-pink-100">
              <button
                onClick={() => {
                  if (item.customizations && item.customizations.length > 0) {
                    // For items with customizations, we need a different approach
                    // Let's pass a special function to handle this
                    if (onUpdateQuantity) {
                      onUpdateQuantity(`${item.id}-remove-one`, 0);
                    }
                  } else {
                    // For items without customizations, use normal quantity update
                    const cartItemId = findCartItemId ? findCartItemId(item.id) : item.id;
                    if (cartItemId) onUpdateQuantity(cartItemId, cartQuantity - 1);
                  }
                }}
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
                onClick={() => {
                  if (item.customizations && item.customizations.length > 0) {
                    // For items with customizations, add a new item with default customizations
                    onAddToCart(item, []);
                  } else {
                    // For items without customizations, use normal quantity update
                    const cartItemId = findCartItemId ? findCartItemId(item.id) : item.id;
                    if (cartItemId) onUpdateQuantity(cartItemId, cartQuantity + 1);
                  }
                }}
                disabled={!canAddMore}
                className={`w-8 h-8 rounded-full font-bold flex items-center justify-center transition-all duration-200 shadow-sm ${
                  canAddMore
                    ? 'bg-pink-500 hover:bg-pink-600 text-white hover:scale-110 active:scale-95'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
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