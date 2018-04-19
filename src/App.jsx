import React from 'react'
import { Router } from 'react-static'
import Routes from 'react-static-routes'
import { Provider } from 'react-redux'
import store from './store'
import { ThemeProvider } from 'styled-components'
//
import AppErrorBoundary from './components/ErrorBoundaries/AppErrorBoundary'
import theme from './styles/theme'
import './styles/global'
import { checkForAuth } from './utils/auth/auth'

function App() {
  return (
    <AppErrorBoundary>
      <Provider store={store}>
        <Router onEnter={checkForAuth()}>
          <ThemeProvider theme={theme}>
            <div className="theme-wrapper">
              <Routes />
            </div>
          </ThemeProvider>
        </Router>
      </Provider>
    </AppErrorBoundary>
  )
}

export default App
