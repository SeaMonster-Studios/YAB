import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
//
import Main from '../../layouts/Main/Main'

class AboutInner extends React.Component {
  static propTypes = {}
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div>
        <h1>About Page.</h1>
        <p>Anyone can be here.</p>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {}
}

// const mapDispatchToProps = dispatch =>
//   bindActionCreators(actionCreators, dispatch)

function About(props) {
  return <Main render={mainProps => <AboutInner {...mainProps} {...props} />} />
}

export default connect(mapStateToProps)(About)
