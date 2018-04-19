/* globals process */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import Raven from 'raven-js'

const styles = {
  container: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    width: '100%',
    padding: 20,
    lineHeight: 1.5,
    fontSize: 16,
    backgroundColor: '#680000',
    color: '#fff',
    textAlign: 'center',
    fontWeight: 300,
    zIndex: 9999999999999999999999999999999999999999,
  },
  innerContainer: {
    maxWidth: 750,
    margin: '0 auto',
  },
  button: {
    textDecoration: 'underline',
    cursor: 'pointer',
    fontWeight: 300,
    color: '#fff',
    padding: 0,
    background: 'rgba(0,0,0,0)',
    border: 'none',
    fontSize: 16,
    lineHeight: 1.5,
  },
}

export default class AppErrorBoundary extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      hasError: false,
    }
  }

  componentDidCatch(error, info) {
    this.setState(() => {
      return {
        hasError: true,
      }
    })

    if (
      process.env.NODE_ENV !== 'development' &&
      typeof document !== 'undefined'
    ) {
      // Raven.captureException(error, { extra: info })
    } else {
      console.error(
        'Error caught in Error AppErrorBoundary. This will reported to Sentry when not in development.',
      )
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container} data-testid="app-error-boundary-error">
          <div style={styles.innerContainer}>
            <p>Sorry, something went wrong.</p>
            <ReportForm />
            <p>
              You can try reloading the page, or using the menu if it is
              available.
            </p>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

const ReportForm = () =>
  process.env.NODE_ENV !== 'development' && typeof document !== 'undefined' ? (
    <Form />
  ) : (
    <span />
  )

const Form = () => (
  <p data-testid="app-error-boundary-report-form-wrapper">
    This error has been reported to our development team, but{' '}
    <button
      // onClick={() => Raven.lastEventId() && Raven.showReportDialog()}
      style={styles.button}
    >
      click here to fill out a report.
    </button>
  </p>
)
