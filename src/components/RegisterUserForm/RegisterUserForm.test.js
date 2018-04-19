import React from 'react'
import { Simulate, wait, render } from 'react-testing-library'
import faker from 'faker'
//
import { renderWithRedux } from '../../utils/testing/testing'
import RegisterUserForm, {
  RegisterUserForm as RegisterUserFormSansRedux,
} from './RegisterUserForm'

describe('RegisterUserForm Component Test', () => {
  it('Renders with correct default values from redux store', () => {
    const wrapper = renderSetupWithRedux()

    // make sure it renders
    expect(wrapper.container).toMatchSnapshot()

    // No user should be logged in if this form is showing
    expect(wrapper.initialState.auth.authed).toBe(false)
    expect(wrapper.initialState.auth.user.email).toBe('')
    expect(wrapper.initialState.auth.user.id).toBe('')
  })

  it('Expects valid email input value to update on user input', () => {
    const { email } = renderSetup()
    const value = faker.internet.email()
    Simulate.change(email, { target: { value } })

    expect(email.value).toBe(value)
  })

  it('Expects valid password input value to update on user input', () => {
    const { password } = renderSetup()
    const value = faker.internet.password(100)
    Simulate.change(password, { target: { value } })

    expect(password.value).toBe(value)
  })

  describe('Expects correct error message to be displayed when email input is invalid', () => {
    const invalidEmails = [
      faker.random.word(),
      faker.random.words(),
      faker.internet.url(),
      faker.internet.userName(),
      faker.internet.domainName(),
      'test@adfasd',
      'something.com',
    ]

    invalidEmails.forEach(invalidEmail => {
      it(`Expects "${invalidEmail}" to be invalid, resulting in the email error message being displayed`, async () => {
        const { email, password, getByTestId, store } = renderSetupWithRedux()
        let formError

        Simulate.change(email, { target: { value: invalidEmail } })
        Simulate.change(password, {
          target: { value: faker.internet.password(100) },
        })

        await wait(() => Simulate.submit(getByTestId('register-user-form')))

        const stateAfterSubmit = store.getState()

        await wait(() => (formError = getByTestId('form-error-email')))

        expect(formError).toBeDefined()
        expect(stateAfterSubmit.auth.authed).toBe(false)
      })
    })
  })

  describe('Expects correct error message to be displayed when password input is invalid', () => {
    const invalidPasswords = [
      faker.random.word(),
      faker.random.words(),
      faker.internet.password(5), // needs at least 6 characters
      'THISISMYPASSW0RD!32423', // needs lowercase
      'test0320', // needs uppercase
      'Password', // needs number
    ]

    invalidPasswords.forEach(invalidPassword => {
      it(`Expects "${invalidPassword}" to be invalid, resulting in the password error message being displayed`, async () => {
        const { email, password, getByTestId, store } = renderSetupWithRedux()
        let formError

        Simulate.change(email, { target: { value: faker.internet.email() } })
        Simulate.change(password, {
          target: { value: invalidPassword },
        })

        await wait(() => Simulate.submit(getByTestId('register-user-form')))

        const stateAfterSubmit = store.getState()

        await wait(() => (formError = getByTestId('form-error-password')))

        expect(formError).toBeDefined()
        expect(stateAfterSubmit.auth.authed).toBe(false)
      })
    })
  })
})

function renderSetupWithRedux(overrides) {
  const wrapper = renderWithRedux(<RegisterUserForm />)
  const email = wrapper.getByTestId('register-user-form-email')
  const password = wrapper.getByTestId('register-user-form-password')
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
    <RegisterUserFormSansRedux setAuthenticatedUser={() => ({})} />,
  )
  const email = wrapper.getByTestId('register-user-form-email')
  const password = wrapper.getByTestId('register-user-form-password')

  return {
    ...wrapper,
    email,
    password,
    ...overrides,
  }
}
