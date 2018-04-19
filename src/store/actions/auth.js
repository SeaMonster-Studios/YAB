export function setAuthenticatedUser({ authed, user }) {
  return {
    type: 'SET_AUTHENTICATED_USER',
    authed,
    user,
  }
}

export function logoutAuthenticatedUser() {
  return {
    type: 'LOGOUT_AUTHENTICATED_USER',
  }
}
