# React Native Font Loader

A powerful React Native package for dynamically loading and using Google Fonts in your React Native application with ease.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Using the Text component](#using-the-text-component)
  - [Creating a custom font component](#creating-a-custom-font-component)
  - [Using the useFont hook](#using-the-usefont-hook)
- [API Reference](#api-reference)
- [How it works](#how-it-works)
- [Advanced Usage](#advanced-usage)
- [TypeScript Support](#typescript-support)
- [Performance Considerations](#performance-considerations)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Installation

To get started with `react-native-font-loader`, follow these steps:

1. **Install the package:**

   ```sh
   npm install react-native-font-loader
   # or
   yarn add react-native-font-loader
   ```

2. **Install peer dependencies:**

   ```sh
   npm install react-native-webview react react-native
   # or
   yarn add react-native-webview react react-native
   ```

## Usage

### Using the Text component

Import and use the `Text` component with the `font` prop:

```tsx
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-font-loader';

const App = () => {
  return (
    <View className="flex-1 justify-center items-center">
      <Text font="Open Sans" className="text-lg">
        Hello, Open Sans!
      </Text>
      <Text font="Roboto" className="text-xl mt-4">
        Hello, Roboto!
      </Text>
    </View>
  );
};

export default App;
```

### Creating a custom font component

Use the `createFontComponent` function to create a custom component for a specific Google Font:

```tsx
import React from 'react';
import { View } from 'react-native';
import { createFontComponent } from 'react-native-font-loader';

const RobotoText = createFontComponent('Roboto');
const OpenSansText = createFontComponent('Open Sans');

const App = () => {
  return (
    <View className="flex-1 justify-center items-center">
      <OpenSansText className="text-lg">Hello, Open Sans!</OpenSansText>
      <RobotoText className="text-xl mt-4">Hello, Roboto!</RobotoText>
    </View>
  );
};

export default App;
```

### Using the useFont hook

For more control over font loading, use the `useFont` hook:

```tsx
import React from 'react';
import { View, Text as RNText } from 'react-native';
import { useFont } from 'react-native-font-loader';

const App = () => {
  const robotoLoaded = useFont('Roboto');
  const openSansLoaded = useFont('Open Sans');

  if (!robotoLoaded || !openSansLoaded) {
    return <View><RNText>Loading fonts...</RNText></View>;
  }

  return (
    <View className="flex-1 justify-center items-center">
      <RNText style={{ fontFamily: 'Open Sans' }} className="text-lg">
        Hello, Open Sans!
      </RNText>
      <RNText style={{ fontFamily: 'Roboto' }} className="text-xl mt-4">
        Hello, Roboto!
      </RNText>
    </View>
  );
};

export default App;
```

## API Reference

### Text

A custom Text component that extends React Native's Text component with an additional `font` prop.

Props:
- `font` (optional string): The name of the Google Font to apply.
- All other props from React Native's Text component are supported.

### createFontComponent

A function to create a custom component for a specific Google Font.

Usage:
```tsx
const RobotoText = createFontComponent('Roboto');
```

### useFont

A hook to load and use a Google Font.

Usage:
```tsx
const fontLoaded = useFont('Roboto');
```

## How it works

The `react-native-font-loader` package simplifies the process of using Google Fonts in your React Native application:

1. It accepts a Google Font name through the `font` prop, `createFontComponent` function, or `useFont` hook.
2. The package fetches the font from the Google Fonts API.
3. It then loads the font using a WebView component.
4. Once loaded, the font is applied to the text.
5. Loaded fonts are cached to prevent unnecessary reloading and improve performance.

## Advanced Usage

### Loading multiple fonts

You can load multiple fonts simultaneously:

```tsx
import React from 'react';
import { View } from 'react-native';
import { Text, useFont } from 'react-native-font-loader';

const App = () => {
  const [robotoLoaded, openSansLoaded] = useFont(['Roboto', 'Open Sans']);

  if (!robotoLoaded || !openSansLoaded) {
    return <View><Text>Loading fonts...</Text></View>;
  }

  return (
    <View className="flex-1 justify-center items-center">
      <Text font="Open Sans" className="text-lg">Hello, Open Sans!</Text>
      <Text font="Roboto" className="text-xl mt-4">Hello, Roboto!</Text>
    </View>
  );
};

export default App;
```

### Custom font variants

You can specify font variants when creating a custom font component:

```tsx
const RobotoBoldItalic = createFontComponent('Roboto', { weight: 700, style: 'italic' });
```

## TypeScript Support

This package includes TypeScript definitions out of the box. No additional setup is required for TypeScript projects.

## Performance Considerations

- Font loading is asynchronous and doesn't block the main thread.
- Fonts are cached after the first load to improve performance in subsequent renders.
- Consider preloading fonts at app startup for a smoother user experience.

## Troubleshooting

If you encounter issues:

1. Ensure you have an active internet connection for font fetching.
2. Verify that the font name is correct and available on Google Fonts.
3. Check that all peer dependencies are correctly installed.
4. Clear your app's cache and rebuild if changes don't appear immediately.

## Contributing

We welcome contributions to `react-native-font-loader`! Here's how you can help:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with a clear message.
4. Push your changes and create a pull request.

Please ensure your code adheres to the existing style and includes appropriate tests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

