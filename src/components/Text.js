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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFontComponent = exports.Text = void 0;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const applyGoogleFont_1 = require("../utils/applyGoogleFont");
const Text = (_a) => {
    var { font, style, children } = _a, props = __rest(_a, ["font", "style", "children"]);
    const [key, setKey] = (0, react_1.useState)(`text-${font}-${Date.now()}`);
    const [forceUpdate, setForceUpdate] = (0, react_1.useState)(0);
    const fontLoaded = (0, applyGoogleFont_1.useFont)(font || '');
    const prevFontRef = (0, react_1.useRef)(font);
    (0, react_1.useEffect)(() => {
        if (prevFontRef.current !== font) {
            const newKey = `text-${font}-${Date.now()}`;
            setKey(newKey);
            prevFontRef.current = font;
            setForceUpdate(prev => prev + 1);
            setTimeout(() => {
                setForceUpdate(prev => prev + 1);
            }, 100);
        }
    }, [font]);
    (0, react_1.useEffect)(() => {
        if (fontLoaded) {
            setForceUpdate(prev => prev + 1);
        }
    }, [fontLoaded, font]);
    const fontStyle = font ? { fontFamily: font } : {};
    return (<react_native_1.Text key={`${key}-${forceUpdate}`} style={[style, fontStyle]} {...props}>
      {children}
    </react_native_1.Text>);
};
exports.Text = Text;
const createFontComponent = (fontFamily) => {
    return (props) => (<exports.Text font={fontFamily} {...props}/>);
};
exports.createFontComponent = createFontComponent;
