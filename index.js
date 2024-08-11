const express = require('express');
const bodyParser = require('body-parser');

const { Appointments } = require('./appointments');

const app = express();
const port = process.env.PORT || 3000;

const bookings = new Appointments();

app.use(bodyParser.json());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

// Provide times (for providers)
// example body: {"doctor":"Dr John", "startTime": "2024-10-12 9:00 AM", "endTime": "2024-10-12 8:00 PM" }
app.post('/provider/times', (req, res) => {
  const { doctor, startTime, endTime } = req.body;

  // Check we have the populated values
  if (!doctor || !startTime || !endTime) {
    res.status(400).send({ error: 'Bad Request - missing values' });
    return;
  }
  // Record booking
  bookings.setTimes(doctor, startTime, endTime);
  res.sendStatus(200);
});

// Get slots (for clients)
app.get('/client/list/:doctor', (req, res) => {
  if (!req.params.doctor) {
    res.status(400).send({ error: 'Missing doctor parameter' });
    return;
  }
  // Check if doctor exits
  const { doctor } = req.params;
  if (!bookings.getTimes(doctor)) {
    res.status(400).send({ error: `Cannot find doctor ${doctor}` });
    return;
  }
  // Return back UTC dates in human-readable array of times
  res.status(200).send({ appointments: bookings.getTimes(doctor) });
});

// Reserve slot
// Appointments expire after 30 minutes of not being confirmed
// Must be 24 hours in advance
// example body: {"doctor":"Dr John", "time": "2024-10-12 9:00 AM" }
app.post('/client/reserve', (req, res) => {
  const { doctor, time } = req.body;

  // Check we have the populated values
  if (!doctor || !time) {
    res.status(400).send({ error: 'Bad Request - missing values' });
    return;
  }
  try {
    const code = bookings.bookTime(doctor, time);
    res.status(200).send({ code });
  } catch (err) {
    res.status(400).send({ error: `Bad Request: ${err.message}` });
  }
});

// Confirm reservation
app.post('/client/confirm', (req, res) => {
  const { code } = req.body;

  if (!code) {
    res.status(400).send({ error: 'Missing confirm code' });
    return;
  }

  try {
    bookings.confirmTime(code);
  } catch (err) {
    res.status(400).send({ error: `Bad Request: ${err.message}` });
    return;
  }

  res.sendStatus(200);
});

app.listen(port);
