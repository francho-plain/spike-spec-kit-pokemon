import styles from './PokemonDetailSkeleton.module.css'

function PokemonDetailSkeleton() {
  return (
    <main id="main-content">
      <div className={styles.detail}>
        <div className={styles.header}>
          <div className={styles.skeletonName} aria-hidden="true" />
          <div className={styles.skeletonFavoriteButton} aria-hidden="true" />
        </div>

        <div className={styles.content}>
          <div className={styles.skeletonImage} aria-hidden="true" />

          <div className={styles.info}>
            <div className={styles.skeletonStats} aria-hidden="true">
              <div className={styles.skeletonStat} aria-hidden="true" />
              <div className={styles.skeletonStat} aria-hidden="true" />
              <div className={styles.skeletonStat} aria-hidden="true" />
            </div>

            <div className={styles.skeletonTypes} aria-hidden="true">
              <div className={styles.skeletonType} aria-hidden="true" />
              <div className={styles.skeletonType} aria-hidden="true" />
            </div>

            <div className={styles.skeletonAbilities} aria-hidden="true">
              <div className={styles.skeletonAbility} aria-hidden="true" />
              <div className={styles.skeletonAbility} aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default PokemonDetailSkeleton