import { RideRepository } from '~/domain/repositories';
import { Ride } from '~/domain/entities';
import { PrismaClient } from '~/infra/database/prisma/generated/client';

export class PrismaRideRepository implements RideRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(rideId: string): Promise<Ride | null> {
    const entity = await this.prisma.ride.findUnique({
      where: { id: rideId },
    });
    return entity
      ? Ride.hydrate(
          entity.id,
          entity.riderId,
          { lat: entity.pickupLat, lng: entity.pickupLng },
          { lat: entity.dropOfLat, lng: entity.dropOfLng },
          entity.status,
          entity.driverId,
        )
      : null;
  }

  async save(ride: Ride): Promise<void> {
    await this.prisma.ride.upsert({
      where: { id: ride.id },
      update: {
        status: ride.status,
        driverId: ride.driverId,
      },
      create: {
        id: ride.id,
        riderId: ride.riderId,
        pickupLat: ride.pickupLocation.latitude,
        pickupLng: ride.pickupLocation.longitude,
        dropOfLat: ride.dropOfLocation.latitude,
        dropOfLng: ride.dropOfLocation.longitude,
        status: ride.status,
        driverId: ride.driverId,
      },
    });
  }
}
