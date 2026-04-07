import { describe, expect, it } from 'vitest';
import { Location, Ride } from '~/domain/entities';

describe('Ride', () => {
  it('should create a ride request with initial status', () => {
    const ride = Ride.request(
      'ride123',
      'rider123',
      Location.at(0, 0),
      Location.at(0.01, 0),
    );

    expect(ride).toBeDefined();
    expect(ride.status).toBe('requested');
    expect(ride.rideId).toBe('ride123');
    expect(ride.riderId).toBe('rider123');
    expect(ride.pickupLocation).toBeDefined();
    expect(ride.dropOfLocation).toBeDefined();

    const events = ride.releaseEvents();
    expect(events).toHaveLength(1);
    expect(events[0].type).toBe('RideRequested');
  });

  it('should accept a ride when driver accepts it', () => {
    const ride = Ride.request(
      'ride123',
      'rider123',
      Location.at(0, 0),
      Location.at(0.01, 0),
    );

    ride.accept('driver123');
    expect(ride.status).toBe('accepted');
    expect(ride.driverId).toBe('driver123');

    const events = ride.releaseEvents();
    expect(events).toHaveLength(2);
    expect(events[1].type).toBe('RideAccepted');
  });

  it('should not accept ride that is already accepted', () => {
    const ride = Ride.request(
      'ride123',
      'rider123',
      Location.at(0, 0),
      Location.at(0.01, 0),
    );

    ride.accept('driver123');

    expect(() => ride.accept('driver123')).toThrow('Ride already accepted');
  });

  it('should start ride when driver begins trip', () => {
    const ride = Ride.request(
      'ride123',
      'rider123',
      Location.at(0, 0),
      Location.at(0.01, 0),
    );

    ride.accept('driver123');
    ride.start();

    expect(ride.status).toBe('in-progress');
  });

  it('should cancel ride when rider cancels before acceptance', () => {
    const ride = Ride.request(
      'ride123',
      'rider123',
      Location.at(0, 0),
      Location.at(0.01, 0),
    );

    ride.cancel('driver');

    expect(ride.status).toBe('cancelled');
    expect(ride.cancelledBy).toBe('driver');
  });

  it('should not allow cancellation after ride starts', () => {
    const ride = Ride.request(
      'ride123',
      'rider123',
      Location.at(0, 0),
      Location.at(0.01, 0),
    );

    ride.accept('driver123');
    ride.start();

    expect(() => ride.cancel('rider')).toThrow(
      'Cannot cancel ride in progress',
    );
  });

  it('should complete a ride when driver completes it', () => {
    const ride = Ride.request(
      'ride123',
      'rider123',
      Location.at(0, 0),
      Location.at(0.01, 0),
    );

    ride.accept('driver123');
    ride.start();
    ride.complete();

    expect(ride.status).toBe('completed');

    const events = ride.releaseEvents();
    expect(events).toHaveLength(4);
    expect(events[3].type).toBe('RideCompleted');
  });

  it('should allow completion only if ride starts', () => {
    const ride = Ride.request(
      'ride123',
      'rider123',
      Location.at(0, 0),
      Location.at(0.01, 0),
    );

    ride.accept('driver123');

    expect(() => ride.complete()).toThrow(
      "Cannot complete ride if it's not started",
    );
  });
});
