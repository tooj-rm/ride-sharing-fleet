import { DriverRepository, RideRepository } from '~/domain/repositories';
import { EventPublisher } from '~/domain/events';
import { DriverNotAssignedToRide, RideNotFound } from '~/domain/exceptions';

export class StartTripUseCase {
  constructor(
    private readonly driverRepository: DriverRepository,
    private readonly rideRepository: RideRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(rideId: string, driverId: string) {
    const ride = await this.rideRepository.findById(rideId);
    if (!ride) {
      throw new RideNotFound();
    }

    if (ride.driverId !== driverId) {
      throw new DriverNotAssignedToRide();
    }

    ride.start();

    await this.rideRepository.save(ride);
    await this.eventPublisher.publish(ride.releaseEvents());
  }
}
