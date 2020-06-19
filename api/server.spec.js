const supertest = require('supertest')
const server = require('./server')
const db = require('../database/dbConfig')

describe('server.js', () => {
    //Truncate DB and seed with one user
    beforeAll(async () => {
        await db('users').truncate()

        await db('users').insert([
            {
                username: "ls2003",
                password: "plainText"
            }
        ])
    })

    //Test a user can be registered
    it('POST /api/auth/register', () => {
        return supertest(server)
            .post('/api/auth/register')
            .send({ username: 'sentinel', password: 'qwerty' })
            .then(res => {
                expect(res.status).toBe(201)
            })
    })

    it('POST /api/auth/register', () => {
        return supertest(server)
            .post('/api/auth/register')
            .send({ username: 'teh_hitman', password: 'oneshot' })
            .then(res => {
                expect(res.body.username).toBe('teh_hitman')
                expect(res.body.password).not.toBe('oneshot')
            })
    })

    //Test a user can log in and recieve a token
    it('POST /api/auth/login', () => {
        return supertest(server)
            .post('/api/auth/login')
            .send({ username: 'sentinel', password: 'qwerty' })
            .then(res => {
                expect(res.status).toBe(200)
            })
    })

    it('POST /api/auth/login', () => {
        return supertest(server)
            .post('/api/auth/login')
            .send({ username: 'teh_hitman', password: 'oneshot' })
            .then(res => {
                expect(res.body.token).not.toBeUndefined()
            })
    })

    //Test a user cannot access jokes unless they are logged in and token is sent to server
    it('GET /api/jokes', () => {
        return supertest(server)
            .get('/api/jokes')
            .then(res => {
                expect(res.status).toBe(401)
            })
    })

    it('GET /api/jokes', async () => {
        const res = await supertest(server)
            .post('/api/auth/login')
            .send({ username: 'teh_hitman', password: 'oneshot' })

        return supertest(server)
            .get('/api/jokes')
            .set({ Authorization: res.body.token })
            .then(res => {
                expect(res.status).toBe(200)
            })
    })

})