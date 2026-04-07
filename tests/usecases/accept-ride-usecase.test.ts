import { describe, it, expect, beforeEach } from 'vitest';
import { mock, MockProxy } from 'vitest-mock-extended';
import { DriverRepository, RideRepository } from '~/domain/repositories';
import { AcceptRideUseCase } from '~/application/usecases';
import { Driver, Ride } from '~/domain/entities';
import { Location } from '~/domain/vo';
import { EventPublisher } from '~/domain/events';

describe('AcceptRideUseCase', () => {
  let useCase: AcceptRideUseCase;
  let driverRepository: MockProxy<DriverRepository>;
  let rideRepository: MockProxy<RideRepository>;
  let eventPublisher: MockProxy<EventPublisher>;

  beforeEach(() => {
    driverRepository = mock<DriverRepository>();
    rideRepository = mock<RideRepository>();
    eventPublisher = mock<EventPublisher>();
    useCase = new AcceptRideUseCase(
      driverRepository,
      rideRepository,
      eventPublisher,
    );
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

  it('should throw an error when ride not found', async () => {
    driverRepository.findById.mockResolvedValue(expect.any(Driver));
    rideRepository.findById.mockResolvedValueOnce(null);

    await expect(
      useCase.execute({
        driverId: 'driver123',
        rideId: 'ride123',
        pickupLocation: Location.at(0, 0),
        driverLocation: Location.at(0.01, 0),
      }),
    ).rejects.toThrow('Ride not found');
  });

  it('should save driver and ride when driver accepts ride', async () => {
    const driver = Driver.register('driver123', 'John Doe');
    const ride = Ride.request(
      'ride123',
      'rider123',
      Location.at(0, 0),
      Location.at(0.01, 0),
    );
    driverRepository.findById.mockResolvedValue(driver);
    rideRepository.findById.mockResolvedValue(ride);

    await useCase.execute({
      driverId: 'driver123',
      rideId: 'ride123',
      pickupLocation: Location.at(0, 0),
      driverLocation: Location.at(0.01, 0),
    });

    expect(driverRepository.save).toHaveBeenCalledWith(driver);
    expect(rideRepository.save).toHaveBeenCalledWith(ride);

    expect(driver.status).toBe('on_trip');
    expect(ride.status).toBe('accepted');
  });

  it('should throw error if driver validation fails', async () => {
    const driver = Driver.register('driver123', 'John Doe');
    const ride = Ride.request(
      'ride123',
      'rider123',
      Location.at(0, 0),
      Location.at(0.01, 0),
    );
    driverRepository.findById.mockResolvedValue(driver);
    rideRepository.findById.mockResolvedValue(ride);

    await expect(
      useCase.execute({
        driverId: 'driver123',
        rideId: 'ride123',
        pickupLocation: Location.at(0, 0),
        driverLocation: Location.at(0.1, 0),
      }),
    ).rejects.toThrow('Driver is too far from pickup location');

    expect(driverRepository.save).not.toHaveBeenCalled();
    expect(rideRepository.save).not.toHaveBeenCalled();

    expect(driver.status).toBe('available');
    expect(ride.status).toBe('requested');
  });
});
