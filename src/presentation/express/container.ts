import { ConsoleEventPublisher } from '~/infra/events';
import { prisma } from '~/infra/database/prisma';
import {
  PrismaDriverRepository,
  PrismaRideRepository,
} from '~/infra/database/prisma/repositories';

export class DIContainer {
  private readonly dependencies: Map<string, unknown>;

  constructor() {
    this.dependencies = new Map();
    this.#registerDependencies();
  }

  #registerDependencies() {
    // Repositories
    this.dependencies.set(
      'driverRepository',
      new PrismaDriverRepository(prisma),
    );
    this.dependencies.set('rideRepository', new PrismaRideRepository(prisma));

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
