var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
export function moveFontToAssets(fontPath, fontFileName) {
    return __awaiter(this, void 0, void 0, function* () {
        const projectRoot = yield FileSystem.getInfoAsync(FileSystem.documentDirectory + '../');
        const assetsDir = `${projectRoot.uri}assets/fonts/`;
        // Ensure the assets/fonts directory exists
        const assetsDirInfo = yield FileSystem.getInfoAsync(assetsDir);
        if (!assetsDirInfo.exists) {
            yield FileSystem.makeDirectoryAsync(assetsDir, { intermediates: true });
        }
        const destinationPath = `${assetsDir}${fontFileName}`;
        try {
            yield FileSystem.copyAsync({
                from: fontPath,
                to: destinationPath,
            });
            console.log(`Moved ${fontFileName} to ${destinationPath}`);
            console.log('Font is now available in your source code.');
        }
        catch (error) {
            console.error('Failed to move font to assets:', error);
            if (Platform.OS === 'ios') {
                console.log('You may need to manually copy the font file from:');
                console.log(`~/Library/Developer/CoreSimulator/Devices/<DEVICE_ID>/data/Containers/Data/Application/<APP_ID>/Documents/ExponentExperienceData/@anonymous/<PROJECT_ID>/fonts/${fontFileName}`);
            }
            else if (Platform.OS === 'android') {
                console.log('You may need to manually copy the font file from:');
                console.log(`/data/data/<PACKAGE_NAME>/files/ExponentExperienceData/@anonymous/<PROJECT_ID>/fonts/${fontFileName}`);
            }
            console.log('to:');
            console.log(`src/assets/fonts/${fontFileName}`);
        }
    });
}
