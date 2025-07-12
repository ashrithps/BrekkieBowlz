import { CustomerInfo } from '@/lib/types'

interface CustomerFormProps {
  customerInfo: CustomerInfo
  onChange: (info: CustomerInfo) => void
  errors: { [key: string]: string }
  onSubmit: () => void
  isSubmitting: boolean
}

export default function CustomerForm({ 
  customerInfo, 
  onChange, 
  errors, 
  onSubmit, 
  isSubmitting 
}: CustomerFormProps) {
  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    onChange({
      ...customerInfo,
      [field]: value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <div className="card-glass rounded-3xl p-6 mb-8 border border-white/30 shadow-2xl">
      <h3 className="text-xl font-black gradient-text mb-6 flex items-center">
        <span className="mr-3 text-2xl">📝</span>
        Delivery Information
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number *
          </label>
          <input
            id="mobile"
            type="tel"
            value={customerInfo.mobile}
            onChange={(e) => handleInputChange('mobile', e.target.value)}
            placeholder="Enter 10-digit mobile number"
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors duration-200 ${
              errors.mobile ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            maxLength={10}
          />
          {errors.mobile && (
            <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
          )}
        </div>

        <div>
          <label htmlFor="apartment" className="block text-sm font-medium text-gray-700 mb-1">
            Apartment Number *
          </label>
          <input
            id="apartment"
            type="text"
            value={customerInfo.apartmentNumber}
            onChange={(e) => handleInputChange('apartmentNumber', e.target.value)}
            placeholder="e.g., A-101, B-205"
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors duration-200 ${
              errors.apartmentNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.apartmentNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.apartmentNumber}</p>
          )}
        </div>

        <div>
          <label htmlFor="tower" className="block text-sm font-medium text-gray-700 mb-1">
            Tower Number *
          </label>
          <input
            id="tower"
            type="text"
            value={customerInfo.towerNumber}
            onChange={(e) => handleInputChange('towerNumber', e.target.value)}
            placeholder="e.g., Tower 1, Block C"
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors duration-200 ${
              errors.towerNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.towerNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.towerNumber}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-4 px-4 rounded-xl transition-all duration-200 hover:from-green-600 hover:to-emerald-700 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <span className="mr-2">📱</span>
              Send Order via WhatsApp
            </>
          )}
        </button>
      </form>
    </div>
  )
}