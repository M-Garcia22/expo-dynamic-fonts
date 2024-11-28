import React from 'react';
import { render } from '@testing-library/react-native';
import { Text, createFontComponent } from '../../components/Text';
import * as Font from 'expo-font';
import { useFont } from '../applyGoogleFont';

jest.mock('expo-font', () => ({
  loadAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../applyGoogleFont', () => ({
  useFont: jest.fn(),
}));

describe('Google Font Loading', () => {
  it('should create a component that loads the font and renders text', () => {
    (useFont as jest.Mock).mockReturnValue(true);
    const TestFont = createFontComponent('TestFont');
    const { getByText } = render(<TestFont>Test Text</TestFont>);

    // The text should be visible immediately since we're mocking useFont to return true
    expect(getByText('Test Text')).toBeTruthy();
  });

  it('should apply the font family to the text style', () => {
    (useFont as jest.Mock).mockReturnValue(true);
    const TestFont = createFontComponent('TestFont');
    const { getByText } = render(<TestFont>Test Text</TestFont>);

    const textElement = getByText('Test Text');
    expect(textElement.props.style).toContainEqual({ fontFamily: 'TestFont' });
  });

  it('should handle font loading errors', () => {
    (useFont as jest.Mock).mockReturnValue(false);

    const { getByText } = render(<Text font="ErrorFont">Test Text</Text>);

    const textElement = getByText('Test Text');
    expect(textElement.props.style).toContainEqual({ fontFamily: 'ErrorFont' });
  });
}); 