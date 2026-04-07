import { DriverRepository, RideRepository } from '~/domain/repositories';
import { Location } from '~/domain/entities';

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
      throw new Error('Driver not found');
    }
    if (!ride) {
      throw new Error('Ride not found');
    }

    driver.acceptRide(rideId, pickupLocation, driverLocation);
    ride.accept(driverId);

    await this.rideRepository.save(ride);
    await this.driverRepository.save(driver);

    return driver;
  }
}
