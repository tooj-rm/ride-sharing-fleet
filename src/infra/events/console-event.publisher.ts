import { DomainEvent } from '~/domain/event';
import { EventPublisher } from '~/infra/events';

export class ConsoleEventPublisher implements EventPublisher {
  async publish(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      console.log(`[EVENT] ${event.type}:`, JSON.stringify(event, null, 2));
    }
  }
}
