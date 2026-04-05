import { describe, it, expect, beforeEach } from 'vitest';
import { mock, MockProxy } from 'vitest-mock-extended';
import { DriverRepository } from '~/domain/repositories';
import { CompleteRideUseCase } from '~/application/usecases';
import { Driver, Location } from '~/domain/entities';

describe('CompleteRideUseCase', () => {
  let useCase: CompleteRideUseCase;
  let driverRepository: MockProxy<DriverRepository>;

  beforeEach(() => {
    driverRepository = mock<DriverRepository>();
    useCase = new CompleteRideUseCase(driverRepository);
  });

  it('should throw an error when driver not found', () => {
    driverRepository.findById.mockResolvedValue(null);

    expect(() =>
      useCase.execute({
        driverId: 'driver123',
        rideId: 'ride123',
        fareAmount: 50,
      }),
    ).rejects.toThrow('Driver not found');

    expect(driverRepository.save).not.toHaveBeenCalled();
  });

  it('should throw an error when driver is not on-trip', () => {
    const driver = Driver.register('driver123', 'John Doe');
    driverRepository.findById.mockResolvedValue(driver);

    expect(() =>
      useCase.execute({
        driverId: 'driver123',
        rideId: 'ride123',
        fareAmount: 50,
      }),
    ).rejects.toThrow('Driver is not on-trip');

    expect(driverRepository.save).not.toHaveBeenCalled();
  });

  it('should throw an error when fare amount is negative', () => {
    const driver = Driver.register('driver123', 'John Doe');
    driver.acceptRide('ride123', Location.at(0, 0), Location.at(0.01, 0));
    driverRepository.findById.mockResolvedValue(driver);

    expect(() =>
      useCase.execute({
        driverId: 'driver123',
        rideId: 'ride123',
        fareAmount: -50,
      }),
    ).rejects.toThrow('Fare amount must be positive');

    expect(driverRepository.save).not.toHaveBeenCalled();
  });

  it('should complete a ride successfully', async () => {
    const driver = Driver.register('driver123', 'John Doe');
    driver.acceptRide('ride123', Location.at(0, 0), Location.at(0.01, 0));
    driverRepository.findById.mockResolvedValue(driver);

    await useCase.execute({
      driverId: 'driver123',
      rideId: 'ride123',
      fareAmount: 50,
    });

    expect(driverRepository.findById).toHaveBeenCalledWith('driver123');
    expect(driverRepository.save).toHaveBeenCalledTimes(1);
    expect(driver.status).toBe('available');
    expect(driver.earnings).toBe(50);
  });
});
