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
        this.appointments.set(time, false);
      } else {
        console.warn(`Appointment at ${time} already created`);
      }

      appointmentTime += (15 * 60 * 1000);
    }
  }

  getAppointments() {
    return this.appointments;
  }

  bookAppointment(slot) {
    if (!this.appointments.has(slot)) {
      throw new Error(`No appointment with id ${slot}`);
    }

    this.appointments.set(slot, true);
  }
}

module.exports = { Provider };
