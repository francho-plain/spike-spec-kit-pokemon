import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { pokeApi } from '../services/pokeApi'
import styles from './SearchBar.module.css'

interface SearchBarProps {
  onSearch: (query: string) => void
}

function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])

  const { data: pokemonList } = useQuery({
    queryKey: ['pokemonList'],
    queryFn: () => pokeApi.getPokemonList(),
  })

  useEffect(() => {
    if (query && pokemonList) {
      const filtered = pokemonList.results
        .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 10)
        .map(p => p.name)
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }, [query, pokemonList])

  const handleInputChange = (value: string) => {
    setQuery(value)
    onSearch(value)
  }

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder="Search Pokemon..."
        className={styles.searchInput}
        list="pokemon-suggestions"
      />
      <datalist id="pokemon-suggestions">
        {suggestions.map(name => (
          <option key={name} value={name} />
        ))}
      </datalist>
    </div>
  )
}

export default SearchBar