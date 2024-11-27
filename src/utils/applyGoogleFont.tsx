import React, { useState, useEffect } from 'react';
import { Text, TextProps } from 'react-native';
import * as Font from 'expo-font';

export const applyGoogleFont = (fontFamily: string) => {
  const FontComponent: React.FC<TextProps> = (props) => {
    const [fontLoaded, setFontLoaded] = useState(false);

    useEffect(() => {
      let isMounted = true;
      async function loadFont() {
        try {
          await Font.loadAsync({
            [fontFamily]: `https://fonts.googleapis.com/css2?family=${fontFamily.replace(' ', '+')}`,
          });
          if (isMounted) {
            setFontLoaded(true);
          }
        } catch (error) {
          console.error(`Failed to load font ${fontFamily}:`, error);
        }
      }

      loadFont();

      return () => {
        isMounted = false;
      };
    }, []);

    if (!fontLoaded) {
      return null; 
    }

    return <Text {...props} style={[{ fontFamily }, props.style]} />;
  };

  return FontComponent;
};

export default applyGoogleFont; 