import { useState, useCallback } from 'react';
import { listen } from '@tauri-apps/api/event';

export function useDownloadListeners() {
  const [isListening, setIsListening] = useState(false);
  const [unsubscribers, setUnsubscribers] = useState([]);

  const startListening = useCallback(async () => {
    if (isListening) return;

    const unsubscribeStart = await listen("download_start", () => {
      console.log("download_start");
    });

    const unsubscribeComplete = await listen("download_complete", () => {
      console.log("download_complete");
    });

    setUnsubscribers([unsubscribeStart, unsubscribeComplete]);
    setIsListening(true);
  }, [isListening]);

  const stopListening = useCallback(() => {
    unsubscribers.forEach(unsubscribe => unsubscribe());
    setUnsubscribers([]);
    setIsListening(false);
  }, [unsubscribers]);

  return { startListening, stopListening, isListening };
}