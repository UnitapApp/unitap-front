import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

describe('app', () => {
  test('renders app', () => {
    // @ts-ignore
    global.console = { warn: jest.fn(), error: jest.fn() };
    render(<App />);
    expect(console.warn).not.toBeCalled();
    expect(console.error).not.toBeCalled();
  });
});
