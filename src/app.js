const express = require('express');
const bodyParser = require('body-parser');

const { Scheduling } = require('./scheduling');
const { Client } = require('./client');
const { Provider } = require('./provider');

const app = express();

const scheduling = new Scheduling();

app.use(bodyParser.json());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(404).send('Not found');
});

// Register new client
app.post('/client/register', (req, res) => {
    const { name } = req.body;

    if (!name) {
        res.status(400).send({ error: 'Missing `name` in payload' });
        return;
    }

    scheduling.registerClient(new Client(name));

    res.sendStatus(201);
});

// Register new provider
app.post('/provider/register', (req, res) => {
    const { name } = req.body;

    if (!name) {
        res.status(400).send({ error: 'Missing `name` in payload' });
        return;
    }

    scheduling.registerProvider(new Provider(name));

    res.sendStatus(201);
});

// Schedule times for provider
app.post('/provider/times', (req, res) => {
    const { provider, startTime, endTime } = req.body;

    // Check we have the populated values
    if (!provider || !startTime || !endTime) {
        res.status(400).send({ error: 'Missing values in payload' });
        return;
    }

    // Create time slots
    scheduling.submitTimes(provider, startTime, endTime)

    res.sendStatus(201);
});

// Get a list of appointments for a given provider
app.post('/appointment/list', (req, res) => {
    const { provider } = req.body;

    // Check we have the populated values
    if (!provider) {
        res.status(400).send({ error: 'Missing provider in payload' });
        return;
    }

    // Return back UTC dates in human-readable array of times
    res.status(200).send({ appointments: scheduling.getTimes(provider) });
});

// Get a list of appointments for a given provider
app.post('/appointment/reserve', (req, res) => {
    const { client, provider, slot } = req.body;

    // Check we have the populated values
    if (!client || !provider || !slot) {
        res.status(400).send({ error: 'Missing values in payload' });
        return;
    }

    // Return back UTC dates in human-readable array of times
    res.status(200).send({ token: scheduling.registerBooking(client, provider, slot) });
});


module.exports = app