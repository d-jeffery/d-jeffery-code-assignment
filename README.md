# README

## Install

`npm install`

## Run

`npm run start` or `docker compose up --build`

## Test

`npm test`

## API

### Provider Register

`POST /provider/register` creates a new provider

Body: `{"id": "Dr John"}`

---

### Provider times

`POST /provider/times` creates appointments 

Takes following body example to create appointments for a given provider and time range (in epoch). Returns status 201 on success:

Body: `{"provider":"Dr John", "startTime": "1723712400000", "endTime": "1723701600000" }`

---

### Client Register

`POST /provider/register` creates a new provider

Body: `{"id": "Mr Wayde"}`

---

### Appointment List

`POST /appointment/list`

Returns a list of all available appointments for given provider id

Body: `{"provider": "Dr John"}`

---

### Appointment Reserve

`POST /appointment/reserve`

Takes following body example, and returns 200 on successful booking, along with confirmation code:

Body: `{"provider": "Dr John", "client": "Person", "slot": 1724130900000}`

Returns a token, which is used to confirm the appointment.

---

### Appointment Confirm

`POST /appointment/confirm`

Takes following body example, and returns 200 on successful booking of appointment with given code:

Body: `{"token": "e66c0b09-b85a-44bd-8931-e3f13c116c35"}`

---

## Tradeoffs

- For providers and clients, they each are distinguished by a unique ID. I would have liked to populate this field automatically and used it for lookups. I left ID to be populated by the consumer of the API, allowing them to use the ID format of their choosing.
- Given the freeform id field, I made each API that required input be a POST call as not to have to read from the URL params. If IDs were not freeform, I would have used GETs where appropriate.
- Switched to use epoch times for simplicity - this way the system is the source of truth and the epoch time can be parsed by the caller into whatever format & timezone required
- Using a backing datastore would have been desirable, and could be setup in docker, but ran out of time to implement