const { Client } = require('../client');
const { Provider } = require('../provider');

describe('Client', () => {
  test('create with name', () => {
    const client = new Client('Mr Harrison');

    expect(client.name).toEqual('Mr Harrison');
  });

  test('empty bookings should have 0 entries', () => {
    const client = new Client('Mr Harrison');

    expect(client.bookings.size).toBe(0);
  });

  test('add booking should result in 1 entry', () => {
    const client = new Client('Mr Harrison');
    const provider = new Provider('Dr Jones');
    client.addBooking({ slot: new Date(1723680000000).getTime(), provider: 'Mr Harrison' });

    expect(client.bookings.size).toBe(1);
    expect(client.getBookings()).toMatchSnapshot();
  });
});
