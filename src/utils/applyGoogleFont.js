var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useState, useEffect } from "react";
import * as Font from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { downloadFont } from './downloadFont';
const GOOGLE_FONTS_API = "https://fonts.googleapis.com/css2?family=";
const fontCache = {};
const getCachedFont = (fontFamily) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cachedFont = yield AsyncStorage.getItem(`@font_${fontFamily}`);
        return cachedFont;
    }
    catch (error) {
        console.error("Error retrieving cached font:", error);
        return null;
    }
});
const setCachedFont = (fontFamily, fontData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield AsyncStorage.setItem(`@font_${fontFamily}`, fontData);
    }
    catch (error) {
        console.error("Error caching font:", error);
    }
});
const loadFont = (fontFamily) => __awaiter(void 0, void 0, void 0, function* () {
    if (fontCache[fontFamily]) {
        return;
    }
    try {
        const fontFileName = `${fontFamily.replace(/\s+/g, '_')}.ttf`;
        const fontPath = `${FileSystem.documentDirectory}fonts/${fontFileName}`;
        const fontInfo = yield FileSystem.getInfoAsync(fontPath);
        if (fontInfo.exists) {
            yield Font.loadAsync({ [fontFamily]: fontPath });
            fontCache[fontFamily] = true;
        }
        else if (__DEV__) {
            // If the font doesn't exist locally and we're in dev mode, try to download it
            const { fontPath: downloadedFontPath } = yield downloadFont(fontFamily);
            // Use the downloaded font path directly
            yield Font.loadAsync({ [fontFamily]: downloadedFontPath });
            fontCache[fontFamily] = true;
            console.log(`Successfully loaded font ${fontFamily} from ${downloadedFontPath}`);
        }
        else {
            throw new Error(`Font file not found: ${fontPath}`);
        }
    }
    catch (error) {
        console.error(`Failed to load font ${fontFamily}:`, error);
        // Don't throw the error, just log it and continue
    }
});
export const useFont = (fontFamily) => {
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
