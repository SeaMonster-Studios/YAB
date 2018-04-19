const initialState = {
  authed: false,
  user: {
    email: '',
    id: '',
  },
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case 'SET_AUTHENTICATED_USER':
      return {
        ...state,
        authed: action.authed,
        user: action.user,
      }
    case 'LOGOUT_AUTHENTICATED_USER':
      return {
        ...state,
        authed: initialState.authed,
        user: initialState.user,
      }
    default:
      return state
  }
}
