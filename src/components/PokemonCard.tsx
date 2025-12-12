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
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick?.()
    }
  }

  return (
    <div
      className={styles.card}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : -1}
      role={onClick ? 'button' : undefined}
      aria-label={`View details for ${pokemon.name}`}
      data-testid="pokemon-card"
    >
      <img
        src={pokemon.imageUrl}
        alt={`Image of ${pokemon.name} Pokemon`}
        className={styles.image}
        loading="lazy"
        onError={(e) => {
          const target = e.target as HTMLImageElement
          target.src = '/placeholder-pokemon.png' // Fallback image
          target.alt = `Image not available for ${pokemon.name} Pokemon`
        }}
      />
      <h3 className={styles.name}>{pokemon.name}</h3>
      <div className={styles.types} aria-label="Pokemon types">
        {pokemon.types.map(type => (
          <span key={type} className={styles.type} aria-label={`Type: ${type}`}>
            {type}
          </span>
        ))}
      </div>
    </div>
  )
}

export default PokemonCard