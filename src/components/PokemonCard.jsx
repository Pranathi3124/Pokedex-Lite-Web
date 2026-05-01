"use client";

import React, { useEffect, useState } from 'react';
import { fetchPokemonDetails } from '@/lib/api';
import { useFavorites } from '@/context/FavoritesContext';
import styles from './PokemonCard.module.css';

export const PokemonCard = ({ pokemon, onClick }) => {
  const [details, setDetails] = useState(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    let mounted = true;
    fetchPokemonDetails(pokemon.name).then(data => {
      if (mounted) setDetails(data);
    }).catch(console.error);
    return () => { mounted = false; };
  }, [pokemon.name]);

  const favorite = isFavorite(pokemon.id);

  if (!details) {
    return <div className={`${styles.card} ${styles.skeleton}`}></div>;
  }

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(pokemon.id);
  };

  const imageUrl = details.sprites.other['official-artwork'].front_default || details.sprites.front_default;

  return (
    <div className={styles.card} onClick={() => onClick(details)}>
      <button 
        className={`${styles.favoriteBtn} ${favorite ? styles.active : ''}`}
        onClick={handleFavoriteClick}
        aria-label="Toggle Favorite"
      >
        {favorite ? '❤️' : '🤍'}
      </button>
      <div className={styles.imageContainer}>
        {imageUrl ? (
          <img src={imageUrl} alt={details.name} className={styles.image} loading="lazy" />
        ) : (
          <div className={styles.noImage}>No Image</div>
        )}
      </div>
      <div className={styles.info}>
        <span className={styles.number}>#{details.id.toString().padStart(3, '0')}</span>
        <h3 className={styles.name}>{details.name}</h3>
        <div className={styles.types}>
          {details.types.map(t => (
            <span key={t.type.name} className={`${styles.typeBadge} type-${t.type.name}`}>
              {t.type.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
