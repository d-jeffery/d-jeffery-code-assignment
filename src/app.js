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

// Provide times for provider
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

module.exports = app