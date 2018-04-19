import { injectGlobal } from 'styled-components'
//
import './fonts.css'
import theme from './theme'

injectGlobal`
  body {
    font-family: 'Roboto', Helvetica Neue, sans-serif;
    font-weight: 400;
    font-size: 14px;
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: rgb(${theme.colors.tealDark});
  }
`
