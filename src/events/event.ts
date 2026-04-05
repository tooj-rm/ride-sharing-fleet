import { Location } from '~/entities';

export type DomainEvent = DriverAcceptedRide | DriverCompletedRide;

export interface Event {
  eventId: string;
  occurredAt: Date;
  aggregateId: string;
}

interface DriverAcceptedRide extends Event {
  type: 'DriverAcceptedRide';
  rideId: string;
  driverId: string;
  pickupLocation: Location;
  driverLocation: Location;
}

interface DriverCompletedRide extends Event {
  type: 'DriverCompletedRide';
  rideId: string;
  driverId: string;
  fareAmount: number;
  totalEarnings: number;
}
