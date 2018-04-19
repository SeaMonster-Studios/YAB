import React from 'react'
import Cookies from 'js-cookie'
import { Simulate, wait } from 'react-testing-library'
import faker from 'faker'
//
import store from '../store'
import { renderWithRedux } from '../utils/testing/testing'
import { checkForAuth } from '../utils/auth/auth'
import LoginForm from '../components/LoginForm/LoginForm'
import LogoutForm from '../components/LogoutForm/LogoutForm'
import RegisterUserForm from '../components/RegisterUserForm/RegisterUserForm'

let userCreds
let integrationStore = store

function renderSetupWithRedux(store = integrationStore, overrides) {
  const wrapper = renderWithRedux(
    <div>
      <RegisterUserForm />
      <LogoutForm />
      <LoginForm />
    </div>,
    { store },
  )
  const loginForm = wrapper.getByTestId('login-form')
  const logoutFormButton = wrapper.getByTestId('logout-form-button')
  const registerUserForm = wrapper.getByTestId('register-user-form')
  const initialState = wrapper.store.getState()

  return {
    ...wrapper,
    initialState,
    loginForm,
    logoutFormButton,
    registerUserForm,
    ...overrides,
  }
}

// Order of tests is very important. We're first registering a fake user (that isn't stored in the mock API or a DB), and then using that user data for the rest of the tests

describe('Auth Integration Tests', () => {
  beforeAll(() => {
    userCreds = {
      id: faker.random.uuid(),
      email: faker.internet.email(),
      password: faker.internet.password(100),
    }
  })

  afterAll(() => {
    userCreds = undefined
  })
  describe('/register', () => {
    it('expects true to be true', () => {
      expect(true).toBe(true)
    })
    it('Registers a user when email and password are provided', async done => {
      expect.assertions(2)

      const wrapper = renderSetupWithRedux()
      const { registerUserForm, getByTestId, store } = wrapper

      Simulate.change(getByTestId('register-user-form-email'), {
        target: { value: userCreds.email },
      })

      Simulate.change(getByTestId('register-user-form-password'), {
        target: { value: userCreds.password },
      })

      await wait(() => Simulate.submit(registerUserForm))

      // need to wait for the response from the auth server (not able to get this to work with "wait" right now)
      setTimeout(async () => {
        done()
        const stateAfterSubmit = store.getState()

        expect(stateAfterSubmit.auth.authed).toBe(true)
        expect(stateAfterSubmit.auth.user.email).toBe(userCreds.email)

        integrationStore = store // preserve store for next tests
      }, 500)
    })
  })

  describe('/logout', () => {
    it('Expects the user to become unauthorized', async done => {
      expect.assertions(5)
      const wrapper = renderSetupWithRedux()
      const { logoutFormButton, store, initialState } = wrapper

      // make sure user is logged in first
      expect(initialState.auth.authed).toBe(true)
      expect(initialState.auth.user.email).toBe(userCreds.email)

      await wait(() => Simulate.click(logoutFormButton))

      // need to wait for the response from the auth server (not able to get this to work with "wait" right now)
      setTimeout(async () => {
        done()
        const stateAfterClick = store.getState()

        expect(Cookies.get('access_token')).toBeFalsy()
        expect(stateAfterClick.auth.authed).toBe(false)
        expect(stateAfterClick.auth.user.email).toBe('')

        integrationStore = store // preserve store for next tests
      }, 500)
    })
  })

  describe('/login', () => {
    it('Expects failure to login with incorrect password', async done => {
      expect.assertions(2)
      const wrapper = renderSetupWithRedux()
      const { loginForm, getByTestId } = wrapper

      Simulate.change(getByTestId('login-form-email'), {
        target: { value: userCreds.email },
      })

      Simulate.change(getByTestId('login-form-password'), {
        target: { value: faker.internet.password(100) },
      })

      await wait(() => Simulate.submit(loginForm))

      // // need to wait for the response from the auth server (not able to get this to work with "wait" right now)
      setTimeout(async () => {
        done()
        const stateAfterSubmit = store.getState()

        expect(stateAfterSubmit.auth.authed).toBe(false)
        expect(stateAfterSubmit.auth.user.email).toBe('')
      }, 500)
    })

    it('Expects failure to login with incorrect email', async done => {
      expect.assertions(2)
      const wrapper = renderSetupWithRedux()
      const { loginForm, getByTestId } = wrapper

      Simulate.change(getByTestId('login-form-email'), {
        target: { value: faker.internet.email() },
      })

      Simulate.change(getByTestId('login-form-password'), {
        target: { value: faker.internet.password(100) },
      })

      await wait(() => Simulate.submit(loginForm))

      // // need to wait for the response from the auth server (not able to get this to work with "wait" right now)
      setTimeout(async () => {
        done()
        const stateAfterSubmit = store.getState()

        expect(stateAfterSubmit.auth.authed).toBe(false)
        expect(stateAfterSubmit.auth.user.email).toBe('')
      }, 500)
    })

    it('Expects user to be able to login with registered email and password', async done => {
      expect.assertions(2)
      const wrapper = renderSetupWithRedux()
      const { loginForm, getByTestId } = wrapper

      Simulate.change(getByTestId('login-form-email'), {
        target: { value: userCreds.email },
      })

      Simulate.change(getByTestId('login-form-password'), {
        target: { value: userCreds.password },
      })

      await wait(() => Simulate.submit(loginForm))

      // need to wait for the response from the auth server (not able to get this to work with "wait" right now)
      setTimeout(async () => {
        done()
        const stateAfterSubmit = store.getState()

        expect(stateAfterSubmit.auth.authed).toBe(true)
        expect(stateAfterSubmit.auth.user.email).toBe(userCreds.email)

        integrationStore = store // preserve store for next tests
      }, 500)
    })
  })

  describe('/me', () => {
    it(`Expects currentUser's data when user is logged in`, async () => {
      const wrapper = renderSetupWithRedux()
      const { store } = wrapper

      const storeAfterAuth = await checkForAuth(store)
      const stateAfterAuthCheck = storeAfterAuth.getState()

      expect(Cookies.get('access_token')).toBeTruthy()
      expect(stateAfterAuthCheck.auth.authed).toBe(true)
      expect(stateAfterAuthCheck.auth.user.email).toBe(userCreds.email)
    })
  })
})
