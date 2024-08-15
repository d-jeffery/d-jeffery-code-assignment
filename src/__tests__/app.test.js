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
            .post('/provider/register')
            .send({name: "Dr Peter"})
            .set('Accept', 'application/json')
            .expect(201)

        await request(app)
            .post('/provider/times')
            .send({
                provider: "Dr Peter",
                startTime: 1723680000000,
                endTime: 1723682700000,
            })
            .set('Accept', 'application/json')
            .expect(201);

        const result = await request(app)
            .post('/appointment/list/')
            .send({provider: "Dr Peter"})
            .set('Accept', 'application/json')
            .expect(200);

        expect(result.body).toMatchSnapshot();
    });

    it('POST /appointment/list should an array of times for a given provider', async () => {

        await request(app)
            .post('/provider/register')
            .send({name: "Dr Randle"})
            .set('Accept', 'application/json')
            .expect(201)

        await request(app)
            .post('/provider/times')
            .send({
                provider: "Dr Randle",
                startTime: 1723680000000,
                endTime: 1723682700000,
            })
            .set('Accept', 'application/json')
            .expect(201);

        const result = await request(app)
            .post('/appointment/list/')
            .send({provider: "Dr Randle"})
            .set('Accept', 'application/json')
            .expect(200);

        expect(result.body).toMatchSnapshot();
    });

    it('POST /provider/reserve should create new time slots', async () => {

        const startTime = Date.now() + 48 * 60 * 60 * 1000;
        const endTime = Date.now() + 60 * 60 * 60 * 1000;

        await request(app)
            .post('/client/register')
            .send({name: "Mr James"})
            .set('Accept', 'application/json')
            .expect(201);

        await request(app)
            .post('/provider/register')
            .send({name: "Dr Peterson"})
            .set('Accept', 'application/json')
            .expect(201);

        await request(app)
            .post('/provider/times')
            .send({
                provider: "Dr Peterson",
                startTime: startTime,
                endTime: endTime,
            })
            .set('Accept', 'application/json')
            .expect(201);

        const result = await request(app)
            .post('/appointment/reserve')
            .send({
                client: "Mr James",
                provider: "Dr Peterson",
                slot: startTime
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


    it('POST /provider/reserve should fail if not booked in time window', async () => {

        const startTime = Date.now();
        const endTime = Date.now() + 10 * 60 * 60 * 1000;

        await request(app)
            .post('/client/register')
            .send({name: "Mr Jim"})
            .set('Accept', 'application/json')
            .expect(201);

        await request(app)
            .post('/provider/register')
            .send({name: "Dr Daniel"})
            .set('Accept', 'application/json')
            .expect(201);

        await request(app)
            .post('/provider/times')
            .send({
                provider: "Dr Daniel",
                startTime: startTime,
                endTime: endTime,
            })
            .set('Accept', 'application/json')
            .expect(201);

        const result = await request(app)
            .post('/appointment/reserve')
            .send({
                client: "Mr Jim",
                provider: "Dr Daniel",
                slot: startTime
            })
            .set('Accept', 'application/json')
            .expect(400);

        expect(result.text).toEqual("{\"error\":\"Booking must be within 24hr time window\"}")
    });
});