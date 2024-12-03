var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
import React, { useState, useEffect, useRef } from 'react';
import { Text as RNText, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFont } from '../utils/applyGoogleFont';
import { downloadFont } from '../utils/downloadFont';
import * as FileSystem from 'expo-file-system';
export const Text = (_a) => {
    var { font, style, children } = _a, props = __rest(_a, ["font", "style", "children"]);
    const [key, setKey] = useState(`text-${font}-${Date.now()}`);
    const [forceUpdate, setForceUpdate] = useState(0);
    const fontLoaded = useFont(font || '');
    const prevFontRef = useRef(font);
    useEffect(() => {
        if (prevFontRef.current !== font && font) {
            const newKey = `text-${font}-${Date.now()}`;
            setKey(newKey);
            prevFontRef.current = font;
            setForceUpdate(prev => prev + 1);
            // Check if font is already downloaded
            AsyncStorage.getItem(`@font_${font}`).then((storedFont) => __awaiter(void 0, void 0, void 0, function* () {
                if (!storedFont) {
                    // Trigger font download only in development and on simulator/emulator
                    if (__DEV__ && (Platform.OS === 'ios' || Platform.OS === 'android')) {
                        try {
                            const { fontPath, fontFileName } = yield downloadFont(font);
                            yield AsyncStorage.setItem(`@font_${font}`, fontPath);
                            // Move font to assets directory
                            const assetsDir = `${FileSystem.documentDirectory}assets/fonts/`;
                            const assetsFontPath = `${assetsDir}${fontFileName}`;
                            yield FileSystem.makeDirectoryAsync(assetsDir, { intermediates: true });
                            yield FileSystem.moveAsync({
                                from: fontPath,
                                to: assetsFontPath
                            });
                            console.log(`Moved ${fontFileName} to ${assetsFontPath}`);
                            console.log('Font is now available in your assets directory.');
                            // Trigger the move-fonts script
                            if (Platform.OS === 'ios') {
                                console.log('Please run "npm run move-fonts" to copy the font to your source code.');
                            }
                        }
                        catch (error) {
                            console.error('Error downloading or moving font:', error);
                        }
                    }
                }
            }));
            setTimeout(() => {
                setForceUpdate(prev => prev + 1);
            }, 100);
        }
    }, [font]);
    useEffect(() => {
        if (fontLoaded) {
            setForceUpdate(prev => prev + 1);
        }
    }, [fontLoaded, font]);
    const fontStyle = font ? { fontFamily: font } : {};
    return (<RNText key={`${key}-${forceUpdate}`} style={[style, fontStyle]} {...props}>
      {children}
    </RNText>);
};
export const createFontComponent = (fontFamily) => {
    return (props) => (<Text font={fontFamily} {...props}/>);
};
