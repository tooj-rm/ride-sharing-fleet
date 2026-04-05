import { Location } from '~/domain/entities';

export type DomainEvent = DriverAcceptedRide | DriverCompletedRide;

export interface BaseEvent {
  eventId: string;
  occurredAt: Date;
  aggregateId: string;
}

interface DriverAcceptedRide extends BaseEvent {
  type: 'DriverAcceptedRide';
  rideId: string;
  driverId: string;
  pickupLocation: Location;
  driverLocation: Location;
}

interface DriverCompletedRide extends BaseEvent {
  type: 'DriverCompletedRide';
  rideId: string;
  driverId: string;
  fareAmount: number;
  totalEarnings: number;
}
