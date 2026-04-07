import { DriverRepository } from '~/domain/repositories';
import { Driver } from '~/domain/entities';
import { PrismaClient } from '~/infra/database/prisma/generated/client';

export class PrismaDriverRepository implements DriverRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Driver | null> {
    const entity = await this.prisma.driver.findUnique({
      where: { id },
    });
    return entity
      ? Driver.hydrate(
          entity.id,
          entity.name,
          entity.status,
          entity.currentRide,
        )
      : null;
  }

  async save(driver: Driver): Promise<void> {
    await this.prisma.driver.upsert({
      where: { id: driver.id },
      update: {
        status: driver.status,
        currentRide: driver.currentRide,
      },
      create: {
        id: driver.id,
        name: driver.name,
        status: driver.status,
      },
    });
  }
}
