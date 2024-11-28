import { useState, useEffect } from 'react';
import * as Font from 'expo-font';

const GOOGLE_FONTS_API = 'https://fonts.googleapis.com/css2?family=';

const fontCache: { [key: string]: boolean } = {};

const loadFont = async (fontFamily: string): Promise<void> => {
  if (fontCache[fontFamily]) {
    return;
  }

  try {
    const response = await fetch(`${GOOGLE_FONTS_API}${fontFamily}`);
    const css = await response.text();
    const fontUrl = css.match(/url\((.*?)\)/)?.[1];

    if (!fontUrl) {
      throw new Error(`Could not extract font URL for ${fontFamily}`);
    }

    await Font.loadAsync({ [fontFamily]: fontUrl });
    fontCache[fontFamily] = true;
  } catch (error) {
    console.error(`Failed to load font ${fontFamily}:`, error);
    throw error;
  }
};

export const useFont = (fontFamily: string): boolean => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    if (fontFamily) {
      loadFont(fontFamily)
        .then(() => setFontLoaded(true))
        .catch(() => setFontLoaded(false));
    }
  }, [fontFamily]);

  return fontLoaded;
};
