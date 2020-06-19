const supertest = require('supertest')
const server = require('./server')
const db = require('../database/dbConfig')
const { expectCt } = require('helmet')

describe('server.js', () => {

    /* it('GET /', () => {
        return supertest(server)
            .get('/')
            .then(res => {
                expect(res.status).toBe(200)
            })
    }) */
})