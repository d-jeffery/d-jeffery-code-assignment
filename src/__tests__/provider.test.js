const { Provider } = require('../provider');

describe('Provider', () => {
  test('create with name', () => {
    const provider = new Provider('Dr Jones');

    expect(provider.name).toBe('Dr Jones');
  });

  test('invalid range should throw', () => {
    const provider = new Provider('Dr Jones');

    // startTime > endTime
    const startTime = Date.now() - (60 * 60 * 1000);
    const endTime = Date.now();
    try {
      provider.addAppointments(startTime, endTime);
    } catch (err) {
      expect(err).toBe('Invalid time range');
    }
  });

  test('empty range should have 0 appointments', () => {
    const provider = new Provider('Dr Jones');

    // Range is empty
    const startTime = Date.now();
    provider.addAppointments(startTime, startTime);

    expect(provider.appointments.size).toBe(0);
  });

  test('getAppointments should return consistent times for a given range', () => {
    const provider = new Provider('Dr Jones');

    const startTime = new Date(1723680000000).getTime();
    // Add 4 hours to start time
    const endTime = new Date(1723680000000 + (4 * 60 * 60 * 1000));

    provider.addAppointments(startTime, endTime);

    expect(provider.appointments.size).toBe(16);
    expect(provider.getAppointments()).toMatchSnapshot();
  });

  test('bookAppointments should set confirmed to true', () => {
    const provider = new Provider('Dr Jones');

    const startTime = new Date(1723680000000).getTime();
    // Add 4 hours to start time
    const endTime = new Date(1723680000000 + (60 * 60 * 1000));

    provider.addAppointments(startTime, endTime);

    provider.bookAppointment(startTime);

    expect(provider.appointments.size).toBe(4);
    expect(provider.getAppointments()).toMatchSnapshot();
  });
});
