import { DriverRepository } from '~/domain/repositories';
import { Location } from '~/domain/entities';

type AcceptRideInput = {
  driverId: string;
  rideId: string;
  pickupLocation: Location;
  driverLocation: Location;
};

export class AcceptRideUseCase {
  constructor(private readonly driverRepository: DriverRepository) {}

  async execute(param: AcceptRideInput) {
    const driver = await this.driverRepository.findById(param.driverId);
    if (!driver) {
      throw new Error('Driver not found');
    }

    driver.acceptRide(param.rideId, param.pickupLocation, param.driverLocation);
    await this.driverRepository.save(driver);
    return driver;
  }
}
