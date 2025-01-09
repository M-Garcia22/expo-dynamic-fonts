import React, { useState, useEffect, useRef } from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { useDynamicFont } from '../hooks/useDynamicFont';

interface TextProps extends RNTextProps {
  font?: string;
}

export const Text: React.FC<TextProps> = ({ font, style, children, ...props }) => {
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

  return (
    <RNText
      key={key}
      style={[style, fontStyle]}
      {...props}
    >
      {children}
    </RNText>
  );
};

export const createFontComponent = (fontFamily: string, variant?: { weight?: number, style?: 'normal' | 'italic' }) => {
  let fontVariant = '';
  
  if (variant?.weight && variant?.style === 'italic') {
    fontVariant = `ital,wght@1,${variant.weight}`;
  } else if (variant?.weight) {
    fontVariant = `wght@${variant.weight}`;
  } else if (variant?.style === 'italic') {
    fontVariant = 'ital@1';
  }
  
  const fontName = fontVariant 
    ? `${fontFamily}:${fontVariant}`
    : fontFamily;

  return (props: Omit<TextProps, 'font'>) => (
    <Text font={fontName} {...props} />
  );
};