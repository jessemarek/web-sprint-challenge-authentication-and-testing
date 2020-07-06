module.exports = {
    jwt_key: process.env.JWT_KEY || 'development secret!',
    hash_salt: process.env.HASH_ROUNDS || 8
}