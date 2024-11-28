import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import GoogleFontLoader from '../GoogleFontLoader';
import * as ExpoFont from 'expo-font';
import { Text } from 'react-native';

jest.mock('expo-font', () => ({
  loadAsync: jest.fn(),
}));

describe('GoogleFontLoader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    const { getByText } = render(
      <GoogleFontLoader fontFamily="Roboto">
        <Text>Font Roboto loaded</Text>
      </GoogleFontLoader>
    );
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('loads font and renders children when font is loaded', async () => {
    (ExpoFont.loadAsync as jest.Mock).mockResolvedValueOnce(undefined);

    const { getByText } = render(
      <GoogleFontLoader fontFamily="Roboto">
        <Text>Font Roboto loaded</Text>
      </GoogleFontLoader>
    );

    await waitFor(() => expect(getByText('Font Roboto loaded')).toBeTruthy());
  });

  it('handles font loading error', async () => {
    console.error = jest.fn();
    (ExpoFont.loadAsync as jest.Mock).mockRejectedValueOnce(new Error('Font loading failed'));

    const { getByText } = render(
      <GoogleFontLoader fontFamily="Roboto">
        <Text>Font Roboto loaded</Text>
      </GoogleFontLoader>
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error loading font:', expect.any(Error));
      expect(getByText('Font Roboto loaded')).toBeTruthy();
    });
  });
}); 