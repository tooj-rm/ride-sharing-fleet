import {
  DriverAcceptedRide,
  DriverCompletedRide,
  RideAccepted,
  RideCancelled,
  RideCompleted,
  RideRequested,
  RideStarted,
} from '~/domain/events';

export interface BaseEvent {
  eventId: string;
  occurredAt: Date;
  aggregateId: string;
}

export type DomainEvent =
  | DriverAcceptedRide
  | DriverCompletedRide
  | RideRequested
  | RideAccepted
  | RideStarted
  | RideCancelled
  | RideCompleted;
