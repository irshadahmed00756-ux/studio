'use client';

import { useState, useEffect, useCallback } from 'react';

const HISTORY_KEY = 'productBrowsingHistory';
const MAX_HISTORY_LENGTH = 10;

export const useProductHistory = () => {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Could not retrieve product history from localStorage", error);
    }
  }, []);

  const addProductToHistory = useCallback((productName: string) => {
    try {
      setHistory(prevHistory => {
        const newHistory = [productName, ...prevHistory.filter(p => p !== productName)];
        const truncatedHistory = newHistory.slice(0, MAX_HISTORY_LENGTH);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(truncatedHistory));
        return truncatedHistory;
      });
    } catch (error) {
       console.error("Could not save product history to localStorage", error);
    }
  }, []);

  return { history, addProductToHistory };
};
