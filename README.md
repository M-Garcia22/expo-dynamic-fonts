# Expo Dynamic Fonts

A powerful Expo package for dynamically loading and using Google Fonts in your Expo application with ease.

![Expo Dynamic Fonts Demo](dynamic-fonts.gif)

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

By contributing to this project, you agree that your contributions will be licensed under the same AGPL-3.0 license that covers the project.

For any questions about contributing, please open an issue in the project repository.

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). This means:

1. You can use this package in your projects, including commercial ones.
2. If you modify this package, you must distribute your modifications under the same AGPL-3.0 license.
3. You cannot create and distribute closed-source versions of this package.

We encourage contributions to the main repository rather than creating separate forks. 

For any questions about licensing or usage, please open an issue in the project repository.

