import { describe, it, expect, beforeEach } from 'vitest';
import { mock, MockProxy } from 'vitest-mock-extended';
import { DriverRepository } from '~/domain/repositories';
import { AcceptRideUseCase } from '~/application/usecases';
import { Driver, Location } from '~/domain/entities';

describe('AcceptRideUseCase', () => {
  let useCase: AcceptRideUseCase;
  let driverRepository: MockProxy<DriverRepository>;

  beforeEach(() => {
    driverRepository = mock<DriverRepository>();
    useCase = new AcceptRideUseCase(driverRepository);
  });

  it('should throw error when driver not found', async () => {
    driverRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        driverId: 'driver123',
        rideId: 'ride123',
        pickupLocation: Location.at(0, 0),
        driverLocation: Location.at(0.01, 0),
      }),
    ).rejects.toThrow('Driver not found');

    expect(driverRepository.save).not.toHaveBeenCalled();
  });

  it('should accept a ride successfully', async () => {
    const driver = Driver.register('driver123', 'John Doe');
    driverRepository.findById.mockResolvedValue(driver);

    const pickupLocation = Location.at(0, 0);
    const driverLocation = Location.at(0.01, 0);

    await useCase.execute({
      driverId: 'driver123',
      rideId: 'ride123',
      pickupLocation,
      driverLocation,
    });

    expect(driverRepository.findById).toHaveBeenCalledWith('driver123');
    expect(driverRepository.save).toHaveBeenCalledTimes(1);
    expect(driver.status).toBe('on-trip');
  });

  it('should throw error when driver is not available', async () => {
    const pickupLocation = Location.at(0, 0);
    const driverLocation = Location.at(0.01, 0);
    const driver = Driver.register('driver123', 'John Doe');
    driver.acceptRide('ride123', pickupLocation, driverLocation);
    driverRepository.findById.mockResolvedValue(driver);

    await expect(
      useCase.execute({
        driverId: 'driver123',
        rideId: 'ride123',
        pickupLocation,
        driverLocation,
      }),
    ).rejects.toThrow('Driver is not available');

    expect(driverRepository.save).not.toHaveBeenCalled();
  });

  it('should throw error when driver is too far from pickup location', async () => {
    const pickupLocation = Location.at(0, 0);
    const driverLocation = Location.at(0.1, 0);
    const driver = Driver.register('driver123', 'John Doe');
    driverRepository.findById.mockResolvedValue(driver);

    await expect(
      useCase.execute({
        driverId: 'driver123',
        rideId: 'ride123',
        pickupLocation,
        driverLocation,
      }),
    ).rejects.toThrow('Driver is too far from pickup location');

    expect(driverRepository.save).not.toHaveBeenCalled();
  });
});
