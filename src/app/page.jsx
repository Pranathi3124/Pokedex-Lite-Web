"use client";

import { useState } from 'react';
import { usePokemonList } from '@/hooks/usePokemonList';
import { useAuth } from '@/context/AuthContext';
import { PokemonCard } from '@/components/PokemonCard';
import { DetailModal } from '@/components/DetailModal';
import styles from './page.module.css';

export default function Home() {
  const {
    currentPokemon,
    types,
    search,
    setSearch,
    selectedType,
    setSelectedType,
    page,
    setPage,
    totalPages,
    loading,
    error,
    showFavorites,
    setShowFavorites
  } = usePokemonList();

  const { user, logout, isAuthLoaded } = useAuth();
  const [selectedDetails, setSelectedDetails] = useState(null);

  const handleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.topBar}>
            <h1 className={styles.title}>Pokédex Lite</h1>
            {isAuthLoaded && (
              <div className={styles.authSection}>
                {user ? (
                  <div className={styles.userProfile}>
                    <img src={user.image} alt={user.name} className={styles.avatar} />
                    <span className={styles.userName}>{user.name}</span>
                    <button className={styles.authBtn} onClick={logout}>Sign Out</button>
                  </div>
                ) : (
                  <button className={styles.authBtn} onClick={handleLogin}>
                    Sign In with Google
                  </button>
                )}
              </div>
            )}
          </div>
          
          <div className={styles.controls}>
            <div className={styles.searchWrapper}>
              <span className={styles.searchIcon}>🔍</span>
              <input 
                type="text" 
                placeholder="Search Pokémon..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className={styles.typeSelect}
            >
              <option value="">All Types</option>
              {types.map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>

            <button 
              className={`${styles.favToggleBtn} ${showFavorites ? styles.favToggleActive : ''}`}
              onClick={() => setShowFavorites(!showFavorites)}
            >
              {showFavorites ? '❤️ Favorites' : '🤍 Favorites'}
            </button>
          </div>
        </div>
      </header>

      <section className={styles.container}>
        {error && <div className={styles.error}>Error: {error}</div>}
        
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading Pokédex...</p>
          </div>
        ) : (
          <>
            {currentPokemon.length === 0 ? (
              <div className={styles.empty}>
                <p>No Pokémon found.</p>
              </div>
            ) : (
              <div className={styles.grid}>
                {currentPokemon.map(p => (
                  <PokemonCard 
                    key={p.name} 
                    pokemon={p} 
                    onClick={setSelectedDetails} 
                  />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button 
                  disabled={page === 1} 
                  onClick={() => setPage(p => p - 1)}
                  className={styles.pageBtn}
                >
                  Previous
                </button>
                <span className={styles.pageInfo}>
                  Page {page} of {totalPages}
                </span>
                <button 
                  disabled={page === totalPages} 
                  onClick={() => setPage(p => p + 1)}
                  className={styles.pageBtn}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {selectedDetails && (
        <DetailModal 
          pokemon={selectedDetails} 
          onClose={() => setSelectedDetails(null)} 
        />
      )}
    </main>
  );
}
