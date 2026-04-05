import { DriverRepository } from '~/domain/repositories';

type CompleteRideInput = {
  driverId: string;
  rideId: string;
  fareAmount: number;
};

export class CompleteRideUseCase {
  constructor(private readonly driverRepository: DriverRepository) {}

  async execute({ driverId, fareAmount }: CompleteRideInput) {
    const driver = await this.driverRepository.findById(driverId);
    if (!driver) {
      throw new Error('Driver not found');
    }

    driver.completeRide(fareAmount);
    await this.driverRepository.save(driver);
    return driver;
  }
}
