import { ModeToggle } from "./mode-toggle"
import Link from "next/link"
import { Pokeball } from "./pokeball"

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Pokeball className="w-8 h-8" />
          <span className="font-pixel text-lg hidden sm:inline">Pokédex</span>
        </Link>
        <div className="flex items-center gap-4">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
