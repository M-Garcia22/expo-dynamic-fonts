---
name: Feature request
about: Suggest an idea for this project
title: ''
labels: ''
assignees: ''

---

# Feature Request

## Problem Statement
A clear and concise description of what the problem is. For example:
> I'm always frustrated when trying to dynamically load fonts because...

## Proposed Solution
A clear and concise description of what you want to happen. Include:
- Detailed explanation of the feature
- Expected behavior
- Potential API design

Example usage:
```javascript
import { DynamicFont } from 'expo-dynamic-fonts';

// How you envision using the feature
const MyComponent = () => {
  return (
    <DynamicFont
      source="https://fonts.example.com/font.ttf"
      onLoad={() => console.log('Font loaded!')}
    >
      Hello World
    </DynamicFont>
  );
};
```

## Alternative Solutions
A clear and concise description of any alternative solutions or features you've considered, such as:
- Different API approaches
- Workarounds
- Related existing solutions

## Additional Context
- Screenshots or mockups
- Links to similar features in other libraries
- Performance considerations
- Platform-specific considerations (iOS/Android)
