import { useState, useEffect, useMemo } from 'react';
import { fetchAllPokemon, fetchAllTypes, fetchPokemonByType } from '@/lib/api';
import { useFavorites } from '@/context/FavoritesContext';

const ITEMS_PER_PAGE = 20;

export const usePokemonList = () => {
  const [allPokemon, setAllPokemon] = useState([]);
  const [types, setTypes] = useState([]);
  
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');
  
  const [typeFilteredNames, setTypeFilteredNames] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const { isFavorite } = useFavorites();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  // Initial fetch
  useEffect(() => {
    const initFetch = async () => {
      try {
        setLoading(true);
        const [pokemonList, typeList] = await Promise.all([
          fetchAllPokemon(),
          fetchAllTypes()
        ]);
        setAllPokemon(pokemonList);
        setTypes(typeList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    initFetch();
  }, []);

  // Fetch type filter list when type changes
  useEffect(() => {
    const fetchTypeFilter = async () => {
      if (!selectedType) {
        setTypeFilteredNames(null);
        return;
      }
      try {
        setLoading(true);
        const names = await fetchPokemonByType(selectedType);
        setTypeFilteredNames(new Set(names));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTypeFilter();
  }, [selectedType]);

  // Reset page on filter/search change
  useEffect(() => {
    setPage(1);
  }, [search, selectedType, showFavorites]);

  const filteredPokemon = useMemo(() => {
    return allPokemon.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilteredNames ? typeFilteredNames.has(p.name) : true;
      const matchesFavorite = showFavorites ? isFavorite(p.id) : true;
      return matchesSearch && matchesType && matchesFavorite;
    });
  }, [allPokemon, search, typeFilteredNames, showFavorites, isFavorite]);

  const totalPages = Math.ceil(filteredPokemon.length / ITEMS_PER_PAGE);
  
  const currentPokemon = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredPokemon.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPokemon, page]);

  return {
    allPokemon,
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
  };
};
