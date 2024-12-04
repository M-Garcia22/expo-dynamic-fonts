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
import { Text as RNText } from 'react-native';
import { useFont } from '../utils/applyGoogleFont';
export const Text = (_a) => {
    var { font, style, children } = _a, props = __rest(_a, ["font", "style", "children"]);
    const [key, setKey] = useState(`text-${font}-${Date.now()}`);
    const [forceUpdate, setForceUpdate] = useState(0);
    const fontLoaded = useFont(font || '');
    const prevFontRef = useRef(font);
    useEffect(() => {
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
