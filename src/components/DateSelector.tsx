'use client'

import { DeliveryDate } from '@/lib/types'
import { getNextFourDays, getDeliveryTimeSlot } from '@/lib/utils'

interface DateSelectorProps {
  selectedDate: string
  onDateChange: (date: string) => void
}

export default function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const availableDates = getNextFourDays()
  const deliveryTimeSlot = getDeliveryTimeSlot()

  return (
    <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <span className="mr-3 text-2xl">📅</span>
        Select Delivery Date
      </h3>
      
      {/* Date Selection Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {availableDates.map((dateOption: DeliveryDate) => (
          <button
            key={dateOption.date}
            onClick={() => onDateChange(dateOption.date)}
            className={`p-4 rounded-2xl font-semibold text-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-md min-h-[80px] flex flex-col items-center justify-center ${
              selectedDate === dateOption.date
                ? 'bg-pink-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="text-sm font-bold">{dateOption.dayName}</div>
            <div className="text-xs opacity-90 mt-1">{dateOption.dateDisplay}</div>
          </button>
        ))}
      </div>
      
      {/* Delivery Time Information */}
      <div className="text-center p-4 bg-pink-50 rounded-xl border border-pink-100">
        <div className="flex items-center justify-center text-pink-700">
          <span className="mr-2 text-lg">🕘</span>
          <span className="font-semibold">Orders delivered between {deliveryTimeSlot}</span>
        </div>
      </div>
    </div>
  )
}