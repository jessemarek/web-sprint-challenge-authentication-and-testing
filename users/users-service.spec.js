const { isValid } = require('./users-service')

describe('testing the user validation function', () => {

    it('should reject req.body with no password', () => {

        const user = {
            username: 'ultrAhax'
        }
        expect(isValid(user)).toBeFalsy()
    })

    it('should accept req.body with all required fields', () => {

        const user = {
            username: 'ultrAhax',
            password: 'qwerty'
        }
        expect(isValid(user)).toBeTruthy()
    })
})