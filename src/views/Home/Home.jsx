import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
//
import Main from '../../layouts/Main/Main'
import RegisterUserForm from '../../components/RegisterUserForm/RegisterUserForm'
import LogoutForm from '../../components/LogoutForm/LogoutForm'
import LoginForm from '../../components/LoginForm/LoginForm'

class HomeInner extends React.Component {
  static propTypes = {
    authed: PropTypes.bool.isRequired,
    user: PropTypes.shape({
      email: PropTypes.string.isRequired,
    }).isRequired,
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      ...prevState,
      ...nextProps,
    }
  }
  constructor(props) {
    super(props)
    this.state = {
      authed: props.authed,
      user: props.user,
    }
  }
  render() {
    const { authed, user } = this.state
    return (
      <div className="Home">
        <header className="Home-header">
          <h1 className="Home-title">Welcome to React</h1>
        </header>
        {authed ? (
          <div>
            <h2>Hello, {user.email}</h2>
            <LogoutForm />
          </div>
        ) : (
          <div>
            <h2>Login</h2>
            <LoginForm />
            <h2>Create an Account</h2>
            <RegisterUserForm />
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = ({ auth }) => {
  return {
    authed: auth.authed,
    user: auth.user,
  }
}

function Home(props) {
  return <Main render={mainProps => <HomeInner {...mainProps} {...props} />} />
}

export default connect(mapStateToProps)(Home)
