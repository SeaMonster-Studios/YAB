import React from 'react'
// import PropTypes from 'prop-types'
import { Link } from 'react-static'

class MarketingNav extends React.Component {
  static propTypes = {}

  render() {
    return (
      <nav>
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/about">About</Link>
      </nav>
    )
  }
}

export default MarketingNav
