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
import AsyncStorage from '@react-native-async-storage/async-storage';
const GOOGLE_FONTS_API = 'https://fonts.googleapis.com/css2?family=';
export function downloadFont(fontFamily) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${GOOGLE_FONTS_API}${encodeURIComponent(fontFamily)}`);
            const css = yield response.text();
            const fontUrl = (_a = css.match(/url\((.*?\.ttf)\)/)) === null || _a === void 0 ? void 0 : _a[1];
            if (!fontUrl) {
                throw new Error(`Could not extract font URL for ${fontFamily}`);
            }
            const fontFileName = `${fontFamily.replace(/\s+/g, '_')}.ttf`;
            const fontDirectory = `${FileSystem.documentDirectory}fonts/`;
            const fontPath = `${fontDirectory}${fontFileName}`;
            // Ensure the fonts directory exists
            const dirInfo = yield FileSystem.getInfoAsync(fontDirectory);
            if (!dirInfo.exists) {
                yield FileSystem.makeDirectoryAsync(fontDirectory, { intermediates: true });
            }
            // Download the font file
            const downloadResult = yield FileSystem.downloadAsync(fontUrl, fontPath);
            if (downloadResult.status !== 200) {
                throw new Error(`Failed to download font ${fontFamily}`);
            }
            console.log(`Downloaded ${fontFamily} to ${fontPath}`);
            // Log the downloaded font
            const downloadedFonts = (yield AsyncStorage.getItem('@downloadedFonts')) || '[]';
            const fonts = JSON.parse(downloadedFonts);
            fonts.push({ fontFamily, fontPath, fontFileName });
            yield AsyncStorage.setItem('@downloadedFonts', JSON.stringify(fonts));
            return { fontPath, fontFileName };
        }
        catch (error) {
            console.error(`Failed to download font ${fontFamily}:`, error);
            throw error;
        }
    });
}
