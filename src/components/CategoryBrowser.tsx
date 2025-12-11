import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { pokeApi } from '../services/pokeApi'
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
    setSelectedType(type)
    setSelectedGeneration(null)
  }

  const handleGenerationClick = (generation: number) => {
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
            <div
              key={index}
              className={styles.pokemonItem}
              onClick={() => onPokemonClick?.(id)}
              style={{ cursor: onPokemonClick ? 'pointer' : 'default' }}
            >
              {name}
            </div>
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
            >
              Generation {gen}
            </button>
          ))}
        </div>
      </div>

      {(typeLoading || generationLoading) && <p>Loading...</p>}
      {(typeError || generationError) && <p>Failed to load Pokemon. Please try again.</p>}

      {typeData && selectedType && (
        <div className={styles.results}>
          <h3>{selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Type Pokemon</h3>
          {renderPokemonList(typeData.pokemon, 'type')}
        </div>
      )}

      {generationData && selectedGeneration && (
        <div className={styles.results}>
          <h3>Generation {selectedGeneration} Pokemon</h3>
          {renderPokemonList(generationData.pokemon_species, 'generation')}
        </div>
      )}
    </div>
  )
}

export default CategoryBrowser