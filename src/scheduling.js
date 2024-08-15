const uuid = require('uuid');

class Scheduling {
  constructor() {
    this.providers = [];
    this.clients = [];
    this.unconfirmedAppointments = new Map();
  }

  // TODO: dont register if already exists
  registerProvider(provider) {
    console.log(`Registering provider: ${provider.name}`);
    this.providers.push(provider);
  }

  submitTimes(provider, startTime, endTime) {
    console.log(`Registering provider: ${provider}, for ${startTime} - ${endTime}`);
    this.providers.find(p => p.name === provider)
        .addAppointments(startTime, endTime);
  }

  // TODO: dont register if already exists
  registerClient(client) {
    console.log(`Registering client: ${client.name}`);
    this.clients.push(client);
  }

  registerBooking(client, provider, slot) {
    console.log(`Registering booking for ${client.name}, with ${provider.name} for ${slot}`);
    const token = uuid.v4();
    this.unconfirmedAppointments.set(token, { client: client.name, provider: provider.name, slot });
    return token;
  }

  confirmBooking(token) {
    if (!this.unconfirmedAppointments.has(token)) {
      throw new Error(`No appointment found for ${token}`);
    }

    console.log(`Confirming booking for ${token}`);

    const appointment = this.unconfirmedAppointments.get(token);
    // TODO: remove search
    this.clients.find((client) => client.name === appointment.client)
      .addBooking({ slot: appointment.slot, provider: appointment.provider });
    this.providers.find((provider) => provider.name === appointment.provider)
      .bookAppointment(appointment.slot);
    this.unconfirmedAppointments.delete(token);
  }

  cancelBooking(token) {
    console.log(`Cancelling booking for ${token}`);
    this.unconfirmedAppointments.delete(token);
  }
}

module.exports = { Scheduling };
