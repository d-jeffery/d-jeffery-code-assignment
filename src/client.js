class Client {
  constructor(name) {
    this.name = name;
    this.bookings = new Map();
  }

  addBooking({ slot, provider }) {
    this.bookings.set(slot, provider);
  }

  getBookings() {
    return this.bookings;
  }
}

module.exports = { Client };
