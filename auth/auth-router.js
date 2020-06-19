const router = require('express').Router();
const Users = require('../users/users-model')

const bcrypt = require('bcryptjs')
const salt = process.env.HASH_ROUNDS || 8

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
});

module.exports = router;
