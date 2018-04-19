import 'babel-polyfill'
import React, { Component } from 'react'
import { ServerStyleSheet } from 'styled-components'

export default {
  getSiteData: async () => ({
    title: 'YAB',
  }),
  getRoutes: async () => {
    return [
      {
        path: '/',
        component: 'src/views/Home/Home',
        getData: async () => ({
          routeDataGoesHere: true,
        }),
      },
      {
        path: '/about',
        component: 'src/views/About/About',
      },
      {
        path: '/dashboard',
        component: 'src/views/Dashboard/Dashboard',
      },
      {
        is404: true,
        component: 'src/views/404/404',
      },
    ]
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:5005/',
        pathRewrite: { '^/api': '' },
      },
      '/auth': `http://localhost:5000`,
    },
  },
  webpack: (config, { stage }) => {
    if (stage === 'prod') {
      config.entry = ['babel-polyfill', config.entry]
    } else if (stage === 'dev') {
      config.entry = ['babel-polyfill', ...config.entry]
    }
    config.module.rules.push({
      test: /\.jsx$/,
      exclude: /(node_modules)/,
      use: {
        loader: 'babel-loader',
      },
    })
    return config
  },
  renderToHtml: (render, Comp, meta) => {
    const sheet = new ServerStyleSheet()
    const html = render(sheet.collectStyles(<Comp />))
    meta.styleTags = sheet.getStyleElement()
    return html
  },
  Document: class CustomHtml extends Component {
    render() {
      const { Html, Head, Body, children, renderMeta } = this.props

      return (
        <Html>
          <Head>
            <meta charSet="UTF-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            {renderMeta.styleTags}
          </Head>
          <Body>{children}</Body>
        </Html>
      )
    }
  },
}
