import React from 'react';
import { render, act } from '@testing-library/react-native';
import { applyGoogleFont } from '../applyGoogleFont';
import * as Font from 'expo-font';

jest.mock('expo-font', () => ({
  loadAsync: jest.fn().mockResolvedValue(undefined),
}));

describe('applyGoogleFont', () => {
  it('should create a component that loads the font and renders text', async () => {
    const TestFont = applyGoogleFont('TestFont');
    const { getByText, rerender } = render(<TestFont>Test Text</TestFont>);

    // Initially, the component should render null
    expect(() => getByText('Test Text')).toThrow();

    // Simulate font loading
    await act(async () => {
      await (Font.loadAsync as jest.Mock).mock.results[0].value;
    });

    // Re-render after font is loaded
    rerender(<TestFont>Test Text</TestFont>);

    // Now the text should be visible
    expect(getByText('Test Text')).toBeTruthy();
  });

  it('should apply the font family to the text style', async () => {
    const TestFont = applyGoogleFont('TestFont');
    const { getByText } = render(<TestFont>Test Text</TestFont>);

    // Simulate font loading
    await act(async () => {
      await (Font.loadAsync as jest.Mock).mock.results[0].value;
    });

    const textElement = getByText('Test Text');
    expect(textElement.props.style).toContainEqual({ fontFamily: 'TestFont' });
  });

  it('should handle font loading errors', async () => {
    console.error = jest.fn(); // Mock console.error
    (Font.loadAsync as jest.Mock).mockRejectedValueOnce(new Error('Font loading failed'));

    const TestFont = applyGoogleFont('ErrorFont');
    const { getByText } = render(<TestFont>Test Text</TestFont>);

    // Simulate font loading attempt
    await act(async () => {
      try {
        await (Font.loadAsync as jest.Mock).mock.results[0].value;
      } catch (error) {
        // Error is expected
      }
    });

    // The component should still render null due to the error
    expect(() => getByText('Test Text')).toThrow();
    expect(console.error).toHaveBeenCalledWith('Failed to load font ErrorFont:', expect.any(Error));
  });
}); 