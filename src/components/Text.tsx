import React, { useState, useEffect, useRef } from 'react';
import { Text as RNText, TextProps as RNTextProps, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFont } from '../utils/applyGoogleFont';
import { downloadFont } from '../utils/downloadFont';
import * as FileSystem from 'expo-file-system';

interface TextProps extends RNTextProps {
  font?: string;
}

export const Text: React.FC<TextProps> = ({ font, style, children, ...props }) => {
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
      AsyncStorage.getItem(`@font_${font}`).then(async (storedFont) => {
        if (!storedFont) {
          // Trigger font download only in development and on simulator/emulator
          if (__DEV__ && (Platform.OS === 'ios' || Platform.OS === 'android')) {
            try {
              const { fontPath, fontFileName } = await downloadFont(font);
              await AsyncStorage.setItem(`@font_${font}`, fontPath);
              
              // Move font to assets directory
              const assetsDir = `${FileSystem.documentDirectory}assets/fonts/`;
              const assetsFontPath = `${assetsDir}${fontFileName}`;
              
              await FileSystem.makeDirectoryAsync(assetsDir, { intermediates: true });
              await FileSystem.moveAsync({
                from: fontPath,
                to: assetsFontPath
              });
              
              console.log(`Moved ${fontFileName} to ${assetsFontPath}`);
              console.log('Font is now available in your assets directory.');
              
              // Trigger the move-fonts script
              if (Platform.OS === 'ios') {
                console.log('Please run "npm run move-fonts" to copy the font to your source code.');
              }
            } catch (error) {
              console.error('Error downloading or moving font:', error);
            }
          }
        }
      });

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