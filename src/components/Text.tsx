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

export const createFontComponent = (fontFamily: string) => {
  return (props: Omit<TextProps, 'font'>) => (
    <Text font={fontFamily} {...props} />
  );
};