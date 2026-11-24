import { useEffect, useState } from 'react';

const KEY = 'favorite-apartments';

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    return [];
  }
}

// რჩეული ბინები — ინახება ბრაუზერში, საერთოა ყველა გვერდისთვის
export function useFavorites() {
  const [favorites, setFavorites] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(favorites));
    } catch {
      /* localStorage შეიძლება მიუწვდომელი იყოს */
    }
  }, [favorites]);

  const toggleFavorite = (id) =>
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));

  return { favorites, toggleFavorite };
}
