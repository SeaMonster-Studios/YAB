import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import * as EmailValidator from 'email-validator'
//
import { setAuthCookie } from '../../utils/auth/auth'
import { testPasswordStrength } from '../../utils/input/input'
import * as authActionCreators from '../../store/actions/auth'

export class RegisterUserForm extends React.Component {
  static propTypes = {
    setAuthenticatedUser: PropTypes.func.isRequired,
  }
  state = {
    password: {
      value: '',
      isValid: false,
    },
    email: {
      value: '',
      isValid: false,
    },
    errorCode: '',
  }
  constructor(props) {
    super(props)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handlePasswordChange(event) {
    const password = event.target.value
    const isValid = testPasswordStrength(password)
    this.setState(prevState => ({
      ...prevState,
      password: {
        isValid,
        value: password,
      },
    }))
  }
  handleEmailChange(event) {
    const email = event.target.value
    const isValid = EmailValidator.validate(email)
    this.setState(prevState => ({
      ...prevState,
      email: {
        isValid,
        value: email,
      },
    }))
  }
  async handleSubmit(e) {
    e.preventDefault()
    let formValid = true

    if (!this.state.email.isValid) {
      formValid = false
      this.setState(prevState => ({
        ...prevState,
        errorCode: 'email',
      }))
    }

    if (!this.state.password.isValid) {
      formValid = false
      this.setState(prevState => ({
        ...prevState,
        errorCode: 'password',
      }))
    }

    if (formValid) {
      try {
        const { data } = await axios.post('/auth/register', {
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
        // SENTRY will handle this
        console.error('error', error)
      }
    }
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit} data-testid="register-user-form">
        <input
          type="email"
          placeholder="Email"
          name="email"
          data-testid="register-user-form-email"
          value={this.state.email.value}
          required
          onChange={this.handleEmailChange}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={this.state.password.value}
          data-testid="register-user-form-password"
          required
          onChange={this.handlePasswordChange}
        />
        <button type="submit">Create Account</button>
        <FormError errorCode={this.state.errorCode} />
      </form>
    )
  }
}

function FormError({ errorCode }) {
  if (errorCode === 'email') {
    return (
      <div className="formError" data-testid="form-error-email">
        Please enter a valid email address.
      </div>
    )
  } else if (errorCode === 'password') {
    return (
      <div className="formError" data-testid="form-error-password">
        Please enter a valid password.
        <ul>
          <li>Must be at least 6 characters.</li>
          <li>Must have at least one lowercase letter.</li>
          <li>Must have at least one uppercase letter.</li>
          <li>Must have at least one number.</li>
        </ul>
      </div>
    )
  }
  return null
}

FormError.propTypes = {
  errorCode: PropTypes.string.isRequired,
}

const mapStateToProps = () => ({})

const mapDispatchToProps = dispatch =>
  bindActionCreators(authActionCreators, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(RegisterUserForm)
