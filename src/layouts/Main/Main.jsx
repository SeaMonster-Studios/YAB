import React from 'react'
import PropTypes from 'prop-types'
import { SiteData, RouteData } from 'react-static'
import { connect } from 'react-redux'
//
import MarketingNav from '../../components/MarketingNav/MarketingNav'

class Main extends React.Component {
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
                <MarketingNav />
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

export default connect(mapStateToProps)(Main)
