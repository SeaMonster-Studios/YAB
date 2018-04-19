import React from 'react'
import { Simulate, wait, render } from 'react-testing-library'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import faker from 'faker'
//
import { renderWithRedux } from '../../utils/testing/testing'
import LoginForm, { LoginForm as LoginFormSansRedux } from './LoginForm'

describe('LoginForm Component Test', () => {
  it('Renders with correct default values from redux store', () => {
    const wrapper = renderSetupWithRedux()

    // make sure it renders
    expect(wrapper.container).toMatchSnapshot()

    // No user should be logged in if this form is showing
    expect(wrapper.initialState.auth.authed).toBe(false)
    expect(wrapper.initialState.auth.user.email).toBe('')
    expect(wrapper.initialState.auth.user.id).toBe('')
  })

  it('Expects email input value to update on user input', () => {
    let { email } = renderSetup()
    const value = faker.random.words()
    Simulate.change(email, { target: { value } })

    expect(email.value).toBe(value)
  })

  it('Expects password input value to update on user input', () => {
    let { password } = renderSetup()
    const value = faker.random.words()
    Simulate.change(password, { target: { value } })

    expect(password.value).toBe(value)
  })

  it('Expects a relevant error message to be displayed when no user is found', async () => {
    new MockAdapter(axios).onPost('/auth/login').reply(404)

    const wrapper = renderSetupWithRedux()
    const { email, password, getByTestId } = wrapper
    let formError

    Simulate.change(password, { target: { value: 'password' } })
    Simulate.change(email, {
      target: { value: 'someonefkjaskdfjfj@gmail.com' },
    })

    await wait(() => Simulate.submit(getByTestId('login-form')))
    const stateAfterSubmit = wrapper.store.getState()

    await wait(() => (formError = wrapper.getByTestId('form-error-404')))

    expect(formError).toBeDefined()
    expect(wrapper.container).toMatchSnapshot()
    expect(stateAfterSubmit.auth.authed).toBe(false)
  })

  it('Expects a relevant error message to be displayed when password is incorrect', async () => {
    new MockAdapter(axios).onPost('/auth/login').reply(401)

    const wrapper = renderSetupWithRedux()
    const { email, password, getByTestId } = wrapper
    let formError

    Simulate.change(password, { target: { value: 'password' } })
    Simulate.change(email, {
      target: { value: 'someonefkjaskdfjfj@gmail.com' },
    })

    await wait(() => Simulate.submit(getByTestId('login-form')))
    const stateAfterSubmit = wrapper.store.getState()

    await wait(() => (formError = wrapper.getByTestId('form-error-401')))

    expect(formError).toBeDefined()
    expect(wrapper.container).toMatchSnapshot()
    expect(stateAfterSubmit.auth.authed).toBe(false)
  })

  it('Expects a default error message to be displayed when there is a 500 error', async () => {
    new MockAdapter(axios).onPost('/auth/login').reply(500)

    const wrapper = renderSetupWithRedux()
    const { email, password, getByTestId } = wrapper
    let formError

    Simulate.change(password, { target: { value: 'password' } })
    Simulate.change(email, {
      target: { value: 'someonefkjaskdfjfj@gmail.com' },
    })

    await wait(() => Simulate.submit(getByTestId('login-form')))
    const stateAfterSubmit = wrapper.store.getState()

    await wait(() => (formError = wrapper.getByTestId('form-error-401')))

    expect(formError).toBeDefined()
    expect(wrapper.container).toMatchSnapshot()
    expect(stateAfterSubmit.auth.authed).toBe(false)
  })
})

function renderSetupWithRedux(overrides) {
  const wrapper = renderWithRedux(<LoginForm />)
  const email = wrapper.getByTestId('login-form-email')
  const password = wrapper.getByTestId('login-form-password')
  const initialState = wrapper.store.getState()

  return {
    ...wrapper,
    email,
    password,
    initialState,
    ...overrides,
  }
}

function renderSetup(overrides) {
  const wrapper = render(
    <LoginFormSansRedux setAuthenticatedUser={() => ({})} />,
  )
  const email = wrapper.getByTestId('login-form-email')
  const password = wrapper.getByTestId('login-form-password')

  return {
    ...wrapper,
    email,
    password,
    ...overrides,
  }
}
