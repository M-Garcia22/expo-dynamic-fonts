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

  it('creates a custom font component with variants', () => {
    (useFont as jest.Mock).mockReturnValue(true);
    const RobotoBoldItalic = createFontComponent('Roboto', { weight: 700, style: 'italic' });
    const { getByText } = render(<RobotoBoldItalic>Hello, Bold Italic!</RobotoBoldItalic>);
    
    const textElement = getByText('Hello, Bold Italic!');
    expect(textElement.props.style).toContainEqual({ fontFamily: 'Roboto:ital,wght@1,700' });
  });

  it('creates a custom font component with only weight variant', () => {
    (useFont as jest.Mock).mockReturnValue(true);
    const RobotoBold = createFontComponent('Roboto', { weight: 700 });
    const { getByText } = render(<RobotoBold>Hello, Bold!</RobotoBold>);
    
    const textElement = getByText('Hello, Bold!');
    expect(textElement.props.style).toContainEqual({ fontFamily: 'Roboto:wght@700' });
  });

  it('creates a custom font component with only style variant', () => {
    (useFont as jest.Mock).mockReturnValue(true);
    const RobotoItalic = createFontComponent('Roboto', { style: 'italic' });
    const { getByText } = render(<RobotoItalic>Hello, Italic!</RobotoItalic>);
    
    const textElement = getByText('Hello, Italic!');
    expect(textElement.props.style).toContainEqual({ fontFamily: 'Roboto:ital@1' });
  });
});