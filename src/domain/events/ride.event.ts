import { BaseEvent } from '~/domain/events/event';
import { Location } from '~/domain/vo';

export interface RideRequested extends BaseEvent {
  type: 'RideRequested';
  rideId: string;
  riderId: string;
  pickupLocation: Location;
  dropOfLocation: Location;
}

export interface RideAccepted extends BaseEvent {
  type: 'RideAccepted';
  rideId: string;
  riderId: string;
  pickupLocation: Location;
  dropOfLocation: Location;
}

export interface RideStarted extends BaseEvent {
  type: 'RideStarted';
  rideId: string;
  riderId: string;
  pickupLocation: Location;
  dropOfLocation: Location;
}

export interface RideCancelled extends BaseEvent {
  type: 'RideCancelled';
  rideId: string;
  riderId: string;
  pickupLocation: Location;
  dropOfLocation: Location;
}

export interface RideCompleted extends BaseEvent {
  type: 'RideCompleted';
  rideId: string;
  riderId: string;
  pickupLocation: Location;
  dropOfLocation: Location;
}
