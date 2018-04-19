import React from 'react'
//
import DashboardLayout from '../../layouts/Dashboard/Dashboard'

class DashboardInner extends React.Component {
  render() {
    return (
      <div>
        <h1>This is the App. You must be authenticated to be here.</h1>
      </div>
    )
  }
}

class Dashboard extends React.Component {
  render() {
    return (
      <DashboardLayout
        {...this.props}
        render={props => <DashboardInner {...props} />}
      />
    )
  }
}

export default Dashboard
