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
  const { id } = req.body;

  if (!id) {
    res.status(400).send({ error: 'Missing `id` in payload' });
    return;
  }

  try {
    scheduling.registerClient(new Client(id));
  } catch (err) {
    res.status(400).send({ error: err.message });
    return;
  }

  res.sendStatus(201);
});

// Register new provider
app.post('/provider/register', (req, res) => {
  const { id } = req.body;

  if (!id) {
    res.status(400).send({ error: 'Missing `id` in payload' });
    return;
  }

  try {
    scheduling.registerProvider(new Provider(id));
  } catch (err) {
    res.status(400).send({ error: err.message });
    return;
  }

  res.sendStatus(201);
});

// Submit times for provider
app.post('/provider/times', (req, res) => {
  const { provider, startTime, endTime } = req.body;

  // Check we have the populated values
  if (!provider || !startTime || !endTime) {
    res.status(400).send({ error: 'Missing values in payload' });
    return;
  }

  try {
    scheduling.submitTimes(provider, startTime, endTime);
  } catch (err) {
    res.status(400).send({ error: err.message });
    return;
  }
  res.sendStatus(201);
});

// Get a list of appointments for a given provider
app.post('/appointment/list', (req, res) => {
  const { provider } = req.body;

  // Check we have the populated values
  if (!provider) {
    res.status(400).send({ error: 'Missing `provider` in payload' });
    return;
  }

  try {
    res.status(200).send({
      appointments: scheduling
        .getTimes(provider)
        .filter((appointment) => appointment - Date.now() < 24 * 60 * 60 * 1000),
    });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Book a valid slot for a given provider
app.post('/appointment/reserve', (req, res) => {
  const { client, provider, slot } = req.body;

  // Check we have the populated values
  if (!client || !provider || !slot) {
    res.status(400).send({ error: 'Missing values in payload' });
    return;
  }

  if (slot - Date.now() < 24 * 60 * 60 * 1000) {
    res.status(400).send({ error: 'Booking must be within 24hr time window' });
    return;
  }

  try {
    res.status(200).send({ token: scheduling.registerBooking(client, provider, slot) });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Confirm a booked appointment
app.post('/appointment/confirm', (req, res) => {
  const { token } = req.body;

  // Check we have the populated values
  if (!token) {
    res.status(400).send({ error: 'Missing `token` in payload' });
    return;
  }

  try {
    scheduling.confirmBooking(token);
  } catch (err) {
    res.status(400).send({ error: err.message });
    return;
  }

  res.sendStatus(201);
});

module.exports = app;
