const supertest = require('supertest')
const server = require('./server')
const db = require('../database/dbConfig')

describe('server.js', () => {

    it('POST /', () => {
        return supertest(server)
            .post('/api/auth/login')
            .send({ username: 'sentinel', password: 'qwerty' })
            .then(res => {
                expect(res.status).toBe(200)
            })
    })
})