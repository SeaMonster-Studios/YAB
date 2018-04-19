import Cookies from 'js-cookie'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import faker from 'faker'
//
import { checkForAuth, setAuthCookie } from './auth'

describe('Auth utils', () => {
  afterEach(() => {
    Cookies.remove('access_token')
  })

  it('Expect auth token to be stored as a cookie when setAuthCookie is called', () => {
    const token = faker.random.alphaNumeric()
    setAuthCookie(token)
    expect(Cookies.get('access_token')).toBe(token)
  })

  describe('Checking to see if auth exists in cookies – checkForAuth', () => {
    it('Expects auth check to fail if there is no access token stored as a cookie', async () => {
      const store = await checkForAuth()
      expect(store.getState().auth.authed).toBe(false)
      expect(Cookies.get('access_token')).toBeUndefined()
    })

    it('Expects auth to fail if access_token failed to authenticate', async () => {
      const token = faker.random.alphaNumeric()
      setAuthCookie(token)

      new MockAdapter(axios).onGet('/auth/me').reply(204)

      const store = await checkForAuth()

      expect(store.getState().auth.authed).toBe(false)
    })

    it('expects auth to succeed if access_token exists and is authenticated', async () => {
      const email = faker.internet.email()
      const token = faker.random.alphaNumeric() // just to get past `if (access_token)` in checkForAuth()
      setAuthCookie(token)

      new MockAdapter(axios).onGet('/auth/me').reply(200, {
        email: email,
        id: 1,
      })

      const store = await checkForAuth()

      const state = store.getState()
      expect(state.auth.authed).toBe(true)
      expect(state.auth.user.email).toBe(email)
    })
  })
})
