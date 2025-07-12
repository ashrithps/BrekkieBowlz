import { CustomerInfo } from '@/lib/types'

interface CustomerFormProps {
  customerInfo: CustomerInfo
  onChange: (info: CustomerInfo) => void
  errors: { [key: string]: string }
}

export default function CustomerForm({ 
  customerInfo, 
  onChange, 
  errors
}: CustomerFormProps) {
  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    onChange({
      ...customerInfo,
      [field]: value
    })
  }

  return (
    <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border border-gray-100 animate-in slide-in-from-bottom-4 duration-500">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <span className="mr-3 text-2xl">📝</span>
        Delivery Information 🚚
      </h3>

      {/* Delivery Area Notice */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 mb-6">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">🏢</span>
          <div>
            <h4 className="font-bold text-green-800 text-sm mb-1">
              📍 Delivery Area
            </h4>
            <p className="text-green-700 text-sm font-medium">
              Delivery only within <span className="font-bold">L&T Raintree Boulevard</span>
            </p>
            <p className="text-green-600 text-xs mt-1 flex items-center">
              <span className="mr-1">🚚</span>
              <span className="font-semibold">Delivery charges on us!</span>
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="mobile" className="block text-sm font-bold text-gray-700 mb-2">
            📱 Mobile Number *
          </label>
          <input
            id="mobile"
            type="tel"
            value={customerInfo.mobile}
            onChange={(e) => handleInputChange('mobile', e.target.value)}
            placeholder="Enter 10-digit mobile number"
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-pink-200 focus:border-pink-400 transition-all duration-300 ${
              errors.mobile ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-pink-300 focus:bg-pink-50'
            }`}
            maxLength={10}
          />
          {errors.mobile && (
            <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
          )}
        </div>

        <div>
          <label htmlFor="apartment" className="block text-sm font-bold text-gray-700 mb-2">
            🏠 Apartment Number *
          </label>
          <input
            id="apartment"
            type="text"
            value={customerInfo.apartmentNumber}
            onChange={(e) => handleInputChange('apartmentNumber', e.target.value)}
            placeholder="e.g., A-101, B-205"
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-pink-200 focus:border-pink-400 transition-all duration-300 ${
              errors.apartmentNumber ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-pink-300 focus:bg-pink-50'
            }`}
          />
          {errors.apartmentNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.apartmentNumber}</p>
          )}
        </div>

        <div>
          <label htmlFor="tower" className="block text-sm font-bold text-gray-700 mb-2">
            🏢 Tower Number *
          </label>
          <input
            id="tower"
            type="text"
            value={customerInfo.towerNumber}
            onChange={(e) => handleInputChange('towerNumber', e.target.value)}
            placeholder="e.g., Tower 1, Block C"
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-pink-200 focus:border-pink-400 transition-all duration-300 ${
              errors.towerNumber ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-pink-300 focus:bg-pink-50'
            }`}
          />
          {errors.towerNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.towerNumber}</p>
          )}
        </div>

      </div>
    </div>
  )
}