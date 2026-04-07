import {
  InMemoryDriverRepository,
  InMemoryRideRepository,
} from '~/infra/repositories/in-memory';
import { ConsoleEventPublisher } from '~/infra/events';

export class DIContainer {
  private readonly dependencies: Map<string, unknown>;

  constructor() {
    this.dependencies = new Map();
    this.#registerDependencies();
  }

  #registerDependencies() {
    // Repositories
    this.dependencies.set('driverRepository', new InMemoryDriverRepository());
    this.dependencies.set('rideRepository', new InMemoryRideRepository());

    // Infrastructure Services
    this.dependencies.set('eventPublisher', new ConsoleEventPublisher());
  }

  get(name: string) {
    const dependency = this.dependencies.get(name);
    if (!dependency) {
      throw new Error(`Dependency '${name}' not found`);
    }
    return dependency;
  }
}

export const container = new DIContainer();
