const supertest = require('supertest')
const server = require('./server')
const db = require('../database/dbConfig')

describe('server.js', () => {

    //Initial test to check that test suite is working
    it('server is running', () => {
        return supertest(server).get('/').then(res => {

            expect(res.body).toEqual({ api: 'is up and running!' })
        })
    })

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
    describe('POST /api/auth/register', () => {

        it('post is successful', () => {
            return supertest(server)
                .post('/api/auth/register')
                .send({ username: 'sentinel', password: 'qwerty' })
                .then(res => {
                    expect(res.status).toBe(201)
                })
        })

        it('post stores a hashed password', () => {
            return supertest(server)
                .post('/api/auth/register')
                .send({ username: 'teh_hitman', password: 'oneshot' })
                .then(res => {
                    expect(res.body.username).toBe('teh_hitman')
                    expect(res.body.password).not.toBe('oneshot')
                })
        })

        it('post fails if username already exists in db', () => {
            return supertest(server)
                .post('/api/auth/register')
                .send({ username: 'sentinel', password: 'qwerty' })
                .then(res => {
                    expect(res.status).toBe(500)
                })
        })

        it('post fails if req.body is missing required fields', () => {
            return supertest(server)
                .post('/api/auth/register')
                .send({ username: 'sentinel' })
                .then(res => {
                    expect(res.status).toBe(400)
                })
        })
    })

    //Test a user can log in and recieve a token
    describe('POST /api/auth/login', () => {

        it('login is successful', () => {
            return supertest(server)
                .post('/api/auth/login')
                .send({ username: 'sentinel', password: 'qwerty' })
                .then(res => {
                    expect(res.status).toBe(200)
                })
        })

        it('successful login returns a token', () => {
            return supertest(server)
                .post('/api/auth/login')
                .send({ username: 'teh_hitman', password: 'oneshot' })
                .then(res => {
                    expect(res.body.token).not.toBeUndefined()
                })
        })

        it('login fails if incorrect password is given', () => {
            return supertest(server)
                .post('/api/auth/login')
                .send({ username: 'sentinel', password: 'wrong' })
                .then(res => {
                    expect(res.status).toBe(401)
                })
        })

        it('login attempt is rejected if missing required fields', () => {
            return supertest(server)
                .post('/api/auth/login')
                .send({ username: 'sentinel' })
                .then(res => {
                    expect(res.status).toBe(400)
                })
        })
    })

    //Test a user cannot access jokes unless they are logged in and token is sent to server
    describe('GET /api/jokes', () => {

        it('cannot GET resources if not logged in', () => {
            return supertest(server)
                .get('/api/jokes')
                .then(res => {
                    expect(res.status).toBe(401)
                })
        })

        it('can GET the resources if logged in and token is sent', async () => {
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

        it('response should contain array of data', async () => {
            const res = await supertest(server)
                .post('/api/auth/login')
                .send({ username: 'teh_hitman', password: 'oneshot' })

            return supertest(server)
                .get('/api/jokes')
                .set({ Authorization: res.body.token })
                .then(res => {
                    expect(res.body).toEqual(expect.arrayContaining(res.body))
                })
        })

        it('request is rejected if the token has been altered', async () => {
            const token = 'client.altered.token'

            return supertest(server)
                .get('/api/jokes')
                .set({ Authorization: token })
                .then(res => {
                    expect(res.status).toBe(401)
                })
        })
    })

})