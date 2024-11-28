import { LogBox } from 'react-native';

const originalWarn = console.warn;

console.warn = (...args: any[]) => {
  const warningMessage = args.join(' ');
  if (!(warningMessage.includes('fontFamily') && 
        warningMessage.includes('is not a system font and has not been loaded through expo-font')) &&
      !warningMessage.includes('You started loading the font') &&
      !warningMessage.includes('but used it before it finished loading')) {
    originalWarn(...args);
  }
};

LogBox.ignoreLogs([
  /fontFamily .* is not a system font and has not been loaded through expo-font/,
  /You started loading the font .*, but used it before it finished loading/,
]);
