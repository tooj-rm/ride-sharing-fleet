import { DomainEvent } from '~/domain/events';

export abstract class Entity {
  private _events: DomainEvent[] = [];

  protected constructor(public readonly id: string) {}

  protected emitEvent(event: DomainEvent) {
    this._events.push(event);
  }

  releaseEvents() {
    const events = this._events;
    this._events = [];
    return events;
  }
}
