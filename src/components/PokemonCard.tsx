import styles from './PokemonCard.module.css'

interface PokemonCardProps {
  pokemon: {
    id: number
    name: string
    imageUrl: string
    types: string[]
  }
  onClick?: () => void
}

function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
  return (
    <div className={styles.card} onClick={onClick}>
      <img
        src={pokemon.imageUrl}
        alt={pokemon.name}
        className={styles.image}
        loading="lazy"
      />
      <h3 className={styles.name}>{pokemon.name}</h3>
      <div className={styles.types}>
        {pokemon.types.map(type => (
          <span key={type} className={styles.type}>
            {type}
          </span>
        ))}
      </div>
    </div>
  )
}

export default PokemonCard