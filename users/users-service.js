//JSON Web Token
const jwt = require('jsonwebtoken')
const jwtKey = require('../config/constants').jwt_key

module.exports = {
    isValid,
    generateToken
}

function isValid(user) {
    return Boolean(user.username && user.password)
}

function generateToken(user) {

    payload = {
        sub: user.id,
        username: user.username,
        department: user.department
    }

    options = {
        expiresIn: '1d'
    }

    return jwt.sign(payload, jwtKey, options)
}