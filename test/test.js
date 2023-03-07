;
const { expect } = require('chai');
const { app, getCountries } = require('../src/app');
const request = require('supertest')



describe("getCountries function", () => {
    it('should get the list of countries as an array', async () => {
        const countries = await getCountries();
        expect(countries.length).to.be.greaterThan(0)
        // Testing randomly if the array includes 2 countries
        expect(countries).to.include.deep.members(["Denmark", "Finland"])
    })
})

describe('POST /', () => {


    it('should save user data to the database if all fields are provided', done => {
        request(app)
            .post('/')
            .type('form')
            .send({
                name: 'John Doe',
                sex: 'male',
                age: 25,
                country: 'USA'
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.text).to.include('Application Complete');
                done();
            });
    });




});