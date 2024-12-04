import { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import * as FileSystem from 'expo-file-system';

const fontCache: { [key: string]: boolean } = {};

async function saveFontFile(fontFamily: string, fontFileUrl: string): Promise<void> {
  const fontFileName = `${fontFamily}.ttf`;
  const fontDir = `${FileSystem.documentDirectory}.expo-dynamic-fonts/`;
  const fontPath = `${fontDir}${fontFileName}`;

  try {
    await FileSystem.makeDirectoryAsync(fontDir, { intermediates: true });
  } catch (error) {
    console.error(`Error creating font directory:`, error);
  }

  try {
    await FileSystem.downloadAsync(fontFileUrl, fontPath);
  } catch (error) {
    console.error(`Error downloading font file:`, error);
  }

  await FileSystem.getInfoAsync(fontPath);
}

async function loadFont(fontFamily: string): Promise<void> {
  if (!fontFamily) {
    return;
  }
  if (fontCache[fontFamily]) {
    return;
  }

  try {
    const localFontPath = `${FileSystem.documentDirectory}../src/assets/fonts/${fontFamily}.ttf`;
    const localFontInfo = await FileSystem.getInfoAsync(localFontPath);

    if (localFontInfo.exists) {
      await Font.loadAsync({
        [fontFamily]: localFontPath,
      });
    } else {
      const fontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}`;
      const response = await fetch(fontUrl);
      const css = await response.text();

      const fontFileUrl = css.match(/url\((.*?)\)/)?.[1];
      if (!fontFileUrl) {
        throw new Error('Could not extract font file URL from CSS');
      }

      await saveFontFile(fontFamily, fontFileUrl);

      await Font.loadAsync({
        [fontFamily]: { uri: fontFileUrl },
      });
    }

    fontCache[fontFamily] = true;
  } catch (error) {
    throw error;
  }
}

export function useFont(fontFamily: string): boolean {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!fontFamily) {
      setIsLoaded(true);
      return;
    }

    let isMounted = true;
    loadFont(fontFamily)
      .then(() => {
        if (isMounted) setIsLoaded(true);
      })
      .catch(() => {
        if (isMounted) setIsLoaded(false);
      });
    return () => {
      isMounted = false;
    };
  }, [fontFamily]);

  return isLoaded;
}

export default useFont;
export { loadFont };