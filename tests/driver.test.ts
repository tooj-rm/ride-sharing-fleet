import { describe, expect, it } from 'vitest';
import { Driver } from '~/domain/entities';
import { Location } from '~/domain/vo';

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

  it('should emit event when driver accepts ride', () => {
    const driver = Driver.register('driver123', 'John Doe');

    driver.acceptRide('ride123', Location.at(0, 0), Location.at(0.01, 0));

    const events = driver.releaseEvents();
    expect(events).toHaveLength(2);
    expect(events[1].type).toBe('DriverAcceptedRide');
    expect(events[1].rideId).toBe('ride123');
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

  it('should emit event when driver accepts ride', () => {
    const driver = Driver.register('driver123', 'John Doe');

    driver.acceptRide('ride123', Location.at(0, 0), Location.at(0.01, 0));
    driver.releaseEvents();

    driver.completeRide(50);

    const events = driver.releaseEvents();
    expect(events).toHaveLength(1);
    expect(events[0].type).toBe('DriverCompletedRide');
    expect(events[0].rideId).toBe('ride123');
  });
});
