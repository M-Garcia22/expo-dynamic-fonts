"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadFont = exports.useFont = void 0;
const react_1 = require("react");
const Font = __importStar(require("expo-font"));
const FileSystem = __importStar(require("expo-file-system"));
const fontCache = {};
async function saveFontFile(fontFamily, fontFileUrl) {
    const fontFileName = `${fontFamily}.ttf`;
    const fontDir = `${FileSystem.documentDirectory}.expo-dynamic-fonts/`;
    const fontPath = `${fontDir}${fontFileName}`;
    try {
        await FileSystem.makeDirectoryAsync(fontDir, { intermediates: true });
    }
    catch (error) {
        console.error(`Error creating font directory:`, error);
    }
    try {
        await FileSystem.downloadAsync(fontFileUrl, fontPath);
    }
    catch (error) {
        console.error(`Error downloading font file:`, error);
    }
    await FileSystem.getInfoAsync(fontPath);
}
async function loadFont(fontFamily) {
    var _a;
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
        }
        else {
            const fontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}`;
            const response = await fetch(fontUrl);
            const css = await response.text();
            const fontFileUrl = (_a = css.match(/url\((.*?)\)/)) === null || _a === void 0 ? void 0 : _a[1];
            if (!fontFileUrl) {
                throw new Error('Could not extract font file URL from CSS');
            }
            await saveFontFile(fontFamily, fontFileUrl);
            await Font.loadAsync({
                [fontFamily]: { uri: fontFileUrl },
            });
        }
        fontCache[fontFamily] = true;
    }
    catch (error) {
        throw error;
    }
}
exports.loadFont = loadFont;
function useFont(fontFamily) {
    const [isLoaded, setIsLoaded] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
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
exports.useFont = useFont;
exports.default = useFont;
