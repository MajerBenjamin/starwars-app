import MainScreen from '../../app/index';
import React from 'react';
import renderer from 'react-test-renderer';
import { render, screen, fireEvent } from '@testing-library/react-native'

test('search input add correct text', async () => {
  const searchParam = 'Anakin'

  const { getByTestId } = render(<MainScreen />)
  const input = getByTestId('input');
  fireEvent.changeText(input, searchParam);
  expect(input.props.value).toBe(searchParam);
})