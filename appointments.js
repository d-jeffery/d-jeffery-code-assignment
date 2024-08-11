const date = require('date-and-time');
const uuid = require('uuid');

const timeFormat = 'YYYY-MM-DD h:mm A';

class Appointments {
  constructor() {
    this.times = new Map();
    this.bookings = new Map();
  }

  getTimes(doctor) {
    if (!this.times.get(doctor)) {
      return [];
    }

    // Convert the stored format back to human-readable
    return Array.from(this.times.get(doctor)).map((v) => date.format(new Date(v), timeFormat));
  }

  // Given a doctor, start and end times - create slots for every 15 minutes.
  // Using a set her to prevent adding duplicate spots
  setTimes(doctor, startTime, endTime) {
    if (!this.times.get(doctor)) {
      this.times.set(doctor, new Set());
    }

    // Parse Time
    const startDate = date.parse(startTime, timeFormat);
    const endDate = date.parse(endTime, timeFormat);

    // Calculate appointment times
    const appointmentTime = startDate;
    while (appointmentTime < endDate) {
      // Add appointment slots
      this.times.get(doctor).add(new Date(appointmentTime).getTime());
      appointmentTime.setMinutes(appointmentTime.getMinutes() + 15);
    }
    console.log("Appointments created")
  }

  bookTime(doctor, time) {
    if (!this.times.get(doctor)) {
      this.times.set(doctor, new Set());
    }

    const bookedTime = new Date(date.parse(time, timeFormat)).getTime();

    // TODO: Also should make sure times cannot be created in the past
    if (bookedTime - new Date() < 24 * 60 * 60 * 1000) {
      throw new Error('Not within 24hrs');
    }

    const code = uuid.v4();

    if (this.times.get(doctor).has(bookedTime)) {
      this.times.get(doctor).delete(bookedTime);
      this.bookings.set(code, { doctor, bookedTime, confirmed: false });

      // Expire booking if we dont get confirmation
      setTimeout(() => {
        if (!this.bookings.get(code).confirmed) {
          const appointmentTime = this.bookings.get(code).bookedTime;
          this.bookings.delete(code);
          this.times.get(doctor).add(appointmentTime);
          console.log(`${code} booking has expired`);
        }
      }, 30 * 60 * 1000);

      return code;
    }
    throw new Error('Time not available');
  }

  // Given a booking code, set booking to complete
  confirmTime(code) {
    if (!this.bookings.get(code)) {
      throw new Error('Code not valid');
    }

    const booking = this.bookings.get(code);

    booking.confirmed = true;
    this.bookings.set(code, booking);
    console.log(`${code} booking is confirmed`)
  }
}

module.exports = { Appointments };
