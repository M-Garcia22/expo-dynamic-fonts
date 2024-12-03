import { useState, useEffect } from "react";
import * as Font from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { downloadFont } from './downloadFont';

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
    const fontFileName = `${fontFamily.replace(/\s+/g, '_')}.ttf`;
    const fontPath = `${FileSystem.documentDirectory}fonts/${fontFileName}`;
    const assetsFontPath = `${FileSystem.documentDirectory}assets/fonts/${fontFileName}`;

    const fontInfo = await FileSystem.getInfoAsync(fontPath);
    const assetsFontInfo = await FileSystem.getInfoAsync(assetsFontPath);

    if (fontInfo.exists || assetsFontInfo.exists) {
      const existingFontPath = fontInfo.exists ? fontPath : assetsFontPath;
      await Font.loadAsync({ [fontFamily]: { uri: existingFontPath } });
      fontCache[fontFamily] = true;
      console.log(`Successfully loaded font ${fontFamily} from ${existingFontPath}`);
    } else if (__DEV__) {
      const { fontPath: downloadedFontPath } = await downloadFont(fontFamily);
      await Font.loadAsync({ [fontFamily]: { uri: downloadedFontPath } });
      fontCache[fontFamily] = true;
      console.log(`Successfully loaded font ${fontFamily} from ${downloadedFontPath}`);
    } else {
      throw new Error(`Font file not found: ${fontPath}`);
    }
  } catch (error) {
    console.error(`Failed to load font ${fontFamily}:`, error);
    // Don't throw the error, just log it and continue
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
