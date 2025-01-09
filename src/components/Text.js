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
import { useDynamicFont } from '../hooks/useDynamicFont';
export const Text = (_a) => {
    var { font, style, children } = _a, props = __rest(_a, ["font", "style", "children"]);
    const [key, setKey] = useState(0);
    const fontLoaded = useDynamicFont(font || '');
    const prevFontRef = useRef(font);
    useEffect(() => {
        if (prevFontRef.current !== font || fontLoaded) {
            setKey(prevKey => {
                const newKey = prevKey + 1;
                return newKey;
            });
            prevFontRef.current = font;
        }
    }, [font, fontLoaded]);
    const fontStyle = font ? { fontFamily: font } : {};
    return (<RNText key={key} style={[style, fontStyle]} {...props}>
      {children}
    </RNText>);
};
export const createFontComponent = (fontFamily, variant) => {
    const fontName = variant
        ? `${fontFamily}${variant.weight ? `:wght@${variant.weight}` : ''}${variant.style === 'italic' ? ':ital' : ''}`
        : fontFamily;
    return (props) => (<Text font={fontName} {...props}/>);
};
