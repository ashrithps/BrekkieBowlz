export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-4">
      <div className="flex items-center justify-between">
        <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-600">
            <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M3 6h18M3 12h18M3 18h18"/>
          </svg>
        </button>
        
        <div className="text-center">
          <h1 className="text-xl font-black text-purple-600">
            acaí
          </h1>
        </div>
        
        <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors relative">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-600" fill="none">
            <path stroke="currentColor" strokeWidth="2" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/>
          </svg>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">0</span>
          </div>
        </button>
      </div>
    </header>
  )
}