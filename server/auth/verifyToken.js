var jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config({ path: '../.env' })

const { CLIENT_SECRET } = dotenv.parsed

function verifyToken(req, res, next) {
  var token = req.headers['x-access-token']
  if (!token)
    return res
      .status(204)
      .send({ auth: false, message: 'No access_token provided' })
  jwt.verify(token, CLIENT_SECRET, function(err, decoded) {
    if (err)
      return res
        .status(500)
        .send({ auth: false, message: 'Failed to authenticate token.' })
    // if everything good, save to request for use in other routes
    req.userId = decoded.id
    next()
  })
}

module.exports = verifyToken
