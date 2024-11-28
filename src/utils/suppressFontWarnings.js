"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const originalWarn = console.warn;
console.warn = (...args) => {
    const warningMessage = args.join(' ');
    if (!(warningMessage.includes('fontFamily') &&
        warningMessage.includes('is not a system font and has not been loaded through expo-font'))) {
        originalWarn(...args);
    }
};
react_native_1.LogBox.ignoreLogs([
    /fontFamily .* is not a system font and has not been loaded through expo-font/,
]);
