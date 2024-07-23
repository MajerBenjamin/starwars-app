import MainScreen, { getCharacterList } from '../../app/indexPaged';
import React from 'react';
import renderer from 'react-test-renderer';
import { render, screen, fireEvent } from '@testing-library/react-native'

test('search content is valid', async () => {
  const searchParam = 'Anakin'
  const data = await getCharacterList(1, searchParam)
  expect(data[0].name).toContain(searchParam);
})