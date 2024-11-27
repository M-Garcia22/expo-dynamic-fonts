import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import GoogleFontLoader from '../GoogleFontLoader';
import * as ExpoFont from 'expo-font';
import { Text } from 'react-native';

jest.mock('expo-font', () => ({
  loadAsync: jest.fn(),
}));

global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    text: () => Promise.resolve('url(https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxK.woff2)'),
  })
) as jest.Mock;

describe('GoogleFontLoader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading text initially', () => {
    const { getByText } = render(
      <GoogleFontLoader fontFamily="Roboto">
        <></>
      </GoogleFontLoader>
    );
    expect(getByText('Loading font...')).toBeTruthy();
  });

  it('loads font and renders children when font is loaded', async () => {
    const { findByText } = render(
      <GoogleFontLoader fontFamily="Roboto">
        <Text>Font Roboto loaded</Text>
      </GoogleFontLoader>
    );

    await waitFor(() => {
      expect(ExpoFont.loadAsync).toHaveBeenCalledWith({
        Roboto: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxK.woff2',
      });
    }, { timeout: 5000 });

    const loadedText = await findByText('Font Roboto loaded');
    expect(loadedText).toBeTruthy();
  });

  it('handles font loading error', async () => {
    console.error = jest.fn();
    (ExpoFont.loadAsync as jest.Mock).mockRejectedValueOnce(new Error('Font loading failed'));

    render(
      <GoogleFontLoader fontFamily="InvalidFont">
        <></>
      </GoogleFontLoader>
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error loading font:', new Error('Font loading failed'));
    }, { timeout: 5000 });
  });
}); 