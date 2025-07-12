interface HeaderProps {
  cartItemCount: number
  onCartClick?: () => void
}

export default function Header({ cartItemCount, onCartClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-6">
      <div className="flex items-center justify-between">
        <div className="w-10"></div> {/* Spacer for centering */}
        
        <div className="flex items-center justify-center">
          <img 
            src="/logos/brekkiebowlz_transparent.png"
            alt="Brekkie Bowlz"
            className="h-12 w-auto"
          />
        </div>
        
        <button 
          onClick={onCartClick}
          className="p-2 rounded-full bg-pink-100 hover:bg-pink-200 transition-all duration-200 relative"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-pink-600" fill="none">
            <path stroke="currentColor" strokeWidth="2" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/>
          </svg>
          {cartItemCount > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-white text-xs font-bold">{cartItemCount}</span>
            </div>
          )}
        </button>
      </div>
    </header>
  )
}