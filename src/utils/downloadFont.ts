import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GOOGLE_FONTS_API = 'https://fonts.googleapis.com/css2?family=';

export async function downloadFont(fontFamily: string): Promise<{ fontPath: string; fontFileName: string }> {
  try {
    const response = await fetch(`${GOOGLE_FONTS_API}${encodeURIComponent(fontFamily)}`);
    const css = await response.text();
    const fontUrl = css.match(/url\((.*?\.ttf)\)/)?.[1];

    if (!fontUrl) {
      throw new Error(`Could not extract font URL for ${fontFamily}`);
    }

    const fontFileName = `${fontFamily.replace(/\s+/g, '_')}.ttf`;
    const fontDirectory = `${FileSystem.documentDirectory}fonts/`;
    const fontPath = `${fontDirectory}${fontFileName}`;

    // Ensure the fonts directory exists
    const dirInfo = await FileSystem.getInfoAsync(fontDirectory);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(fontDirectory, { intermediates: true });
    }

    // Download the font file
    const downloadResult = await FileSystem.downloadAsync(fontUrl, fontPath);

    if (downloadResult.status !== 200) {
      throw new Error(`Failed to download font ${fontFamily}`);
    }

    console.log(`Downloaded ${fontFamily} to ${fontPath}`);

    // Log the downloaded font
    const downloadedFonts = await AsyncStorage.getItem('@downloadedFonts') || '[]';
    const fonts = JSON.parse(downloadedFonts);
    fonts.push({ fontFamily, fontPath, fontFileName });
    await AsyncStorage.setItem('@downloadedFonts', JSON.stringify(fonts));

    return { fontPath, fontFileName };
  } catch (error) {
    console.error(`Failed to download font ${fontFamily}:`, error);
    throw error;
  }
}