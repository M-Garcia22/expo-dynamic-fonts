import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Text, createFontComponent } from '../Text';
import useFont from '../../utils/applyGoogleFont';

jest.mock('../../utils/applyGoogleFont', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('Text component', () => {
  it('renders text without font prop', () => {
    const { getByText } = render(<Text>Hello, World!</Text>);
    expect(getByText('Hello, World!')).toBeTruthy();
  });

  it('applies font family even when font is not loaded', () => {
    (useFont as jest.Mock).mockReturnValue(false);
    const { getByText } = render(<Text font="Roboto">Hello, Roboto!</Text>);
    const textElement = getByText('Hello, Roboto!');
    expect(textElement.props.style).toContainEqual({ fontFamily: 'Roboto' });
  });

  it('creates a custom font component', () => {
    (useFont as jest.Mock).mockReturnValue(true);
    const TextRoboto = createFontComponent('Roboto');
    const { getByText } = render(<TextRoboto>Hello, Custom Roboto!</TextRoboto>);
    const textElement = getByText('Hello, Custom Roboto!');
    expect(textElement.props.style).toContainEqual({ fontFamily: 'Roboto' });
  });
});