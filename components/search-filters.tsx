"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Star, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useDebounce } from "@/hooks/use-debounce"

const pokemonTypes = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
]

export default function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [type, setType] = useState(searchParams.get("type") || "")
  const [showFavorites, setShowFavorites] = useState(searchParams.get("favorites") === "true")

  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    const params = new URLSearchParams(searchParams)

    if (debouncedSearch) {
      params.set("search", debouncedSearch)
    } else {
      params.delete("search")
    }

    if (type) {
      params.set("type", type)
    } else {
      params.delete("type")
    }

    if (showFavorites) {
      params.set("favorites", "true")
    } else {
      params.delete("favorites")
    }

    router.push(`?${params.toString()}`)
  }, [debouncedSearch, type, showFavorites, router, searchParams])

  const resetFilters = () => {
    setSearch("")
    setType("")
    setShowFavorites(false)
    router.push("/")
  }

  const hasFilters = search || type || showFavorites

  return (
    <div className="w-full max-w-3xl space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search Pokémon..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {pokemonTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant={showFavorites ? "default" : "outline"}
          className={showFavorites ? "bg-yellow-500 hover:bg-yellow-600" : ""}
          onClick={() => setShowFavorites(!showFavorites)}
        >
          <Star className={`mr-2 h-4 w-4 ${showFavorites ? "fill-white" : ""}`} />
          Favorites
        </Button>
      </div>

      {hasFilters && (
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {search && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: {search}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSearch("")} />
              </Badge>
            )}

            {type && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Type: {type.charAt(0).toUpperCase() + type.slice(1)}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setType("")} />
              </Badge>
            )}

            {showFavorites && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Favorites Only
                <X className="h-3 w-3 cursor-pointer" onClick={() => setShowFavorites(false)} />
              </Badge>
            )}
          </div>

          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Reset All
          </Button>
        </div>
      )}
    </div>
  )
}
