const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const VerifyToken = require('./verifyToken')
const axios = require('axios')

const dotenv = require('dotenv').config({ path: '../.env' })

const { API_URL, CLIENT_SECRET } = dotenv.parsed

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.post('/register', (req, res) => {
  if (!req.body.password || !req.body.email)
    return res.status(500).send('Email address and password are both required.')

  const hashedPassword = bcrypt.hashSync(req.body.password, 8)

  axios
    .post(`${API_URL}/users`, {
      email: req.body.email,
      password: hashedPassword,
    })
    .then(({ data }) => {
      const token = jwt.sign({ id: data.id }, CLIENT_SECRET, {
        expiresIn: 86400, // expires in 24 hours
      })
      return res.status(200).send({ auth: true, token: token, id: data.id })
    })
    .catch(() => {
      return res.status(500).send('There was a problem registering the user.')
    })
})

router.get('/me', VerifyToken, (req, res) => {
  axios
    .get(`${API_URL}/users/${req.userId}`)
    .then(response => {
      return res.status(200).send(response.data)
    })
    .catch(() => {
      return res
        .status(500)
        .send('Verification could not be completed for this user.')
    })
})

router.post('/login', (req, res) => {
  axios
    .get(`${API_URL}/users/`)
    .then(response => {
      let user
      response.data.map(item => {
        if (item.email === req.body.email) user = item
        return
      })
      if (user && req.body.password) {
        const passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password,
        )
        if (!passwordIsValid)
          return res.status(401).send({ auth: false, token: null })

        const token = jwt.sign({ id: user.id }, CLIENT_SECRET, {
          expiresIn: 86400, // expires in 24 hours
        })
        return res.status(200).send({ auth: true, token: token, id: user.id })
      } else {
        return res.status(404).send('No user found.')
      }
    })
    .catch(() => {
      return res
        .status(500)
        .send('Error on server. Problem getting /auth/users for login.')
    })
})

router.get('/logout', (req, res) => {
  return res.status(200).send({ auth: false, token: null })
})

module.exports = router
