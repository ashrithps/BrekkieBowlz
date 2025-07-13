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
  const isLowStock = item.qtyAvailable > 0 && item.qtyAvailable < 10
  const isVeryLowStock = item.qtyAvailable > 0 && item.qtyAvailable < 6
  const canAddMore = cartQuantity < item.qtyAvailable

  const getAvailabilityBadge = () => {
    if (isOutOfStock) {
      return (
        <span className="bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full animate-pulse">
          ❌ SOLD OUT
        </span>
      )
    }
    
    if (isVeryLowStock) {
      return (
        <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-bounce shadow-lg">
          🔥 ONLY {item.qtyAvailable} LEFT!
        </span>
      )
    }
    
    if (isLowStock) {
      return (
        <span className="bg-gradient-to-r from-orange-400 to-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
          ⚡ {item.qtyAvailable} REMAINING
        </span>
      )
    }
    
    return null
  }
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
      {/* Image at top of card */}
      <div className="relative w-full h-48 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover border-b-2 border-pink-100"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          onError={(e) => {
            // Fallback to SVG placeholder
            const target = e.target as HTMLImageElement
            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzIwNyAxNTAgMjEzIDEzMyAyMjAgMTI1QzIyNyAxMzMgMjMzIDE1MCAyNDAgMTUwQzIzMyAxNTcgMjI3IDE3NCAyMjAgMTgyQzIxMyAxNzQgMjA3IDE1NyAyMDAgMTUwWiIgZmlsbD0iI0U5MTZFNCI+CjxwYXRoIGQ9Ik0xNjAgMTcwQzE2NSAxNzAgMTcwIDE1NSAxNzUgMTQ5QzE4MCAxNTUgMTg1IDE3MCAxOTAgMTcwQzE4NSAxNzUgMTgwIDE5MCAxNzUgMTk2QzE3MCAxOTAgMTY1IDE3NSAxNjAgMTcwWiIgZmlsbD0iI0VGNDQ0NCI+Cjx0ZXh0IHg9IjIwMCIgeT0iMjMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjNCMzdBIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9IjUwMCI+Rm9vZCBJbWFnZSBOb3QgQXZhaWxhYmxlPC90ZXh0Pgo8L3N2Zz4='
          }}
        />
      </div>
      
      {/* Content section */}
      <div className="p-5">
        <div className="flex-1">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {getAvailabilityBadge()}
                {item.customizations && item.customizations.length > 0 && (
                  <span className="bg-pink-100 text-pink-700 text-xs font-semibold px-3 py-1 rounded-full">
                    ✨ CUSTOMIZE
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