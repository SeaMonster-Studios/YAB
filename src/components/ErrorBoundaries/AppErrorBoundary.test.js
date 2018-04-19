import React from 'react'
import { Simulate, render } from 'react-testing-library'
//
import AppErrorBoundary from './AppErrorBoundary'

const originalEnv = process.env.NODE_ENV

beforeAll(() => {
  process.env.NODE_ENV = 'production'
})

afterAll(() => {
  process.env.NODE_ENV = originalEnv
})

describe('AppErrorBoundary Component Test', () => {
  it('Renders children when there is no app error', () => {
    const { container, child } = renderSetup()

    // make sure it renders
    expect(container).toMatchSnapshot()

    expect(child).toBeDefined()
  })

  it('Renders error message and report form when there is an error', async () => {
    /* eslint-disable-next-line no-console */
    console.error = () => undefined

    const { container, getByTestId, child } = renderSetup()

    expect(child).toBeDefined()

    try {
      Simulate.click(child)
    } catch (error) {
      swallowError()
    }

    expect(getByTestId('app-error-boundary-error')).toBeDefined()
    expect(getByTestId('app-error-boundary-report-form-wrapper')).toBeDefined()
    expect(container).toMatchSnapshot()
  })
})

const swallowError = () => null

function renderSetup(overrides) {
  class Child extends React.Component {
    state = {
      errorMe: false,
    }
    render() {
      return (
        <span
          data-testid="app-error-boundary-test-child"
          onClick={() =>
            this.setState(prevState => ({
              ...prevState,
              errorMe: true,
            }))
          }
        >
          {/* eslint-disable-next-line react/jsx-no-undef */}
          {this.state.errorMe ? <IDontExist /> : <span />}
        </span>
      )
    }
  }

  const wrapper = render(
    <AppErrorBoundary>
      <Child />
    </AppErrorBoundary>,
  )
  const child = wrapper.getByTestId('app-error-boundary-test-child')

  return {
    ...wrapper,
    child,
    ...overrides,
  }
}
