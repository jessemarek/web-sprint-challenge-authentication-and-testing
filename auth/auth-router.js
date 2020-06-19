const router = require('express').Router();
const Users = require('../users/users-model')

const bcrypt = require('bcryptjs')
const salt = require('../config/constants').hash_salt

const { isValid, generateToken } = require('../users/users-service')

router.post('/register', (req, res) => {
  // implement registration
  const credentials = req.body

  if (credentials.username && credentials.password) {
    const hash = bcrypt.hashSync(credentials.password, salt)

    credentials.password = hash

    Users.add(credentials)
      .then(user => {
        res.status(201).json(user)
      })
      .catch(error => {
        res.status(500).json({ message: error.message })
      })
  }
  else {
    res.status(400).json({ message: 'please provide username and password' })
  }
});

router.post('/login', (req, res) => {
  // implement login
  const { username, password } = req.body

  if (isValid(req.body)) {
    console.log(req.body)
    Users.findBy({ username })
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          const token = generateToken(user)

          res.status(200).json({ token, message: `${username} is logged in!` })
        }
        else {
          res.status(401).json({ message: 'invalid credentials' })
        }
      })
  }
  else {
    res.status(400).json({ message: 'please provide login credentials' })
  }
});

module.exports = router;
