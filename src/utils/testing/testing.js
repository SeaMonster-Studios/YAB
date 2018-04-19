import React from 'react'
import { render } from 'react-testing-library'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
//
import reducer from '../../store/reducers'

// Reference: https://github.com/kentcdodds/react-testing-library/blob/master/src/__tests__/react-redux.js

export function renderWithRedux(
  ui,
  { initialState, store = createStore(reducer, initialState) } = {},
) {
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    // adding `store` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    store,
  }
}
