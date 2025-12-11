import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import { pokeApi } from '../services/pokeApi'
import SearchBar from '../components/SearchBar'
import PokemonCard from '../components/PokemonCard'
import CategoryBrowser from '../components/CategoryBrowser'
import Loading from '../components/Loading'
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

  if (isLoading) return <Loading />
  if (error) return <div>Failed to load Pokemon list. Please try again.</div>

  return (
    <div className={styles.home}>
      <header className={styles.header}>
        <h1>MyPokeDex</h1>
        <Link to="/favorites" className={styles.favoritesLink}>
          View Favorites
        </Link>
      </header>
      <SearchBar onSearch={handleSearch} />
      <CategoryBrowser onPokemonClick={handlePokemonClick} />
      <div className={styles.results}>
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
      </div>
    </div>
  )
}

export default Home