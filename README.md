# react-native-google-fonts-loader

A React Native package to dynamically load and use Google Fonts in your application.

## Installation

To install the `react-native-google-fonts-loader` package, follow these steps:

1. **Install the package via npm or yarn:**

   ```sh
   npm install react-native-google-fonts-loader
   ```

   or

   ```sh
   yarn add react-native-google-fonts-loader
   ```

2. **Install peer dependencies:**

   ```sh
   npm install expo-font react react-native
   ```

   or

   ```sh
   yarn add expo-font react react-native
   ```

## Usage

Import and use the `Text` component in your project:

```tsx
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-google-fonts-loader';

const App = () => {
  return (
    <View className="flex-1 justify-center items-center">
      <Text font="Roboto" className="text-lg">Hello, Roboto!</Text>
    </View>
  );
};

export default App;
```

## API

### Text

A custom Text component that extends React Native's Text component with an additional `font` prop.

Props:
- `font` (optional string): The name of the Google Font to apply.
- All other props from React Native's Text component are supported.

## How it works

The `Text` component:

1. Accepts a `font` prop specifying the Google Font to use.
2. Attempts to load the specified Google Font using `expo-font` if it hasn't been loaded before.
3. Renders null (or a loading placeholder) while the font is loading.
4. Once the font is loaded, renders the text with the font applied.
5. Handles errors if the font fails to load.
6. Caches loaded fonts to prevent unnecessary reloading.

## TypeScript Support

This package includes TypeScript definitions. No additional setup is required for TypeScript projects.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.