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
import React from 'react';
import { Text as RNText } from 'react-native';
import useFont from '../utils/applyGoogleFont';
export const Text = (_a) => {
    var { font, style, children } = _a, props = __rest(_a, ["font", "style", "children"]);
    const isFontLoaded = font ? useFont(font) : true;
    const fontStyle = font && isFontLoaded ? { fontFamily: font } : {};
    return (<RNText style={[style, fontStyle]} {...props}>
      {children}
    </RNText>);
};
export const createFontComponent = (fontFamily) => {
    return (props) => (<Text font={fontFamily} {...props}/>);
};
