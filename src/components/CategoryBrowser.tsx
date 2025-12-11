import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { pokeApi } from '../services/pokeApi'
import PokemonCardSkeleton from './PokemonCardSkeleton'
import styles from './CategoryBrowser.module.css'

interface CategoryBrowserProps {
  onPokemonClick?: (id: number) => void
}

function CategoryBrowser({ onPokemonClick }: CategoryBrowserProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedGeneration, setSelectedGeneration] = useState<number | null>(null)

  const { data: typeData, isLoading: typeLoading, error: typeError } = useQuery({
    queryKey: ['pokemonByType', selectedType],
    queryFn: () => selectedType ? pokeApi.getPokemonByType(selectedType) : null,
    enabled: !!selectedType,
  })

  const { data: generationData, isLoading: generationLoading, error: generationError } = useQuery({
    queryKey: ['pokemonByGeneration', selectedGeneration],
    queryFn: () => selectedGeneration ? pokeApi.getPokemonByGeneration(selectedGeneration) : null,
    enabled: !!selectedGeneration,
  })

  const pokemonTypes = [
    'fire', 'water', 'grass', 'electric', 'psychic', 'ice', 'dragon', 'dark',
    'fairy', 'normal', 'fighting', 'poison', 'ground', 'flying', 'bug', 'rock',
    'ghost', 'steel'
  ]

  const generations = Array.from({ length: 9 }, (_, i) => i + 1)

  const handleTypeClick = (type: string) => {
    // Validate that the type is in our known types list
    if (!pokemonTypes.includes(type)) {
      console.error(`Invalid Pokemon type: ${type}`)
      return
    }
    setSelectedType(type)
    setSelectedGeneration(null)
  }

  const handleGenerationClick = (generation: number) => {
    // Validate generation range (1-9 are valid Pokemon generations)
    if (generation < 1 || generation > 9) {
      console.error(`Invalid generation: ${generation}`)
      return
    }
    setSelectedGeneration(generation)
    setSelectedType(null)
  }

  const renderPokemonList = (pokemonList: any[], source: 'type' | 'generation') => {
    if (!pokemonList || pokemonList.length === 0) {
      return <p>No Pokemon found for this {source}.</p>
    }

    return (
      <div className={styles.pokemonList}>
        {pokemonList.map((item, index) => {
          const name = source === 'type' ? item.pokemon.name : item.name
          const url = source === 'type' ? item.pokemon.url : item.url
          const id = parseInt(url.split('/').slice(-2, -1)[0])

          return (
            <button
              key={index}
              className={styles.pokemonItem}
              onClick={() => onPokemonClick?.(id)}
              aria-label={`View details for ${name}`}
              disabled={!onPokemonClick}
            >
              {name}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className={styles.categoryBrowser}>
      <div className={styles.section}>
        <h2>Browse by Type</h2>
        <div className={styles.typeGrid}>
          {pokemonTypes.map(type => (
            <button
              key={type}
              className={`${styles.typeButton} ${selectedType === type ? styles.selected : ''}`}
              onClick={() => handleTypeClick(type)}
              aria-label={`Browse ${type} type Pokemon`}
              aria-pressed={selectedType === type}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2>Browse by Generation</h2>
        <div className={styles.generationGrid}>
          {generations.map(gen => (
            <button
              key={gen}
              className={`${styles.generationButton} ${selectedGeneration === gen ? styles.selected : ''}`}
              onClick={() => handleGenerationClick(gen)}
              aria-label={`Browse Generation ${gen} Pokemon`}
              aria-pressed={selectedGeneration === gen}
            >
              Generation {gen}
            </button>
          ))}
        </div>
      </div>

      {(typeLoading || generationLoading) && (
        <div className={styles.results}>
          <p className="sr-only" aria-live="polite">Loading Pokemon...</p>
          <div className={styles.pokemonList}>
            {Array.from({ length: 6 }, (_, i) => (
              <PokemonCardSkeleton key={i} />
            ))}
          </div>
        </div>
      )}
      {(typeError || generationError) && (
        <div className={styles.error}>
          <p>Unable to load Pokemon for this category. Please check your connection and try again.</p>
          <button
            onClick={() => window.location.reload()}
            className={styles.retryButton}
          >
            Retry
          </button>
        </div>
      )}

      {typeData && selectedType && (
        <div className={styles.results}>
          <h3>{selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Type Pokemon</h3>
          <div aria-live="polite" aria-atomic="false">
            {renderPokemonList(typeData.pokemon, 'type')}
          </div>
        </div>
      )}

      {generationData && selectedGeneration && (
        <div className={styles.results}>
          <h3>Generation {selectedGeneration} Pokemon</h3>
          <div aria-live="polite" aria-atomic="false">
            {renderPokemonList(generationData.pokemon_species, 'generation')}
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryBrowser