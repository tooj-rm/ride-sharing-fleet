import { describe, expect, it } from 'vitest';
import { Driver } from '~/entities/driver';
import { Location } from '~/entities/location';

describe('Driver', () => {
  it.each([
    ['', 'Jane Doe'],
    [' 1234 ', 'John Doe'],
    ['      ', 'John Doe'],
  ])('A driver cannot be created with an invalid driver ID', (id, name) => {
    expect(() => Driver.register(id, name)).toThrow(
      'Driver ID must be at least 5 characters',
    );
  });

  it.each([
    ['driver123', ''],
    ['driver123', 'J '],
    ['driver123', '  '],
  ])('A driver cannot be created with an invalid name', (id, name) => {
    expect(() => Driver.register(id, name)).toThrow(
      'Driver name must be at least 2 characters',
    );
  });

  it('should create a valid driver with correct initial state', () => {
    const driver = Driver.register('driver123', 'John Doe');

    expect(driver).toBeDefined();
    expect(driver.id).toBe('driver123');
    expect(driver.name).toBe('John Doe');
    expect(driver.status).toBe('available');
    expect(driver.earnings).toBe(0);
  });
});

describe('Driver accepts a ride', () => {
  it('driver is not available', () => {
    const rideId = 'ride123';
    const driver = Driver.register('driver123', 'John Doe');
    const pickupLocation = Location.at(0, 0);
    const driverLocation = Location.at(0.01, 0);

    driver.acceptRide(rideId, pickupLocation, driverLocation);
    expect(driver.status).toBe('on-trip');

    const anotherRideId = 'ride456';
    expect(() =>
      driver.acceptRide(anotherRideId, pickupLocation, driverLocation),
    ).toThrow('Driver is not available');
  });

  it('should accept ride when driver is within 5km of pickup', () => {
    const driver = Driver.register('driver123', 'John Doe');
    const driverLocation = Location.at(0, 0);
    const pickupLocation = Location.at(0.01, 0);

    driver.acceptRide('ride123', pickupLocation, driverLocation);

    expect(driver.status).toBe('on-trip');
  });

  it('should not accept ride when driver is more than 5km from pickup', () => {
    const driver = Driver.register('driver123', 'John Doe');
    const driverLocation = Location.at(0, 0);
    const pickupLocation = Location.at(0.1, 2);

    expect(() =>
      driver.acceptRide('ride123', pickupLocation, driverLocation),
    ).toThrow('Driver is too far from pickup location');
  });
});

describe('Driver completes a ride', () => {
  it('should update ride and update earnings', () => {
    const driver = Driver.register('driver123', 'John Doe');
    const driverLocation = Location.at(0, 0);
    const pickupLocation = Location.at(0.01, 0);
    const rideId = 'ride123';

    driver.acceptRide(rideId, pickupLocation, driverLocation);
    expect(driver.status).toBe('on-trip');
    expect(driver.earnings).toBe(0);

    driver.completeRide(50);
    expect(driver.status).toBe('available');
    expect(driver.earnings).toBe(50);
  });

  it('should not complete ride when driver is not on trip', () => {
    const driver = Driver.register('driver123', 'John Doe');

    expect(() => driver.completeRide(50)).toThrow('Driver is not on-trip');
  });

  it('should not complete ride with negative fare', () => {
    const driver = Driver.register('driver123', 'John Doe');
    const driverLocation = Location.at(0, 0);
    const pickupLocation = Location.at(0.01, 0);
    const rideId = 'ride123';

    driver.acceptRide(rideId, pickupLocation, driverLocation);

    expect(() => driver.completeRide(-50)).toThrow(
      'Fare amount must be positive',
    );
  });
});
