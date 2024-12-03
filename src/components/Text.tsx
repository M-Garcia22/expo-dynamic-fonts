import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import useFont from '../utils/applyGoogleFont';

interface TextProps extends RNTextProps {
  font?: string;
}

export const Text: React.FC<TextProps> = ({ font, style, children, ...props }) => {
  const isFontLoaded = font ? useFont(font) : true;

  const fontStyle = font && isFontLoaded ? { fontFamily: font } : {};

  return (
    <RNText
      style={[style, fontStyle]}
      {...props}
    >
      {children}
    </RNText>
  );
};

export const createFontComponent = (fontFamily: string) => {
  return (props: Omit<TextProps, 'font'>) => (
    <Text font={fontFamily} {...props} />
  );
};