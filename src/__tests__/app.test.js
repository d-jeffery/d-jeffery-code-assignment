const app = require('../app.js');
const request = require('supertest');

describe('User Endpoints', () => {

    it('POST /provider/register should create a new provider', () => {
        return request(app)
            .post('/provider/register')
            .send({name: "Dr Jones"})
            .set('Accept', 'application/json')
            .expect(201);
    });

    it('POST /client/register should create a new client', () => {
        return request(app)
            .post('/provider/register')
            .send({name: "Mr John"})
            .set('Accept', 'application/json')
            .expect(201);
    });

    it('POST /provider/times should create new time slots', async () => {
        await request(app)
            .post('/provider/register')
            .send({name: "Dr Jones"})
            .set('Accept', 'application/json')
            .expect(201);

        await request(app)
            .post('/provider/times')
            .send({
                provider: "Dr Jones",
                startTime: 1723680000000,
                endTime: 1723682700000,
            })
            .set('Accept', 'application/json')
            .expect(201);
    });
});