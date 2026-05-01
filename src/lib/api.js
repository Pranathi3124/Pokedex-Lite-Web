const BASE_URL = 'https://pokeapi.co/api/v2';

export const fetchAllPokemon = async () => {
  const res = await fetch(`${BASE_URL}/pokemon?limit=10000`);
  if (!res.ok) throw new Error('Failed to fetch pokemon list');
  const data = await res.json();
  
  return data.results.map((p) => {
    const parts = p.url.split('/');
    const id = parseInt(parts[parts.length - 2], 10);
    return { name: p.name, url: p.url, id };
  });
};

export const fetchPokemonDetails = async (idOrName) => {
  const res = await fetch(`${BASE_URL}/pokemon/${idOrName}`);
  if (!res.ok) throw new Error('Failed to fetch pokemon details');
  return res.json();
};

export const fetchAllTypes = async () => {
  const res = await fetch(`${BASE_URL}/type`);
  if (!res.ok) throw new Error('Failed to fetch types');
  const data = await res.json();
  return data.results.map((t) => t.name).filter((t) => t !== 'unknown' && t !== 'shadow');
};

export const fetchPokemonByType = async (type) => {
  if (!type) return [];
  const res = await fetch(`${BASE_URL}/type/${type}`);
  if (!res.ok) throw new Error(`Failed to fetch type ${type}`);
  const data = await res.json();
  return data.pokemon.map((p) => p.pokemon.name);
};
