# README

## Install

`npm install`

## Run

`npm run start`

## API

### Provider times

`POST /provider/times`

Takes following body example to create appointments for a given provider, and returns status 200 on success:

`{"doctor":"Dr John", "startTime": "2024-10-13 9:00 AM", "endTime": "2024-10-13 8:00 PM" }`

---

### Client List

`GET /client/list/:{provider's name}`

Returns a list of all available appointments for given provider name

---

### Client Reserve

`POST /client/reserve`

Takes following body example, and returns 200 on successful booking, along with confirmation code:

`{"doctor":"Dr John", "time": "2024-10-13 9:15 AM"}`

---

### Client Confirm

`POST /client/confirm`

Takes following body example, and returns 200 on successful booking of appointment with given code:

`{"code": "df898d87-3bb0-40f7-aa14-5b84466e6e6d"}`

---

## TODOs

- I didn't implement an identity for clients, only providers. This means all bookings only reference the providers name, with no mention of the client ID.
- IDs for providers/clients to avoid collision
- Would have liked to have leveraged docker, but ran out of time to invest in a better dev cycle
- Confirmation code should have been paired with client identity to ensure 1 client can't confirm the appointment of another
- Used custom time format - I think I could have saved some time had I just used nodejs's implementation