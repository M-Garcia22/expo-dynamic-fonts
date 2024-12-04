import React, { useState, useEffect, useRef } from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { useFont } from '../utils/applyGoogleFont';

interface TextProps extends RNTextProps {
  font?: string;
}

export const Text: React.FC<TextProps> = ({ font, style, children, ...props }) => {
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

  return (
    <RNText
      key={`${key}-${forceUpdate}`}
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