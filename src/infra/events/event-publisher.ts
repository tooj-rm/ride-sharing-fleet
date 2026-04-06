import { DomainEvent } from '~/domain/events';

export interface EventPublisher {
  publish(events: DomainEvent[]): Promise<void>;
}
