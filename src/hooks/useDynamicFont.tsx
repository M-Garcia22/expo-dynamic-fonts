import { useState, useEffect } from 'react';
import { loadFont } from '../utils/applyGoogleFont';

export function useDynamicFont(fontFamily: string): boolean {
  const [isLoaded, setIsLoaded] = useState(false);
  const [fontLoadTrigger, setFontLoadTrigger] = useState(0);


  useEffect(() => {
    
    if (!fontFamily) {
      setIsLoaded(true);
      return;
    }

    let isMounted = true;
    async function loadFontAsync() {
      try {
        await loadFont(fontFamily);
        if (isMounted) {
          setIsLoaded(true);
          setFontLoadTrigger(prev => prev + 1);
        }
      } catch (error) {
        if (isMounted) setIsLoaded(false);
      }
    }

    setIsLoaded(false);
    loadFontAsync();
    return () => {
      isMounted = false;
    };
  }, [fontFamily]);

  return isLoaded;
}