const path = require('path')
const express = require('express')
// const fs = require('fs')
// const https = require('https')
const app = express()
const port = 5000 //used in tests, don't change unless you change everywhere else as well
const proxy = require('express-http-proxy')
const authRouter = require('./auth/authRouter')
const dotenv = require('dotenv').config({ path: '../.env' })

const { API_URL } = dotenv.parsed
// const { API_URL, CLIENT_SECRET, HOME } = dotenv.parsed

app.use('/api', proxy(API_URL))
app.use('/auth', authRouter)

if (process.env.NODE_ENV !== 'development') {
  app.use(express.static(`${__dirname}/../dist/`))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(`${__dirname}/../dist/`, 'index.html'))
  })

  /* eslint-disable no-console */
  // app.listen(port, () => console.log(`Listening on port ${port}`))
  /* eslint-enable no-console */
}

// if (process.env.NODE_ENV === 'production') {
//   const passphrase = new Buffer(CLIENT_SECRET, 'base64')

//   https.createServer(
//     {
//       cert: fs.readFileSync(path.join(HOME, 'tls', 'server.crt')),
//       ca: [
//         fs.readFileSync(path.join(HOME, 'tls', 'ca.crt')),
//         fs.readFileSync(path.join(HOME, 'tls', 'rsa.crt')),
//         fs.readFileSync(path.join(HOME, 'tls', 'trust.crt')),
//       ],
//       key: fs.readFileSync(path.join(HOME, 'tls', 'server.key')),
//       passphrase: passphrase,
//     },
//     app,
//   )
// } else {
/* eslint-disable no-console */
app.listen(port, () => console.log(`Listening on port ${port}`))
/* eslint-enable no-console */
// }

module.exports = app
