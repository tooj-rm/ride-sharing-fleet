import { DriverRepository, RideRepository } from '~/domain/repositories';
import { Location } from '~/domain/vo';
import { EventPublisher } from '~/domain/events';
import { DriverNotFound, RideNotFound } from '~/domain/exceptions';

type AcceptRideInput = {
  driverId: string;
  rideId: string;
  pickupLocation: Location;
  driverLocation: Location;
};

export class AcceptRideUseCase {
  constructor(
    private readonly driverRepository: DriverRepository,
    private readonly rideRepository: RideRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({
    driverId,
    driverLocation,
    pickupLocation,
    rideId,
  }: AcceptRideInput) {
    const driver = await this.driverRepository.findById(driverId);
    const ride = await this.rideRepository.findById(rideId);
    if (!driver) {
      throw new DriverNotFound();
    }
    if (!ride) {
      throw new RideNotFound();
    }

    driver.acceptRide(rideId, pickupLocation, driverLocation);
    ride.accept(driverId);

    await this.rideRepository.save(ride);
    await this.driverRepository.save(driver);

    await this.eventPublisher.publish(driver.releaseEvents());
    await this.eventPublisher.publish(ride.releaseEvents());

    return driver;
  }
}
