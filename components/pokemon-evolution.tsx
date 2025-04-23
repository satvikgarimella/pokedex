"use client"

import { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"

interface EvolutionChain {
  species: {
    name: string
    url: string
  }
  evolves_to: EvolutionChain[]
}

interface PokemonEvolutionProps {
  speciesUrl: string
}

export default function PokemonEvolution({ speciesUrl }: PokemonEvolutionProps) {
  const [evolutionChain, setEvolutionChain] = useState<EvolutionChain | null>(null)
  const [evolutionLine, setEvolutionLine] = useState<{ name: string; id: number; sprite: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvolutionChain = async () => {
      setLoading(true)
      try {
        // First, get the evolution chain URL from the species data
        const speciesResponse = await fetch(speciesUrl)
        const speciesData = await speciesResponse.json()

        // Then fetch the evolution chain
        const evolutionResponse = await fetch(speciesData.evolution_chain.url)
        const evolutionData = await evolutionResponse.json()

        setEvolutionChain(evolutionData.chain)

        // Process the evolution chain to get a flat array of evolutions
        const processEvolutionChain = async (chain: EvolutionChain) => {
          const evolutions = []
          let currentEvolution = chain

          while (currentEvolution) {
            const speciesName = currentEvolution.species.name

            // Get the Pokémon ID and sprite
            const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${speciesName}`)
            const pokemonData = await pokemonResponse.json()

            evolutions.push({
              name: speciesName.charAt(0).toUpperCase() + speciesName.slice(1),
              id: pokemonData.id,
              sprite: pokemonData.sprites.other["official-artwork"].front_default || pokemonData.sprites.front_default,
            })

            // Move to the next evolution
            if (currentEvolution.evolves_to.length > 0) {
              currentEvolution = currentEvolution.evolves_to[0]
            } else {
              break
            }
          }

          return evolutions
        }

        const evolutions = await processEvolutionChain(evolutionData.chain)
        setEvolutionLine(evolutions)
      } catch (error) {
        console.error("Error fetching evolution chain:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvolutionChain()
  }, [speciesUrl])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="pokeball-loader">
          <div className="w-8 h-8 rounded-full border-4 border-red-500 border-t-white relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (evolutionLine.length <= 1) {
    return (
      <div className="text-center py-4">
        <p>This Pokémon does not evolve.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h4 className="font-semibold">Evolution Chain</h4>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {evolutionLine.map((pokemon, index) => (
          <div key={pokemon.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className="bg-muted rounded-lg p-2 w-24 h-24 flex items-center justify-center">
                <img
                  src={pokemon.sprite || "/placeholder.svg"}
                  alt={pokemon.name}
                  className="w-16 h-16 object-contain"
                />
              </div>
              <div className="text-center mt-2">
                <p className="text-sm font-medium">{pokemon.name}</p>
                <p className="text-xs text-muted-foreground">#{pokemon.id.toString().padStart(3, "0")}</p>
              </div>
            </div>

            {index < evolutionLine.length - 1 && <ArrowRight className="mx-2 text-muted-foreground" />}
          </div>
        ))}
      </div>
    </div>
  )
}
