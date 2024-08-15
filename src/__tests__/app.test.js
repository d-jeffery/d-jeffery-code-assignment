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
            .post('/client/register')
            .send({name: "Mr John"})
            .set('Accept', 'application/json')
            .expect(201);
    });

    it('POST /provider/times should create new time slots', async () => {

        await request(app)
            .post('/provider/times')
            .send({
                provider: "Dr Jones",
                startTime: 1723680000000,
                endTime: 1723682700000,
            })
            .set('Accept', 'application/json')
            .expect(201);

        const result = await request(app)
            .post('/appointment/list/')
            .send({provider: "Dr Jones"})
            .set('Accept', 'application/json')
            .expect(200);

        expect(result.body).toMatchSnapshot();
    });

    it('POST /appointment/list should an array of times for a given provider', async () => {

        await request(app)
            .post('/provider/times')
            .send({
                provider: "Dr Jones",
                startTime: 1723680000000,
                endTime: 1723682700000,
            })
            .set('Accept', 'application/json')
            .expect(201);

        const result = await request(app)
            .post('/appointment/list/')
            .send({provider: "Dr Jones"})
            .set('Accept', 'application/json')
            .expect(200);

        expect(result.body).toMatchSnapshot();
    });

    it('POST /provider/reserve should create new time slots', async () => {

        await request(app)
            .post('/provider/times')
            .send({
                provider: "Dr Jones",
                startTime: 1723680000000,
                endTime: 1723682700000,
            })
            .set('Accept', 'application/json')
            .expect(201);

        const result = await request(app)
            .post('/appointment/reserve')
            .send({
                client: "Mr John",
                provider: "Dr Jones",
                slot: 1723680000000
            })
            .set('Accept', 'application/json')
            .expect(200);

        expect(result.body.token).not.toBeNull()

        await request(app)
            .post('/appointment/confirm')
            .send({token: result.body.token})
            .set('Accept', 'application/json')
            .expect(201);
    });
});