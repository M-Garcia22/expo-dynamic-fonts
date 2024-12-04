var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import * as FileSystem from 'expo-file-system';
const fontCache = {};
function saveFontFile(fontFamily, fontFileUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const fontFileName = `${fontFamily}.ttf`;
        const fontDir = `${FileSystem.documentDirectory}.expo-dynamic-fonts/`;
        const fontPath = `${fontDir}${fontFileName}`;
        try {
            yield FileSystem.makeDirectoryAsync(fontDir, { intermediates: true });
        }
        catch (error) {
            console.error(`Error creating font directory:`, error);
        }
        try {
            yield FileSystem.downloadAsync(fontFileUrl, fontPath);
        }
        catch (error) {
            console.error(`Error downloading font file:`, error);
        }
        yield FileSystem.getInfoAsync(fontPath);
    });
}
function loadFont(fontFamily) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (!fontFamily) {
            return;
        }
        if (fontCache[fontFamily]) {
            return;
        }
        try {
            const localFontPath = `${FileSystem.documentDirectory}../src/assets/fonts/${fontFamily}.ttf`;
            const localFontInfo = yield FileSystem.getInfoAsync(localFontPath);
            if (localFontInfo.exists) {
                yield Font.loadAsync({
                    [fontFamily]: localFontPath,
                });
            }
            else {
                const fontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}`;
                const response = yield fetch(fontUrl);
                const css = yield response.text();
                const fontFileUrl = (_a = css.match(/url\((.*?)\)/)) === null || _a === void 0 ? void 0 : _a[1];
                if (!fontFileUrl) {
                    throw new Error('Could not extract font file URL from CSS');
                }
                yield saveFontFile(fontFamily, fontFileUrl);
                yield Font.loadAsync({
                    [fontFamily]: { uri: fontFileUrl },
                });
            }
            fontCache[fontFamily] = true;
        }
        catch (error) {
            throw error;
        }
    });
}
export function useFont(fontFamily) {
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        if (!fontFamily) {
            setIsLoaded(true);
            return;
        }
        let isMounted = true;
        loadFont(fontFamily)
            .then(() => {
            if (isMounted)
                setIsLoaded(true);
        })
            .catch(() => {
            if (isMounted)
                setIsLoaded(false);
        });
        return () => {
            isMounted = false;
        };
    }, [fontFamily]);
    return isLoaded;
}
export default useFont;
export { loadFont };
