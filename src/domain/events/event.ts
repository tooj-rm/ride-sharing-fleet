import { DriverAcceptedRide, DriverCompletedRide } from '~/domain/events';

export interface BaseEvent {
  eventId: string;
  occurredAt: Date;
  aggregateId: string;
}

export type DomainEvent = DriverAcceptedRide | DriverCompletedRide;
