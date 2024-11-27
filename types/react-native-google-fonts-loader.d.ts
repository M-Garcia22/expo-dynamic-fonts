declare module 'react-native-google-fonts-loader' {
  import { ReactNode } from 'react';
  import { TextProps } from 'react-native';

  export function GoogleFontLoader({ fontFamily, children }: { fontFamily: string, children: ReactNode }): JSX.Element;
  export function applyGoogleFont(fontFamily: string): (props: TextProps) => JSX.Element;
} 