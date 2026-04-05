import { Driver } from '~/domain/entities';
import { DriverRepository } from '~/domain/repositories';

export class InMemoryDriverRepository implements DriverRepository {
  private readonly drivers: Map<string, Driver> = new Map();

  async findById(id: string): Promise<Driver | null> {
    return this.drivers.get(id) || null;
  }

  async save(driver: Driver): Promise<void> {
    this.drivers.set(driver.id, driver);
  }
}
