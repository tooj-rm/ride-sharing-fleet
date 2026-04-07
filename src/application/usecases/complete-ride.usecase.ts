import { DriverRepository, RideRepository } from '~/domain/repositories';
import { EventPublisher } from '~/domain/events';
import { DriverNotFound, RideNotFound } from '~/domain/exceptions';

type CompleteRideInput = {
  driverId: string;
  rideId: string;
  fareAmount: number;
};

export class CompleteRideUseCase {
  constructor(
    private readonly driverRepository: DriverRepository,
    private readonly rideRepository: RideRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ driverId, rideId, fareAmount }: CompleteRideInput) {
    const driver = await this.driverRepository.findById(driverId);
    const ride = await this.rideRepository.findById(rideId);

    if (!driver) {
      throw new DriverNotFound();
    }

    if (!ride) {
      throw new RideNotFound();
    }

    ride.complete();
    driver.completeRide(fareAmount);

    await this.driverRepository.save(driver);
    await this.eventPublisher.publish([
      ...ride.releaseEvents(),
      ...driver.releaseEvents(),
    ]);

    return driver;
  }
}
