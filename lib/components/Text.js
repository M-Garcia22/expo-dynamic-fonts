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
exports.createFontComponent = exports.Text = void 0;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const useDynamicFont_1 = require("../hooks/useDynamicFont");
const Text = ({ font, style, children, ...props }) => {
    const [key, setKey] = (0, react_1.useState)(0);
    const fontLoaded = (0, useDynamicFont_1.useDynamicFont)(font || '');
    const prevFontRef = (0, react_1.useRef)(font);
    (0, react_1.useEffect)(() => {
        if (prevFontRef.current !== font || fontLoaded) {
            setKey(prevKey => {
                const newKey = prevKey + 1;
                return newKey;
            });
            prevFontRef.current = font;
        }
    }, [font, fontLoaded]);
    const fontStyle = font ? { fontFamily: font } : {};
    return (<react_native_1.Text key={key} style={[style, fontStyle]} {...props}>
      {children}
    </react_native_1.Text>);
};
exports.Text = Text;
const createFontComponent = (fontFamily, variant) => {
    let fontVariant = '';
    if ((variant === null || variant === void 0 ? void 0 : variant.weight) && (variant === null || variant === void 0 ? void 0 : variant.style) === 'italic') {
        // For combined weight and italic, we need to use the 1,400 format
        fontVariant = `ital,wght@1,${variant.weight}`;
    }
    else if (variant === null || variant === void 0 ? void 0 : variant.weight) {
        fontVariant = `wght@${variant.weight}`;
    }
    else if ((variant === null || variant === void 0 ? void 0 : variant.style) === 'italic') {
        fontVariant = 'ital@1';
    }
    const fontName = fontVariant
        ? `${fontFamily}:${fontVariant}`
        : fontFamily;
    return (props) => (<exports.Text font={fontName} {...props}/>);
};
exports.createFontComponent = createFontComponent;
