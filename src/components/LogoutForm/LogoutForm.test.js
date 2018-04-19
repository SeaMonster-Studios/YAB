import React from 'react'
import faker from 'faker'
//
import { renderWithRedux } from '../../utils/testing/testing'
import LogoutForm from './LogoutForm'

describe('LogoutForm Component Test', () => {
  it('Renders with correct default values from redux store', () => {
    const wrapper = renderSetupWithRedux()

    // make sure it renders
    expect(wrapper.container).toMatchSnapshot()

    // User should be logged in if this form is showing
    expect(wrapper.initialState.auth.authed).toBe(true)
    expect(wrapper.initialState.auth.user.email).toBeTruthy()
    expect(wrapper.initialState.auth.user.id).toBeTruthy()
  })
})

function renderSetupWithRedux(overrides) {
  const wrapper = renderWithRedux(<LogoutForm />)
  const logoutButton = wrapper.getByTestId('logout-form-button')
  const initialState = {
    ...wrapper.store.getState(),
    auth: {
      authed: true,
      user: {
        email: faker.internet.email(),
        id: faker.random.uuid(),
      },
    },
  }

  return {
    ...wrapper,
    logoutButton,
    initialState,
    ...overrides,
  }
}
