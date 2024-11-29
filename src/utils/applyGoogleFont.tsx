import { useState, useEffect } from "react";
import * as Font from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GOOGLE_FONTS_API = "https://fonts.googleapis.com/css2?family=";

const fontCache: { [key: string]: boolean } = {};

const getCachedFont = async (fontFamily: string): Promise<string | null> => {
  try {
    const cachedFont = await AsyncStorage.getItem(`@font_${fontFamily}`);
    return cachedFont;
  } catch (error) {
    console.error("Error retrieving cached font:", error);
    return null;
  }
};

const setCachedFont = async (
  fontFamily: string,
  fontData: string
): Promise<void> => {
  try {
    await AsyncStorage.setItem(`@font_${fontFamily}`, fontData);
  } catch (error) {
    console.error("Error caching font:", error);
  }
};

const loadFont = async (fontFamily: string): Promise<void> => {
  if (fontCache[fontFamily]) {
    return;
  }

  try {
    const cachedFont = await getCachedFont(fontFamily);

    if (cachedFont) {
      await Font.loadAsync({ [fontFamily]: cachedFont });
      fontCache[fontFamily] = true;
      return;
    }

    const response = await fetch(`${GOOGLE_FONTS_API}${fontFamily}`);
    const css = await response.text();
    const fontUrl = css.match(/url\((.*?)\)/)?.[1];

    if (!fontUrl) {
      throw new Error(`Could not extract font URL for ${fontFamily}`);
    }

    await setCachedFont(fontFamily, fontUrl);

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
      setFontLoaded(false);
      loadFont(fontFamily)
        .then(() => setFontLoaded(true))
        .catch((error) => {
          console.error(`Error loading font ${fontFamily}:`, error);
          setFontLoaded(false);
        });
    }
  }, [fontFamily]);

  return fontLoaded;
};
