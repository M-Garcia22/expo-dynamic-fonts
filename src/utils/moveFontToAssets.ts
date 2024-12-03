import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

export async function moveFontToAssets(fontPath: string, fontFileName: string): Promise<void> {
  const projectRoot = await FileSystem.getInfoAsync(FileSystem.documentDirectory + '../');
  const assetsDir = `${projectRoot.uri}assets/fonts/`;

  // Ensure the assets/fonts directory exists
  const assetsDirInfo = await FileSystem.getInfoAsync(assetsDir);
  if (!assetsDirInfo.exists) {
    await FileSystem.makeDirectoryAsync(assetsDir, { intermediates: true });
  }

  const destinationPath = `${assetsDir}${fontFileName}`;

  try {
    await FileSystem.copyAsync({
      from: fontPath,
      to: destinationPath,
    });

    console.log(`Moved ${fontFileName} to ${destinationPath}`);
    console.log('Font is now available in your source code.');
  } catch (error) {
    console.error('Failed to move font to assets:', error);
    if (Platform.OS === 'ios') {
      console.log('You may need to manually copy the font file from:');
      console.log(`~/Library/Developer/CoreSimulator/Devices/<DEVICE_ID>/data/Containers/Data/Application/<APP_ID>/Documents/ExponentExperienceData/@anonymous/<PROJECT_ID>/fonts/${fontFileName}`);
    } else if (Platform.OS === 'android') {
      console.log('You may need to manually copy the font file from:');
      console.log(`/data/data/<PACKAGE_NAME>/files/ExponentExperienceData/@anonymous/<PROJECT_ID>/fonts/${fontFileName}`);
    }
    console.log('to:');
    console.log(`src/assets/fonts/${fontFileName}`);
  }
}