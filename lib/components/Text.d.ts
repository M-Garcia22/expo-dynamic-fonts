import React from 'react';
import { TextProps as RNTextProps } from 'react-native';
interface TextProps extends RNTextProps {
    font?: string;
}
export declare const Text: React.FC<TextProps>;
export declare const createFontComponent: (fontFamily: string, variant?: {
    weight?: number;
    style?: 'normal' | 'italic';
}) => (props: Omit<TextProps, 'font'>) => React.JSX.Element;
export {};
