class Provider {
  constructor(name) {
    this.name = name;
    this.appointments = new Map();
  }

  addAppointments(startTime, endTime) {
    if (startTime > endTime) {
      throw new Error('Invalid time range');
    }

    // Calculate appointment times
    let appointmentTime = startTime;
    while (appointmentTime < endTime) {
      // Add appointment slots
      const time = new Date(appointmentTime).getTime();
      if (!this.appointments.has(time)) {
        // Time -> reserved
        this.appointments.set(time, false);
      } else {
        console.warn(`Appointment at ${time} already created`);
      }

      appointmentTime += (15 * 60 * 1000);
    }
  }

  getAppointments() {
    // Return appointments that aren't booked
    return Array.from(this.appointments.entries())
      .filter((appointment) => !appointment[1])
      .map((appointment) => appointment[0]);
  }

  bookAppointment(slot) {
    if (!this.appointments.has(slot)) {
      throw new Error(`No appointment with id ${slot}`);
    }

    if (this.appointments.get(slot)) {
      throw new Error(`${slot} has been reserved`);
    }

    console.log(`Booked ${slot} for ${this.name}`);

    this.appointments.set(slot, true);
  }

  releaseAppointment(slot) {
    if (!this.appointments.has(slot)) {
      throw new Error(`No appointment with id ${slot}`);
    }

    console.log(`Release ${slot} for ${this.name}`);

    this.appointments.set(slot, false);
  }
}

module.exports = { Provider };
