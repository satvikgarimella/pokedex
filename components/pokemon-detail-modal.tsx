"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star } from "lucide-react"
import PokemonStats from "./pokemon-stats"
import PokemonEvolution from "./pokemon-evolution"

interface PokemonDetailModalProps {
  pokemonId: number
  isOpen: boolean
  onClose: () => void
  isFavorite: boolean
  onToggleFavorite: (id: number) => void
}

interface PokemonDetail {
  id: number
  name: string
  types: { type: { name: string } }[]
  sprites: {
    front_default: string
    other: {
      "official-artwork": {
        front_default: string
      }
    }
  }
  height: number
  weight: number
  abilities: { ability: { name: string } }[]
  stats: { base_stat: number; stat: { name: string } }[]
  species: { url: string }
}

export default function PokemonDetailModal({
  pokemonId,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
}: PokemonDetailModalProps) {
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      setLoading(true)
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
        const data = await response.json()
        setPokemon(data)
      } catch (error) {
        console.error("Error fetching Pokémon details:", error)
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      fetchPokemonDetails()
    }
  }, [pokemonId, isOpen])

  const getTypeColor = (type: string) => {
    return `type-${type}`
  }

  if (loading || !pokemon) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="flex justify-center items-center py-12">
            <div className="pokeball-loader">
              <div className="w-12 h-12 rounded-full border-4 border-red-500 border-t-white relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold">
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
            <span className="ml-2 text-sm text-muted-foreground">#{pokemon.id.toString().padStart(3, "0")}</span>
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onToggleFavorite(pokemon.id)
            }}
          >
            <Star className={`h-5 w-5 ${isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`} />
          </Button>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center">
            <div className="bg-muted rounded-lg p-4 w-full flex justify-center">
              <img
                src={
                  pokemon.sprites.other["official-artwork"].front_default ||
                  pokemon.sprites.front_default ||
                  "/placeholder.svg" ||
                  "/placeholder.svg"
                }
                alt={pokemon.name}
                className="h-48 w-48 object-contain transition-transform hover:scale-110"
              />
            </div>
            <div className="flex gap-2 mt-4 justify-center">
              {pokemon.types.map((type) => (
                <Badge key={type.type.name} className={getTypeColor(type.type.name)}>
                  {type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Tabs defaultValue="about">
              <TabsList className="w-full">
                <TabsTrigger value="about" className="flex-1">
                  About
                </TabsTrigger>
                <TabsTrigger value="stats" className="flex-1">
                  Stats
                </TabsTrigger>
                <TabsTrigger value="evolution" className="flex-1">
                  Evolution
                </TabsTrigger>
              </TabsList>
              <TabsContent value="about" className="space-y-4 mt-4">
                <div>
                  <h4 className="font-semibold mb-2">Pokédex Data</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-muted p-2 rounded-md">
                      <p className="text-sm text-muted-foreground">Height</p>
                      <p>{(pokemon.height / 10).toFixed(1)} m</p>
                    </div>
                    <div className="bg-muted p-2 rounded-md">
                      <p className="text-sm text-muted-foreground">Weight</p>
                      <p>{(pokemon.weight / 10).toFixed(1)} kg</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Abilities</h4>
                  <div className="flex flex-wrap gap-2">
                    {pokemon.abilities.map((ability) => (
                      <Badge key={ability.ability.name} variant="outline">
                        {ability.ability.name
                          .split("-")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="stats" className="mt-4">
                <PokemonStats stats={pokemon.stats} />
              </TabsContent>
              <TabsContent value="evolution" className="mt-4">
                <PokemonEvolution speciesUrl={pokemon.species.url} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
