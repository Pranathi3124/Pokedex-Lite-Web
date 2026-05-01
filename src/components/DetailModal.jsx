import React, { useEffect } from 'react';
import styles from './DetailModal.module.css';

export const DetailModal = ({ pokemon, onClose }) => {
  // Prevent scrolling on body when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const imageUrl = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        
        <div className={styles.header}>
          <div className={styles.imageWrapper}>
            {imageUrl && <img src={imageUrl} alt={pokemon.name} className={styles.image} />}
          </div>
          <div className={styles.titleInfo}>
            <span className={styles.number}>#{pokemon.id.toString().padStart(3, '0')}</span>
            <h2 className={styles.name}>{pokemon.name}</h2>
            <div className={styles.types}>
              {pokemon.types.map(t => (
                <span key={t.type.name} className={`${styles.typeBadge} type-${t.type.name}`}>
                  {t.type.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.section}>
            <h3>About</h3>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Height</span>
                <span className={styles.statValue}>{pokemon.height / 10} m</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Weight</span>
                <span className={styles.statValue}>{pokemon.weight / 10} kg</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Abilities</span>
                <span className={styles.statValue}>
                  {pokemon.abilities.map(a => a.ability.name).join(', ')}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3>Base Stats</h3>
            <div className={styles.baseStats}>
              {pokemon.stats.map(s => (
                <div key={s.stat.name} className={styles.statRow}>
                  <span className={styles.statName}>{s.stat.name.replace('-', ' ')}</span>
                  <span className={styles.statNum}>{s.base_stat}</span>
                  <div className={styles.statBarBg}>
                    <div 
                      className={styles.statBarFill} 
                      style={{ width: `${Math.min(100, (s.base_stat / 255) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
