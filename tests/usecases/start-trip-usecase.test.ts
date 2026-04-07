import { beforeEach, describe, expect, it } from 'vitest';
import { mock, MockProxy } from 'vitest-mock-extended';
import { DriverRepository, RideRepository } from '~/domain/repositories';
import { StartTripUseCase } from '~/application/usecases';
import { Location } from '~/domain/vo';
import { Ride } from '~/domain/entities';
import { EventPublisher } from '~/domain/events';

describe('StartTripUseCase', () => {
  let useCase: StartTripUseCase;
  let driverRepository: MockProxy<DriverRepository>;
  let rideRepository: MockProxy<RideRepository>;

  beforeEach(() => {
    driverRepository = mock<DriverRepository>();
    rideRepository = mock<RideRepository>();
    const eventPublisher = mock<EventPublisher>();
    useCase = new StartTripUseCase(
      driverRepository,
      rideRepository,
      eventPublisher,
    );
  });

  it('should throw an error when driver not found', async () => {
    rideRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('ride123', 'driver123')).rejects.toThrow(
      'Ride not found',
    );

    expect(driverRepository.save).not.toHaveBeenCalled();
  });

  it('should throw an error when driver does not correspond to ride', async () => {
    const ride = Ride.request(
      'ride123',
      'rider123',
      Location.at(0, 0),
      Location.at(0.01, 0),
    );
    rideRepository.findById.mockResolvedValue(ride);

    await expect(useCase.execute('ride123', 'driver123')).rejects.toThrow(
      'This driver is not assigned to this ride',
    );

    expect(driverRepository.save).not.toHaveBeenCalled();
  });

  it('should start a ride successfully', async () => {
    const ride = Ride.request(
      'ride123',
      'rider123',
      Location.at(0, 0),
      Location.at(0.01, 0),
    );
    ride.accept('driver123');
    rideRepository.findById.mockResolvedValue(ride);

    await useCase.execute('ride123', 'driver123');

    expect(rideRepository.save).toHaveBeenCalledWith(ride);
    expect(ride.status).toBe('in-progress');
  });
});
