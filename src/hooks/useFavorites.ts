"use client";

import { useCallback, useEffect, useState } from "react";
import {
  readFavoriteIds,
  toggleFavoriteId,
  isFavoriteId,
} from "@/lib/favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setFavorites(readFavoriteIds());
    setHydrated(true);
  }, []);

  const toggle = useCallback((id: string) => {
    setFavorites(toggleFavoriteId(id));
  }, []);

  const isFavorite = useCallback(
    (id: string) => isFavoriteId(id, favorites),
    [favorites],
  );

  return { favorites, hydrated, toggle, isFavorite };
}
