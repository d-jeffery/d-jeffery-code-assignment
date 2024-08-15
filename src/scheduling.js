const uuid = require('uuid');

class Scheduling {
  constructor() {
    this.providers = new Map();
    this.clients = new Map();
    this.unconfirmedAppointments = new Map();
  }

  // TODO: dont register if already exists
  registerProvider(provider) {
    console.log(`Registering provider: ${provider.name}`);
    this.providers.set(provider.name, provider);
  }

  submitTimes(provider, startTime, endTime) {
    console.log(`Registering provider: ${provider}, for ${startTime} - ${endTime}`);

    if (!this.providers.has(provider)) {
      throw new Error(`Provider ${provider} does not exist`);
    }

    this.providers.get(provider)
        .addAppointments(startTime, endTime);
  }

  getTimes(provider) {
    console.log(`Getting ${provider} appointment times`);
    if (!this.providers.has(provider)) {
      throw new Error(`Provider ${provider} does not exist`);
    }

    return this.providers.get(provider).getAppointments();
  }

  // TODO: dont register if already exists
  registerClient(client) {
    console.log(`Registering client: ${client.name}`);
    this.clients.set(client.name, client);
  }

  registerBooking(client, provider, slot) {
    console.log(`Registering booking for ${client}, with ${provider} for ${slot}`);

    if (!this.clients.has(client)) {
      throw new Error(`Provider ${client} does not exist`);
    }

    if (!this.providers.has(provider)) {
      throw new Error(`Provider ${provider} does not exist`);
    }

    if (!this.providers.get(provider).getAppointments().some(app => app === slot)) {
      throw new Error(`Slot ${slot} unavailable`);
    }

    const token = uuid.v4();
    this.unconfirmedAppointments.set(token, { client, provider, slot });
    return token;
  }

  confirmBooking(token) {
    if (!this.unconfirmedAppointments.has(token)) {
      throw new Error(`No appointment found for ${token}`);
    }

    console.log(`Confirming booking for ${token}`);

    const appointment = this.unconfirmedAppointments.get(token);

    if (!this.clients.has(appointment.client)) {
      throw new Error(`Provider ${appointment.client} does not exist`);
    }

    if (!this.providers.has(appointment.provider)) {
      throw new Error(`Provider ${appointment.provider} does not exist`);
    }

    this.clients.get(appointment.client)
      .addBooking({ slot: appointment.slot, provider: appointment.provider });
    this.providers.get(appointment.provider)
      .bookAppointment(appointment.slot);
    this.unconfirmedAppointments.delete(token);
  }

  // cancelBooking(token) {
  //   console.log(`Cancelling booking for ${token}`);
  //   this.unconfirmedAppointments.delete(token);
  // }
}

module.exports = { Scheduling };
