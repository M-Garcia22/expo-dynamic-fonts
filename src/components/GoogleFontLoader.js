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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const expo_font_1 = require("expo-font");
const GOOGLE_FONTS_API_BASE_URL = 'https://fonts.googleapis.com/css2?family=';
function isFetchMock(fetch) {
    return typeof fetch.mockResolvedValue === 'function';
}
const fetchFunction = isFetchMock(global.fetch) ? global.fetch : window.fetch;
const GoogleFontLoader = ({ fontFamily, children }) => {
    const [isFontLoaded, setIsFontLoaded] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        let isMounted = true;
        const loadFont = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const fontUrl = yield getFontUrl(fontFamily);
                yield (0, expo_font_1.loadAsync)({ [fontFamily]: fontUrl });
                if (isMounted) {
                    setIsFontLoaded(true);
                }
            }
            catch (error) {
                if (isMounted) {
                    console.error('Error loading font:', error);
                }
            }
        });
        loadFont();
        return () => {
            isMounted = false;
        };
    }, [fontFamily]);
    if (!isFontLoaded) {
        return (<react_native_1.View style={styles.container}>
        <react_native_1.Text style={styles.loadingText}>Loading font...</react_native_1.Text>
      </react_native_1.View>);
    }
    return <>{typeof children === 'function' ? children() : children}</>;
};
const getFontUrl = (fontFamily) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const response = yield fetchFunction(`${GOOGLE_FONTS_API_BASE_URL}${encodeURIComponent(fontFamily)}`);
    const css = yield response.text();
    const fontUrl = (_a = css.match(/url\((.*?)\)/)) === null || _a === void 0 ? void 0 : _a[1];
    if (!fontUrl)
        throw new Error('Font URL not found');
    return fontUrl;
});
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
    },
});
exports.default = GoogleFontLoader;
