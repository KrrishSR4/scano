import { useState, useEffect, useCallback } from 'react';
import { QRHistoryItem, TextStyle } from '@/types/qr-templates';

const HISTORY_KEY = 'qr-generator-history';
const MAX_HISTORY_ITEMS = 20;

export const useQRHistory = () => {
  const [history, setHistory] = useState<QRHistoryItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load QR history:', error);
    }
  }, []);

  const saveToHistory = useCallback((
    value: string,
    templateId: string,
    textStyle: TextStyle
  ) => {
    const newItem: QRHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      value,
      templateId,
      textStyle,
      createdAt: Date.now(),
    };

    setHistory((prev) => {
      // Remove duplicates with same value
      const filtered = prev.filter((item) => item.value !== value);
      const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
      
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save QR history:', error);
      }
      
      return updated;
    });
  }, []);

  const removeFromHistory = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to update QR history:', error);
      }
      
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error('Failed to clear QR history:', error);
    }
  }, []);

  return {
    history,
    saveToHistory,
    removeFromHistory,
    clearHistory,
  };
};
