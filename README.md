# Expo Dynamic Fonts <img src="badge.png" alt="GDPR Compliant Badge" align="right" width="100" style="margin-left: 20px;"/>

[![npm downloads](https://img.shields.io/npm/dt/expo-dynamic-fonts.svg?label=Total%20Downloads)](https://www.npmjs.com/package/expo-dynamic-fonts)
[![weekly](https://img.shields.io/npm/dw/expo-dynamic-fonts.svg?label=Weekly&suffix=%20Downloads)](https://www.npmjs.com/package/expo-dynamic-fonts)

![Download Trend](https://starchart.cc/Valentine8342/expo-dynamic-fonts.svg)

A powerful and GDPR-compliant Expo package for dynamically loading and using Google Fonts in your Expo application.

![Expo Dynamic Fonts Demo](dynamic-fonts.gif)

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Using the Text component](#using-the-text-component)
  - [Creating a custom font component](#creating-a-custom-font-component)
  - [Using the useFont hook](#using-the-usefont-hook)
- [API Reference](#api-reference)
- [How it works](#how-it-works)
- [GDPR Compliance and Font Bundling](#gdpr-compliance-and-font-bundling)
- [Advanced Usage](#advanced-usage)
- [TypeScript Support](#typescript-support)
- [Performance Considerations](#performance-considerations)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Installation

To get started with `expo-dynamic-fonts`, follow these steps:

1. **Install the package:**

   ```sh
   npm install expo-dynamic-fonts
   # or
   yarn add expo-dynamic-fonts
   ```

2. **Install peer dependencies:**

   ```sh
   npm install expo-font expo react react-native
   # or
   yarn add expo-font expo react react-native
   ```

## Usage

### Using the Text component

Import and use the `Text` component with the `font` prop:

```tsx
import React from 'react';
import { View } from 'react-native';
import { Text } from 'expo-dynamic-fonts';

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
import { createFontComponent } from 'expo-dynamic-fonts';

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
import { View, Text } from 'react-native';
import { useFont } from 'expo-dynamic-fonts';

const App = () => {
  const robotoLoaded = useFont('Roboto');
  const openSansLoaded = useFont('Open Sans');

  if (!robotoLoaded || !openSansLoaded) {
    return <View><Text>Loading fonts...</Text></View>;
  }

  return (
    <View className="flex-1 justify-center items-center">
      <Text style={{ fontFamily: 'Open Sans' }} className="text-lg">
        Hello, Open Sans!
      </Text>
      <Text style={{ fontFamily: 'Roboto' }} className="text-xl mt-4">
        Hello, Roboto!
      </Text>
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

The `expo-dynamic-fonts` package simplifies the process of using Google Fonts in your Expo application:

1. It accepts a Google Font name through the `font` prop, `createFontComponent` function, or `useFont` hook.
2. The package fetches the font CSS from the Google Fonts API.
3. It extracts the font URL from the CSS.
4. It then loads the font using `expo-font`'s `loadAsync` method.
5. Once loaded, the font is applied to the text.
6. Loaded fonts are cached to prevent unnecessary reloading and improve performance.

## GDPR Compliance and Font Bundling

To ensure GDPR compliance and improve performance, `expo-dynamic-fonts` provides a way to bundle fonts with your application instead of fetching them from the Google Fonts API at runtime.

### Automatic Font Bundling

You can use the `moveFonts` script to automatically download and bundle the fonts used in your application. This script will:

1. Detect the fonts used in your app
2. Download the font files
3. Move them to the correct location in your project
4. Update your `app.json` and `App.tsx` files to use the bundled fonts

To use this feature:

1. Add the following script to your `package.json`:

```json
"scripts": {
  "move-fonts": "node node_modules/expo-dynamic-fonts/scripts/moveFonts.js"
}
```

2. Run the script after you've used the fonts in your app:

```sh
npm run move-fonts
# or
yarn move-fonts
```

3. Rebuild your app to include the bundled fonts.

### Example Usage

Here's an example of how to use `expo-dynamic-fonts` with bundled fonts:

```jsx
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Text } from 'expo-dynamic-fonts';

export default function App() {
  return (
    <View style={styles.container}>
      <Text font="Ribeye" style={{ fontSize: 30 }}>DYNAMIC FONT LOADER</Text>
      <Text style={styles.text}>GDPR COMPLIANT FONT LOADER</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'Ribeye',
    fontSize: 30,
    textAlign: 'center',
  },
});
```

After using the fonts in your app, run the `move-fonts` script to bundle them with your application. This ensures that your app is GDPR compliant and performs better by not relying on external font loading at runtime.

### Clearing Cached Fonts

If you need to clear the cached fonts and remove them from your project, you can use the `--clear-cache` flag:

```sh
npm run move-fonts -- --clear-cache
# or
yarn move-fonts --clear-cache
```

This will remove the cached font files and update your `App.tsx` accordingly.

By using this bundling approach, you can ensure that your app is GDPR compliant while still enjoying the benefits of using custom fonts in your Expo application.

## Advanced Usage

### Loading multiple fonts

You can load multiple fonts simultaneously:

```tsx
import React from 'react';
import { View } from 'react-native';
import { Text, useFont } from 'expo-dynamic-fonts';

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

We welcome contributions to `expo-dynamic-fonts`! Here's how you can help:

1. Clone the main repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with a clear message.
4. Push your changes to the main repository and create a pull request.

Please ensure your code adheres to the existing style and includes appropriate tests. We encourage direct contributions to the main repository rather than creating separate forks.

Before starting work on a significant change, please open an issue to discuss your proposed modifications. This helps ensure your time is well spent and that your contribution aligns with the project's goals.

By contributing to this project, you agree that your contributions will be licensed under the same MIT License that covers the project.

For any questions about contributing, please open an issue in the project repository.

## License

This project is licensed under the MIT License. This means:

1. You can use this package in your projects, including commercial ones.
2. You can modify, distribute, and sublicense the code.
3. You must include the original copyright notice and the MIT License text in any substantial portion of the software.

For any questions about licensing or usage, please open an issue in the project repository.

