import { LogBox } from 'react-native';

const originalWarn = console.warn;

console.warn = (...args: any[]) => {
  const warningMessage = args.join(' ');
  if (!(warningMessage.includes('fontFamily') && 
        warningMessage.includes('is not a system font and has not been loaded through expo-font'))) {
    originalWarn(...args);
  }
};

LogBox.ignoreLogs([
  /fontFamily .* is not a system font and has not been loaded through expo-font/,
]);
