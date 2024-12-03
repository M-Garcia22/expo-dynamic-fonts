import { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import * as FileSystem from 'expo-file-system';

const fontCache: { [key: string]: boolean } = {};

async function saveFontFile(fontFamily: string, fontFileUrl: string): Promise<void> {
  console.log(`[DEBUG] Starting saveFontFile for ${fontFamily}`);
  const fontFileName = `${fontFamily}.ttf`;
  const fontDir = `${FileSystem.documentDirectory}.expo-dynamic-fonts/`;
  const fontPath = `${fontDir}${fontFileName}`;

  console.log(`[DEBUG] Font directory: ${fontDir}`);
  console.log(`[DEBUG] Font path: ${fontPath}`);

  try {
    await FileSystem.makeDirectoryAsync(fontDir, { intermediates: true });
    console.log(`[DEBUG] Created font directory: ${fontDir}`);
  } catch (error) {
    console.error(`[DEBUG] Error creating font directory: ${error}`);
  }

  try {
    const { uri } = await FileSystem.downloadAsync(fontFileUrl, fontPath);
    console.log(`[DEBUG] Font file downloaded and saved to: ${uri}`);
  } catch (error) {
    console.error(`[DEBUG] Error downloading font file: ${error}`);
  }

  // Verify file exists after download
  const fileInfo = await FileSystem.getInfoAsync(fontPath);
  console.log(`[DEBUG] Font file info after download:`, fileInfo);
}

async function loadFont(fontFamily: string): Promise<void> {
  console.log(`[DEBUG] Starting to load font: ${fontFamily}`);
  if (fontCache[fontFamily]) {
    console.log(`[DEBUG] Font ${fontFamily} already cached, returning early`);
    return;
  }

  try {
    console.log(`[DEBUG] Checking if font exists locally in src/assets/fonts`);
    const localFontPath = `${FileSystem.documentDirectory}../src/assets/fonts/${fontFamily}.ttf`;
    const localFontInfo = await FileSystem.getInfoAsync(localFontPath);
    console.log(`[DEBUG] Local font info:`, localFontInfo);

    if (localFontInfo.exists) {
      console.log(`[DEBUG] Found local font file: ${localFontPath}`);
      await Font.loadAsync({
        [fontFamily]: localFontPath,
      });
      console.log(`[DEBUG] Successfully loaded local font: ${fontFamily}`);
    } else {
      console.log(`[DEBUG] Local font not found, fetching from Google Fonts`);
      const fontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}`;
      console.log(`[DEBUG] Font URL: ${fontUrl}`);

      console.log(`[DEBUG] Attempting to fetch font CSS`);
      const response = await fetch(fontUrl);
      console.log(`[DEBUG] Font CSS fetch response status: ${response.status}`);
      const css = await response.text();
      console.log(`[DEBUG] Font CSS content: ${css.substring(0, 100)}...`);

      console.log(`[DEBUG] Parsing font URL from CSS`);
      const fontFileUrl = css.match(/url\((.*?)\)/)?.[1];
      if (!fontFileUrl) {
        throw new Error('Could not extract font file URL from CSS');
      }
      console.log(`[DEBUG] Extracted font file URL: ${fontFileUrl}`);

      await saveFontFile(fontFamily, fontFileUrl);

      console.log(`[DEBUG] Attempting to load font with expo-font`);
      await Font.loadAsync({
        [fontFamily]: { uri: fontFileUrl },
      });
    }

    fontCache[fontFamily] = true;
    console.log(`[DEBUG] Font ${fontFamily} loaded successfully`);
  } catch (error) {
    console.error(`[DEBUG] Error loading font ${fontFamily}:`, error);
    console.error(`[DEBUG] Error stack:`, (error as Error).stack);
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const errorWithResponse = error as { response: { text: () => Promise<string> } };
      console.error(`[DEBUG] Error response:`, await errorWithResponse.response.text());
    }
    throw error;
  }
}

function useFont(fontFamily: string): boolean {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.log(`[DEBUG] useFont hook effect triggered for ${fontFamily}`);
    let isMounted = true;
    loadFont(fontFamily)
      .then(() => {
        console.log(`[DEBUG] Font ${fontFamily} loaded successfully in useFont hook`);
        if (isMounted) setIsLoaded(true);
      })
      .catch((error) => {
        console.error(`[DEBUG] Failed to load font ${fontFamily} in useFont hook:`, error);
        if (isMounted) setIsLoaded(false);
      });
    return () => {
      console.log(`[DEBUG] Cleanup function called for ${fontFamily}`);
      isMounted = false;
    };
  }, [fontFamily]);

  console.log(`[DEBUG] useFont hook returning isLoaded: ${isLoaded} for ${fontFamily}`);
  return isLoaded;
}

export default useFont;