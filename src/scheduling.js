const uuid = require('uuid');

class Scheduling {
  constructor() {
    this.providers = new Map();
    this.clients = new Map();
    this.unconfirmedAppointments = new Map();
  }

  registerProvider(provider) {
    console.log(`Registering provider: ${provider.name}`);

    if (this.providers.has(provider.name)) {
      throw new Error(`Provider ${provider.name} already exists`);
    }

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

  registerClient(client) {
    console.log(`Registering client: ${client.name}`);

    if (this.clients.has(client.name)) {
      throw new Error(`Client ${client.name} already exists`);
    }

    this.clients.set(client.name, client);
  }

  registerBooking(client, provider, slot) {
    console.log(`Registering booking for ${client}, with ${provider} for ${slot}`);

    if (!this.clients.has(client)) {
      throw new Error(`Client ${client} does not exist`);
    }

    if (!this.providers.has(provider)) {
      throw new Error(`Provider ${provider} does not exist`);
    }

    if (!this.providers.get(provider).getAppointments().some((app) => app === slot)) {
      throw new Error(`Slot ${slot} unavailable`);
    }

    const token = uuid.v4();
    this.unconfirmedAppointments.set(token, { client, provider, slot });
    this.providers.get(provider).bookAppointment(slot);

    // Expire booking if we dont get confirmation
    setTimeout(() => {
      if (this.unconfirmedAppointments.has(token)) {
        this.cancelBooking(token, provider, slot);
      }
    }, 30 * 60 * 1000, token, provider, slot);

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
    this.unconfirmedAppointments.delete(token);
  }

  cancelBooking(token, provider, slot) {
    console.log(`${token} booking has expired for ${provider} at ${slot}`);
    this.unconfirmedAppointments.delete(token);
    this.providers.get(provider).releaseAppointment(slot);
  }
}

module.exports = { Scheduling };
