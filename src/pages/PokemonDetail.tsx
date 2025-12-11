import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { pokeApi } from '../services/pokeApi'
import Loading from '../components/Loading'
import styles from './PokemonDetail.module.css'

function PokemonDetail() {
  const { id } = useParams<{ id: string }>()
  const pokemonId = parseInt(id || '1')

  const { data: pokemon, isLoading, error } = useQuery({
    queryKey: ['pokemon', pokemonId],
    queryFn: () => pokeApi.getPokemon(pokemonId),
  })

  if (isLoading) return <Loading />
  if (error) return <div>Failed to load Pokemon details. Please try again.</div>
  if (!pokemon) return <div>Pokemon not found</div>

  const imageUrl = pokemon.sprites.other?.['official-artwork']?.front_default ||
                   pokemon.sprites.front_default

  return (
    <div className={styles.detail}>
      <h1 className={styles.name}>{pokemon.name}</h1>
      <img src={imageUrl} alt={pokemon.name} className={styles.image} />
      <div className={styles.info}>
        <div className={styles.types}>
          <h3>Types</h3>
          {pokemon.types.map(({ type }) => (
            <span key={type.name} className={styles.type}>
              {type.name}
            </span>
          ))}
        </div>
        <div className={styles.stats}>
          <h3>Stats</h3>
          {pokemon.stats.map(({ stat, base_stat }) => (
            <div key={stat.name} className={styles.stat}>
              <span>{stat.name}: </span>
              <span>{base_stat}</span>
            </div>
          ))}
        </div>
        <div className={styles.details}>
          <p>Height: {pokemon.height / 10} m</p>
          <p>Weight: {pokemon.weight / 10} kg</p>
        </div>
      </div>
    </div>
  )
}

export default PokemonDetail