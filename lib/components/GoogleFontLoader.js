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
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const Font = __importStar(require("expo-font"));
const GoogleFontLoader = ({ fontFamily, children }) => {
    const [fontLoaded, setFontLoaded] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        let isMounted = true;
        async function loadFont() {
            try {
                await Font.loadAsync({
                    [fontFamily]: `https://fonts.googleapis.com/css?family=${fontFamily}`,
                });
                if (isMounted) {
                    setFontLoaded(true);
                }
            }
            catch (error) {
                console.error('Error loading font:', error);
                if (isMounted) {
                    setFontLoaded(true); // Set to true even on error to render children
                }
            }
        }
        loadFont();
        return () => {
            isMounted = false;
        };
    }, [fontFamily]);
    if (!fontLoaded) {
        return <react_native_1.Text>Loading...</react_native_1.Text>;
    }
    return <>{children}</>;
};
exports.default = GoogleFontLoader;
