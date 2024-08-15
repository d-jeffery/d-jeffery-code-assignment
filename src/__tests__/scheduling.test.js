const { Scheduling } = require('../scheduling');
const { Client } = require('../client');
const { Provider } = require('../provider');

describe('Scheduling', () => {
  test('register provider', () => {
    const scheduling = new Scheduling();
    scheduling.registerProvider(new Provider('Dr Jones'));

    expect(scheduling).toMatchSnapshot();
  });

  test('register client', () => {
    const scheduling = new Scheduling();
    scheduling.registerClient(new Client('Mr Harrison'));

    expect(scheduling).toMatchSnapshot();
  });

  test('registerBooking', () => {
    const scheduling = new Scheduling();
    const provider = new Provider('Dr Jones');
    const client = new Client('Mr Harrison');

    scheduling.registerProvider(provider);
    scheduling.registerClient(client);

    provider.addAppointments(1723680000000, 1723680000000 + (60 * 60 * 1000));

    const token = scheduling.registerBooking(client, provider, 1723680000000);

    expect(scheduling.unconfirmedAppointments.get(token)).toMatchSnapshot();
  });

  test('confirmBooking', () => {
    const scheduling = new Scheduling();
    const provider = new Provider('Dr Jones');
    const client = new Client('Mr Harrison');

    scheduling.registerProvider(provider);
    scheduling.registerClient(client);

    provider.addAppointments(1723680000000, 1723680000000 + (60 * 60 * 1000));

    const token = scheduling.registerBooking(client, provider, 1723680000000);
    scheduling.confirmBooking(token);

    expect(scheduling.unconfirmedAppointments.size).toBe(0);
    expect(client.getBookings()).toMatchSnapshot();
    expect(provider.getAppointments()).toMatchSnapshot();
  });

    test('cancelBooking', () => {
        const scheduling = new Scheduling();
        const provider = new Provider('Dr Jones');
        const client = new Client('Mr Harrison');

        scheduling.registerProvider(provider);
        scheduling.registerClient(client);

        provider.addAppointments(1723680000000, 1723680000000 + (60 * 60 * 1000));

        const token = scheduling.registerBooking(client, provider, 1723680000000);
        scheduling.cancelBooking(token);

        expect(scheduling.unconfirmedAppointments.size).toBe(0);
        expect(client.getBookings()).toMatchSnapshot();
        expect(provider.getAppointments()).toMatchSnapshot();
    });
});
