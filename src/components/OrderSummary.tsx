import { CartItem } from '@/lib/types'
import { formatPrice } from '@/lib/utils'

interface OrderSummaryProps {
  items: CartItem[]
  total: number
}

export default function OrderSummary({ items, total }: OrderSummaryProps) {
  return (
    <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border border-gray-100 animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <span className="mr-3 text-2xl">🛒</span>
          Order Summary ✨
        </h3>
        <div className="bg-pink-100 text-pink-700 px-3 py-2 rounded-full text-sm font-bold animate-pulse">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </div>
      </div>
      
      <div className="space-y-4 mb-6">
        {items.map((item, index) => (
          <div 
            key={item.id} 
            className="flex justify-between items-center p-4 bg-pink-50 rounded-xl border border-pink-100 hover:bg-pink-100 transition-colors duration-200"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex-1">
              <p className="font-bold text-gray-900 mb-2">{item.name}</p>
              <div className="flex items-center space-x-3">
                <span className="bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Qty: {item.quantity}
                </span>
                <span className="text-sm text-gray-600 font-medium">
                  {formatPrice(item.price)} each
                </span>
              </div>
            </div>
            <p className="text-xl font-black text-pink-600">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>
      
      <div className="bg-gradient-to-r from-pink-100 to-pink-200 rounded-xl p-5 border-2 border-pink-300">
        <div className="flex justify-between items-center">
          <span className="text-xl font-black text-gray-900 flex items-center">
            💰 Total:
          </span>
          <span className="text-2xl font-black text-pink-600">
            {formatPrice(total)}
          </span>
        </div>
      </div>
    </div>
  )
}