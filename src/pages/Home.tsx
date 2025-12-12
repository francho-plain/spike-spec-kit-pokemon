import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import { pokeApi } from '../services/pokeApi'
import SearchBar from '../components/SearchBar'
import PokemonCard from '../components/PokemonCard'
import PokemonCardSkeleton from '../components/PokemonCardSkeleton'
import CategoryBrowser from '../components/CategoryBrowser'
import styles from './Home.module.css'

function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const { data: pokemonList, isLoading, error } = useQuery({
    queryKey: ['pokemonList'],
    queryFn: () => pokeApi.getPokemonList(),
  })

  const filteredPokemon = pokemonList?.results.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handlePokemonClick = (id: number) => {
    navigate(`/pokemon/${id}`)
  }

  useEffect(() => {
    // Preload first 6 Pokemon images for better performance
    if (pokemonList?.results) {
      const firstSix = pokemonList.results.slice(0, 6)
      firstSix.forEach(pokemon => {
        const img = new Image()
        const id = parseInt(pokemon.url.split('/').slice(-2, -1)[0])
        img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
      })
    }
  }, [pokemonList])

  if (error) return (
    <div className={styles.error}>
      <h2>Unable to load Pokemon</h2>
      <p>We're having trouble connecting to the Pokemon database right now. Please check your internet connection and try again.</p>
      <button onClick={() => window.location.reload()} className={styles.retryButton}>
        Try Again
      </button>
    </div>
  )

  return (
    <div className={styles.home}>
      <header className={styles.header}>
        <h1>MyPokeDex</h1>
        <nav>
          <Link to="/favorites" className={styles.favoritesLink}>
            View Favorites
          </Link>
        </nav>
      </header>
      <main id="main-content">
        <SearchBar onSearch={handleSearch} />
        <CategoryBrowser onPokemonClick={handlePokemonClick} />
        <section className={styles.results} aria-label="Pokemon search results" aria-live="polite" aria-atomic="false">
          {isLoading ? (
            // Show skeleton cards while loading
            <>
              <p className="sr-only" aria-live="polite">Loading Pokemon...</p>
              {Array.from({ length: 20 }, (_, i) => (
                <PokemonCardSkeleton key={i} />
              ))}
            </>
          ) : filteredPokemon.length > 0 ? (
            <>
              <p className="sr-only" aria-live="polite">
                Found {filteredPokemon.length} Pokemon matching your search
              </p>
              {filteredPokemon.map(pokemon => {
                const id = parseInt(pokemon.url.split('/').slice(-2, -1)[0])
                return (
                  <PokemonCard
                    key={pokemon.name}
                    pokemon={{
                      id,
                      name: pokemon.name,
                      imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
                      types: []
                    }}
                    onClick={() => handlePokemonClick(id)}
                  />
                )
              })}
            </>
          ) : searchQuery ? (
            <p className="sr-only" aria-live="polite">
              No Pokemon found matching "{searchQuery}"
            </p>
          ) : null}
        </section>
      </main>
    </div>
  )
}

export default Home