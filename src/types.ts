// Pokemon interfaces from data-model.md

export interface Pokemon {
  id: number
  name: string
  sprites: {
    front_default: string
    other?: {
      'official-artwork'?: {
        front_default: string
      }
    }
  }
  types: Array<{
    type: {
      name: string // 'fire', 'water', etc.
    }
  }>
  stats: Array<{
    base_stat: number
    stat: {
      name: string // 'hp', 'attack', etc.
    }
  }>
  height: number // in decimeters
  weight: number // in hectograms
  abilities: Array<{
    ability: {
      name: string
    }
  }>
  species: {
    url: string // Link to species data
  }
}

export interface UserFavorite {
  pokemonId: number
  pokemonName: string // Cached for display
  addedAt: string // ISO date string
}

export interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Array<{
    name: string
    url: string
  }>
}