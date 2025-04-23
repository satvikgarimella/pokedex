"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { useState } from "react"
import PokemonDetailModal from "./pokemon-detail-modal"

interface PokemonCardProps {
  pokemon: {
    id: number
    name: string
    types: string[]
    sprite: string
  }
  isFavorite: boolean
  onToggleFavorite: (id: number) => void
}

export default function PokemonCard({ pokemon, isFavorite, onToggleFavorite }: PokemonCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getTypeColor = (type: string) => {
    return `type-${type}`
  }

  return (
    <>
      <Card className="overflow-hidden pokemon-card cursor-pointer" onClick={() => setIsModalOpen(true)}>
        <div className="relative">
          <div
            className="absolute top-2 right-2 z-10 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              onToggleFavorite(pokemon.id)
            }}
          >
            <Star className={`h-6 w-6 ${isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`} />
          </div>
          <div className="bg-muted p-6 flex justify-center">
            <img
              src={pokemon.sprite || "/placeholder.svg"}
              alt={pokemon.name}
              className="h-32 w-32 object-contain transition-transform hover:scale-110"
            />
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-lg">{pokemon.name}</h3>
            <span className="text-sm text-muted-foreground">#{pokemon.id.toString().padStart(3, "0")}</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {pokemon.types.map((type) => (
              <Badge key={type} className={getTypeColor(type)}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {isModalOpen && (
        <PokemonDetailModal
          pokemonId={pokemon.id}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
        />
      )}
    </>
  )
}
