import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
//
import { setAuthCookie } from '../../utils/auth/auth'
import * as authActionCreators from '../../store/actions/auth'

export class LoginForm extends React.Component {
  static propTypes = {
    setAuthenticatedUser: PropTypes.func.isRequired,
  }
  state = {
    password: {
      value: '',
    },
    email: {
      value: '',
    },
    errorCode: 0,
  }
  constructor(props) {
    super(props)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handlePasswordChange(event) {
    const password = event.target.value
    this.setState(prevState => ({
      ...prevState,
      password: {
        value: password,
      },
    }))
  }
  handleEmailChange(event) {
    const email = event.target.value
    this.setState(prevState => ({
      ...prevState,
      email: {
        value: email,
      },
    }))
  }

  async handleSubmit(e) {
    e.preventDefault()

    try {
      const { data } = await axios.post('/auth/login', {
        email: this.state.email.value,
        password: this.state.password.value,
      })
      this.props.setAuthenticatedUser({
        authed: data.auth,
        user: {
          email: this.state.email.value,
          id: data.id,
        },
      })
      setAuthCookie(data.token)
    } catch (error) {
      if (error.response) {
        this.setState(prevState => ({
          ...prevState,
          errorCode: error.response.status,
        }))
      } else {
        // SENTRY will handle this
        console.error(error)
      }
    }
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit} data-testid="login-form">
        <input
          type="email"
          placeholder="Email"
          name="email"
          data-testid="login-form-email"
          value={this.state.email.value}
          required
          onChange={this.handleEmailChange}
        />
        <input
          type="password"
          required
          name="password"
          value={this.state.password.value}
          data-testid="login-form-password"
          placeholder="Password"
          onChange={this.handlePasswordChange}
        />
        <button type="submit">Login</button>
        <FormError errorCode={this.state.errorCode} />
      </form>
    )
  }
}

function FormError({ errorCode }) {
  if (errorCode === 404) {
    return (
      <div className="formError" data-testid="form-error-404">
        Sorry, but there is no account registered with that email address.
      </div>
    )
  } else if (errorCode > 0) {
    return (
      <div className="formError" data-testid="form-error-401">
        Sorry, but the email/password combination you entered does not exist.
      </div>
    )
  }
  return null
}

FormError.propTypes = {
  errorCode: PropTypes.number.isRequired,
}

const mapStateToProps = () => ({})

const mapDispatchToProps = dispatch =>
  bindActionCreators(authActionCreators, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)
