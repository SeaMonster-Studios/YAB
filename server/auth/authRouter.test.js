/**
 * @jest-environment node
 */

import axios from 'axios'
import faker from 'faker'

jest.unmock('axios')

let currentUser
let userCreds
let api

beforeAll(() => {
  api = axios.create({
    baseURL: `http://localhost:${5000}/auth`,
  })

  userCreds = {
    email: faker.internet.email(),
    password: faker.internet.password(100),
  }
})

afterAll(() => {
  api = undefined
  userCreds = undefined
})

// Order of tests is very important. We're first registering a fake user (that isn't stored in the mock API or a DB), and then using that user data for the rest of the tests

describe('/register', () => {
  it('Registers a user when email and password are provided', async () => {
    const { data } = await api.post('/register', userCreds)
    currentUser = data

    expect(currentUser.auth).toBe(true)
    expect(currentUser.id).toBeGreaterThan(0)
  })

  it('Fails to register user when there is no password, 500 error', async () => {
    let response
    try {
      response = await api.post('/register', {
        email: faker.internet.email(),
      })
    } catch (error) {
      response = error.response
    }
    expect(response.status).toBe(500)
  })

  it('Fails to register user when there is no email, 500 error', async () => {
    let response
    try {
      response = await api.post('/register', {
        password: faker.internet.password(100),
      })
    } catch (error) {
      response = error.response
    }
    expect(response.status).toBe(500)
  })
})

describe('/logout', () => {
  it('Expects the user to become unauthorized', async () => {
    const { data } = await api.get('/logout')
    currentUser = data

    expect(currentUser.auth).toBe(false)
  })
})

describe('/login', () => {
  it('Expects user to be able to login with registered email and password', async () => {
    const { data } = await api.post('/login', userCreds)
    currentUser = data

    expect(currentUser.auth).toBe(true)
    expect(currentUser.id).toBeGreaterThan(0)
  })

  it('Expects failure to login without password, 404 error', async () => {
    let response
    try {
      response = await api.post('/login', {
        email: userCreds.email,
      })
    } catch (error) {
      response = error.response
    }
    expect(response.status).toBe(404)
  })

  it('Expects failure to login with incorrect password, 401 error', async () => {
    let response
    try {
      response = await api.post('/login', {
        email: userCreds.email,
        password: faker.internet.password(100),
      })
    } catch (error) {
      response = error.response
    }
    expect(response.status).toBe(401)
  })

  it('Expects failure to login without email, 404 error', async () => {
    let response
    try {
      response = await api.post('/login', {
        password: userCreds.password,
      })
    } catch (error) {
      response = error.response
    }
    expect(response.status).toBe(404)
  })

  it('Expects failure to login with incorrect email, 404 error', async () => {
    let response
    try {
      response = await api.post('/login', {
        email: faker.internet.email(),
        password: userCreds.password,
      })
    } catch (error) {
      response = error.response
    }
    expect(response.status).toBe(404)
  })
})

describe('/me, used to verify current token and return authenticated user data', () => {
  it(`Expects currentUser's data when authorizated (via token)`, async () => {
    const { data } = await api.get('/me', {
      headers: {
        'x-access-token': currentUser.token,
      },
    })
    expect(data.email).toBe(userCreds.email)
    expect(data.id).toBe(currentUser.id)
  })

  it('Expects auth of *false* when no token is provided', async () => {
    const response = await api.get('/me')
    expect(response.data.auth).toBeFalsy()
  })

  it('Expects 500 error and authentication to fail when an incorrect token is provided', async () => {
    let response
    try {
      response = await api.get('/me', {
        headers: {
          'x-access-token': 'a-fake-token',
        },
      })
    } catch (error) {
      response = error.response
    }
    expect(response.status).toBe(500)
    expect(response.data.auth).toBeFalsy()
  })
})
