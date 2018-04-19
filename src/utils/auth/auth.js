import Cookies from 'js-cookie'
import axios from 'axios'
//
import defaultStore from '../../store'
import * as authActionCreators from '../../store/actions/auth'

export function setAuthCookie(token) {
  if (typeof document !== 'undefined') {
    Cookies.set('access_token', token)
  }
}

export async function checkForAuth(store = defaultStore) {
  if (typeof document !== 'undefined') {
    const access_token = Cookies.get('access_token')

    if (access_token) {
      try {
        const response = await axios.get('/auth/me', {
          headers: {
            'x-access-token': access_token,
          },
        })
        if (response.status === 200) {
          store.dispatch(
            authActionCreators.setAuthenticatedUser({
              authed: true,
              user: {
                email: response.data.email,
                id: response.data.id,
              },
            }),
          )
        }
        return store
      } catch (error) {
        // SENTRY will handle this, error on server
        console.log('error', error)

        return 'error'
      }
    }
    return store
  }
}
