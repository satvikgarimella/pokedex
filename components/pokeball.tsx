export function Pokeball({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="w-full h-full rounded-full border-4 border-black overflow-hidden">
        <div className="w-full h-1/2 bg-red-500"></div>
        <div className="w-full h-1/2 bg-white"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1/4 h-1/4 bg-white border-4 border-black rounded-full"></div>
        </div>
      </div>
    </div>
  )
}
