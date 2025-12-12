import styles from './PokemonCard.module.css'

function PokemonCardSkeleton() {
  return (
    <div className={styles.card} role="presentation" aria-hidden="true">
      <div
        className={styles.skeletonImage}
        aria-hidden="true"
      />
      <div className={styles.skeletonName} aria-hidden="true" />
      <div className={styles.skeletonTypes} aria-hidden="true">
        <div className={styles.skeletonType} aria-hidden="true" />
        <div className={styles.skeletonType} aria-hidden="true" />
      </div>
    </div>
  )
}

export default PokemonCardSkeleton