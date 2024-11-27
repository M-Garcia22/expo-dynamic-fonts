import React, { ReactNode } from 'react';
interface GoogleFontLoaderProps {
    fontFamily: string;
    children: ReactNode | (() => ReactNode);
}
declare const GoogleFontLoader: React.FC<GoogleFontLoaderProps>;
export default GoogleFontLoader;
