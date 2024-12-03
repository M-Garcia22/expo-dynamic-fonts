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
function extractFontUrl(css) {
    return __awaiter(this, void 0, void 0, function* () {
        // First try to find woff2 format
        const woff2Pattern = /src:\s*url\(([^)]+\.woff2)\)\s+format\(['"]woff2['"]\)/;
        const woff2Match = css.match(woff2Pattern);
        if (woff2Match && woff2Match[1]) {
            return woff2Match[1].replace(/['"]/g, '');
        }
        // Fallback patterns for other formats
        const patterns = [
            /src:\s*url\(([^)]+\.ttf)\)\s+format\(['"]truetype['"]\)/,
            /src:\s*url\(([^)]+\.ttf)\)/,
            /url\(([^)]+\.(?:ttf|woff2|woff))\)/,
            /src:\s*url\(([^)]+)\)\s+format\(['"](?:truetype|opentype|woff2|woff)['"]\)/
        ];
        for (const pattern of patterns) {
            const match = css.match(pattern);
            if (match && match[1]) {
                return match[1].replace(/['"]/g, '');
            }
        }
        // If no URL is found, log the CSS for debugging
        console.log('CSS content:', css);
        throw new Error('Font URL not found in CSS');
    });
}
export function downloadFont(fontFamily) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [baseFontFamily, ...variants] = fontFamily.split('-');
            const fontWeight = variants.join('-') || 'Regular';
            const weightMap = {
                'Regular': '400',
                'Medium': '500',
                'Bold': '700',
                'Light': '300',
                'Black': '900'
            };
            const fontsDir = `${FileSystem.documentDirectory}fonts/`;
            yield FileSystem.makeDirectoryAsync(fontsDir, { intermediates: true });
            const fontFileName = `${fontFamily.replace(/\s+/g, '_')}.ttf`;
            const fontPath = `${fontsDir}${fontFileName}`;
            const fontInfo = yield FileSystem.getInfoAsync(fontPath);
            if (fontInfo.exists) {
                return { fontPath, fontFileName };
            }
            const weight = weightMap[fontWeight] || '400';
            const apiUrl = `${GOOGLE_FONTS_API}${encodeURIComponent(baseFontFamily)}:wght@${weight}&display=swap`;
            console.log('Fetching font from:', apiUrl);
            const response = yield fetch(apiUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'text/css,*/*;q=0.1'
                }
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch font CSS: ${response.statusText}`);
            }
            const css = yield response.text();
            const fontUrl = yield extractFontUrl(css);
            console.log('Downloading font from:', fontUrl);
            const downloadResult = yield FileSystem.downloadAsync(fontUrl, fontPath, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            if (downloadResult.status !== 200) {
                throw new Error(`Failed to download font file: ${downloadResult.status}`);
            }
            yield AsyncStorage.setItem(`@font_${fontFamily}`, fontPath);
            const assetsDir = `${FileSystem.documentDirectory}assets/fonts/`;
            yield FileSystem.makeDirectoryAsync(assetsDir, { intermediates: true });
            const assetsFontPath = `${assetsDir}${fontFileName}`;
            yield FileSystem.copyAsync({
                from: fontPath,
                to: assetsFontPath
            });
            console.log(`Font downloaded and copied to: ${assetsFontPath}`);
            return { fontPath, fontFileName };
        }
        catch (error) {
            console.error(`Error downloading font ${fontFamily}:`, error);
            throw error;
        }
    });
}
