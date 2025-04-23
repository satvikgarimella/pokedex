import { Suspense } from "react"
import PokemonGrid from "@/components/pokemon-grid"
import SearchFilters from "@/components/search-filters"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 font-pixel">Pokédex</h1>
        <p className="text-lg text-center text-muted-foreground mb-6">The Original 151 Pokémon from Generation I</p>
        <SearchFilters />
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-bounce">
              <div className="w-16 h-16 rounded-full border-8 border-red-500 border-t-white animate-spin relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        }
      >
        <PokemonGrid />
      </Suspense>
    </main>
  )
}
