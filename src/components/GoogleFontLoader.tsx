import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';
import * as Font from 'expo-font';

interface GoogleFontLoaderProps {
  fontFamily: string;
  children: React.ReactNode;
}

const GoogleFontLoader: React.FC<GoogleFontLoaderProps> = ({ fontFamily, children }) => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadFont() {
      try {
        await Font.loadAsync({
          [fontFamily]: `https://fonts.googleapis.com/css?family=${fontFamily}`,
        });
        if (isMounted) {
          setFontLoaded(true);
        }
      } catch (error) {
        console.error('Error loading font:', error);
        if (isMounted) {
          setFontLoaded(true); // Set to true even on error to render children
        }
      }
    }

    loadFont();

    return () => {
      isMounted = false;
    };
  }, [fontFamily]);

  if (!fontLoaded) {
    return <Text>Loading...</Text>;
  }

  return <>{children}</>;
};

export default GoogleFontLoader; 