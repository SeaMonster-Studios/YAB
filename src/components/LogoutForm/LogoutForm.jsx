import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import Cookies from 'js-cookie'
//
import * as authActionCreators from '../../store/actions/auth'

class RegisterUserForm extends React.Component {
  static propTypes = {
    logoutAuthenticatedUser: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props)

    this.handleLogout = this.handleLogout.bind(this)
  }
  async handleLogout(e) {
    e.preventDefault()
    try {
      axios.get('/auth/logout')
      Cookies.remove('access_token')
      this.props.logoutAuthenticatedUser()
    } catch (error) {
      // SENTRY handle this
      console.log(error)
    }
  }
  render() {
    return (
      <button onClick={this.handleLogout} data-testid="logout-form-button">
        Logout
      </button>
    )
  }
}

const mapStateToProps = () => ({})

const mapDispatchToProps = dispatch =>
  bindActionCreators(authActionCreators, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(RegisterUserForm)
