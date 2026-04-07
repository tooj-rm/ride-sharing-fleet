import { Location } from '~/domain/vo';
import { BaseEvent } from '~/domain/events';

export interface DriverAcceptedRide extends BaseEvent {
  type: 'DriverAcceptedRide';
  rideId: string;
  driverId: string;
  pickupLocation: Location;
  driverLocation: Location;
}

export interface DriverCompletedRide extends BaseEvent {
  type: 'DriverCompletedRide';
  rideId: string;
  driverId: string;
  fareAmount: number;
  totalEarnings: number;
}
