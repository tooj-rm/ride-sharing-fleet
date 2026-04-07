import { describe, it, expect, beforeEach } from 'vitest';
import { mock, MockProxy } from 'vitest-mock-extended';
import { DriverRepository, RideRepository } from '~/domain/repositories';
import { CompleteRideUseCase } from '~/application/usecases';
import { Driver, Ride } from '~/domain/entities';
import { Location } from '~/domain/vo';
import { EventPublisher } from '~/domain/events';

describe('CompleteRideUseCase', () => {
  let useCase: CompleteRideUseCase;
  let driverRepository: MockProxy<DriverRepository>;
  let rideRepository: MockProxy<RideRepository>;
  let ride: Ride;
  let driver: Driver;

  beforeEach(() => {
    const eventPublisher = mock<EventPublisher>();

    driverRepository = mock<DriverRepository>();
    rideRepository = mock<RideRepository>();

    driver = Driver.register('driver123', 'John Doe');

    ride = Ride.request(
      'ride123',
      'rider123',
      Location.at(0, 0),
      Location.at(0.01, 0),
    );
    ride.accept('driver123');
    ride.start();

    useCase = new CompleteRideUseCase(
      driverRepository,
      rideRepository,
      eventPublisher,
    );
  });

  it('should throw an error when driver not found', async () => {
    driverRepository.findById.mockResolvedValue(null);

    await expect(() =>
      useCase.execute({
        driverId: 'driver123',
        rideId: 'ride123',
        fareAmount: 50,
      }),
    ).rejects.toThrow('Driver not found');

    expect(driverRepository.save).not.toHaveBeenCalled();
  });

  it('should throw an error when ride not found', async () => {
    driverRepository.findById.mockResolvedValue(expect.any(Driver));
    rideRepository.findById.mockResolvedValueOnce(null);

    await expect(() =>
      useCase.execute({
        driverId: 'driver123',
        rideId: 'ride123',
        fareAmount: 50,
      }),
    ).rejects.toThrow('Ride not found');

    expect(driverRepository.save).not.toHaveBeenCalled();
  });

  it('should throw an error when driver is not on-trip', async () => {
    driverRepository.findById.mockResolvedValue(driver);
    rideRepository.findById.mockResolvedValue(ride);

    await expect(() =>
      useCase.execute({
        driverId: 'driver123',
        rideId: 'ride123',
        fareAmount: 50,
      }),
    ).rejects.toThrow('Driver is not on-trip');

    expect(driverRepository.save).not.toHaveBeenCalled();
  });

  it('should throw an error when fare amount is negative', async () => {
    driver.acceptRide('ride123', Location.at(0, 0), Location.at(0.01, 0));

    driverRepository.findById.mockResolvedValue(driver);
    rideRepository.findById.mockResolvedValue(ride);

    await expect(() =>
      useCase.execute({
        driverId: 'driver123',
        rideId: 'ride123',
        fareAmount: -50,
      }),
    ).rejects.toThrow('Fare amount must be positive');

    expect(driverRepository.save).not.toHaveBeenCalled();
  });

  it('should complete a ride successfully', async () => {
    driver.acceptRide('ride123', Location.at(0, 0), Location.at(0.01, 0));
    driverRepository.findById.mockResolvedValue(driver);
    rideRepository.findById.mockResolvedValue(ride);

    await useCase.execute({
      driverId: 'driver123',
      rideId: 'ride123',
      fareAmount: 50,
    });

    expect(driverRepository.findById).toHaveBeenCalledWith('driver123');
    expect(driverRepository.save).toHaveBeenCalledTimes(1);
    expect(driver.status).toBe('available');
    expect(driver.earnings).toBe(50);
    expect(ride.status).toBe('completed');
  });
});
