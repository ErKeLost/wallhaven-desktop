import { useState, useCallback } from "react";
import { proxyImageUrl } from "../utils";

export function useWallpaper() {
  const [imageData, setImageData] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastSearchTerm, setLastSearchTerm] = useState('');

  const fetchData = useCallback(async (tab, currentPage = 1, searchTerm = '') => {
    // ... fetchData 逻辑 ...
  }, []);

  const loadInitialData = useCallback(async (tab) => {
    // ... loadInitialData 逻辑 ...
  }, [fetchData]);

  return {
    imageData,
    page,
    isLoading,
    error,
    lastSearchTerm,
    fetchData,
    loadInitialData,
    setImageData,
    setPage,
    setLastSearchTerm,
  };
} 
