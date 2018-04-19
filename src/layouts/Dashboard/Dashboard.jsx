import React from 'react'
import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect'
import PropTypes from 'prop-types'
import { SiteData, RouteData } from 'react-static'
import { connect } from 'react-redux'

class Dashboard extends React.Component {
  static propTypes = {
    render: PropTypes.func.isRequired,
  }

  render() {
    return (
      <SiteData
        render={siteProps => (
          <RouteData
            render={routeProps => (
              <React.Fragment>
                {this.props.render({
                  ...this.state,
                  ...this.props,
                  ...siteProps,
                  ...routeProps,
                })}
              </React.Fragment>
            )}
          />
        )}
      />
    )
  }
}

const mapStateToProps = state => {
  return {}
}

// const mapDispatchToProps = dispatch =>
//   bindActionCreators(actionCreators, dispatch)

const StoreWrapper = connect(mapStateToProps)(Dashboard)

export default connectedRouterRedirect({
  // The url to redirect user to if not authed
  redirectPath: '/',
  // If selector is true, wrapper will not redirect
  authenticatedSelector: state => state.auth.authed,
})(StoreWrapper)
