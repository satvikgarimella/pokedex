"use client"

import { useEffect, useState } from "react"
import PokemonCard from "./pokemon-card"
import { useSearchParams } from "next/navigation"
import { Button } from "./ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Pokemon {
  id: number
  name: string
  types: string[]
  sprite: string
}

export default function PokemonGrid() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [favorites, setFavorites] = useState<number[]>([])
  const pokemonPerPage = 20

  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search") || ""
  const typeFilter = searchParams.get("type") || ""
  const showFavorites = searchParams.get("favorites") === "true"

  useEffect(() => {
    // Load favorites from localStorage
    const storedFavorites = localStorage.getItem("pokemonFavorites")
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }

    // Fetch all 151 original Pokémon
    const fetchPokemon = async () => {
      setLoading(true)
      try {
        // Fetch all 151 Pokémon in one go to avoid multiple API calls
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
        const data = await response.json()

        // Fetch details for each Pokémon
        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon: { url: string }) => {
            const res = await fetch(pokemon.url)
            return await res.json()
          }),
        )

        // Format the data
        const formattedPokemon = pokemonDetails.map((p) => ({
          id: p.id,
          name: p.name.charAt(0).toUpperCase() + p.name.slice(1),
          types: p.types.map((type: { type: { name: string } }) => type.type.name),
          sprite: p.sprites.other["official-artwork"].front_default || p.sprites.front_default,
        }))

        setPokemon(formattedPokemon)
      } catch (error) {
        console.error("Error fetching Pokémon:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPokemon()
  }, [])

  // Filter Pokémon based on search query and type
  const filteredPokemon = pokemon.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter ? p.types.includes(typeFilter.toLowerCase()) : true
    const matchesFavorites = showFavorites ? favorites.includes(p.id) : true

    return matchesSearch && matchesType && matchesFavorites
  })

  // Pagination
  const totalPages = Math.ceil(filteredPokemon.length / pokemonPerPage)
  const startIndex = (currentPage - 1) * pokemonPerPage
  const endIndex = startIndex + pokemonPerPage
  const currentPokemon = filteredPokemon.slice(startIndex, endIndex)

  const toggleFavorite = (id: number) => {
    const newFavorites = favorites.includes(id) ? favorites.filter((favId) => favId !== id) : [...favorites, id]

    setFavorites(newFavorites)
    localStorage.setItem("pokemonFavorites", JSON.stringify(newFavorites))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="pokeball-loader">
          <div className="w-16 h-16 rounded-full border-8 border-red-500 border-t-white relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {currentPokemon.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            isFavorite={favorites.includes(pokemon.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>

      {filteredPokemon.length === 0 && (
        <div className="text-center py-10">
          <p className="text-xl">No Pokémon found matching your criteria</p>
        </div>
      )}

      {filteredPokemon.length > pokemonPerPage && (
        <div className="flex justify-center items-center mt-8 gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="mx-2">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
