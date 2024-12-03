var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';
import * as Font from 'expo-font';
const GoogleFontLoader = ({ fontFamily, children }) => {
    const [fontLoaded, setFontLoaded] = useState(false);
    useEffect(() => {
        let isMounted = true;
        function loadFont() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    yield Font.loadAsync({
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
            });
        }
        loadFont();
        return () => {
            isMounted = false;
        };
    }, [fontFamily]);
    if (!fontLoaded) {
        return <Text>Loading...</Text>;
    }
    return <>{children}</>;
};
export default GoogleFontLoader;
