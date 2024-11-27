import React, { useState, useEffect, ReactNode } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { loadAsync } from 'expo-font';
import type { MockedFunction } from 'jest-mock';

const GOOGLE_FONTS_API_BASE_URL = 'https://fonts.googleapis.com/css2?family=';

type FetchMock = MockedFunction<typeof fetch>;

function isFetchMock(fetch: typeof global.fetch | FetchMock): fetch is FetchMock {
  return typeof (fetch as FetchMock).mockResolvedValue === 'function';
}

const fetchFunction = isFetchMock(global.fetch) ? global.fetch : window.fetch;

interface GoogleFontLoaderProps {
  fontFamily: string;
  children: ReactNode | (() => ReactNode);
}

const GoogleFontLoader: React.FC<GoogleFontLoaderProps> = ({ fontFamily, children }: GoogleFontLoaderProps) => {
  const [isFontLoaded, setIsFontLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadFont = async () => {
      try {
        const fontUrl = await getFontUrl(fontFamily);
        await loadAsync({ [fontFamily]: fontUrl });
        if (isMounted) {
          setIsFontLoaded(true);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error loading font:', error);
        }
      }
    };

    loadFont();
    return () => {
      isMounted = false;
    };
  }, [fontFamily]);

  if (!isFontLoaded) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading font...</Text>
      </View>
    );
  }

  return <>{typeof children === 'function' ? children() : children}</>;
};

const getFontUrl = async (fontFamily: string): Promise<string> => {
  const response = await fetchFunction(`${GOOGLE_FONTS_API_BASE_URL}${encodeURIComponent(fontFamily)}`);
  const css = await response.text();
  const fontUrl = css.match(/url\((.*?)\)/)?.[1];
  if (!fontUrl) throw new Error('Font URL not found');
  return fontUrl;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
  },
});

export default GoogleFontLoader; 