import { describe, it, expect, beforeEach } from 'vitest';
import { mock, MockProxy } from 'vitest-mock-extended';
import { RideRepository } from '~/domain/repositories';
import { RequestRideUseCase } from '~/application/usecases';
import { Location } from '~/domain/vo';
import { EventPublisher } from '~/domain/events';

describe('RequestRideUseCase', () => {
  let useCase: RequestRideUseCase;
  let rideRepository: MockProxy<RideRepository>;
  let eventPublisher: MockProxy<EventPublisher>;

  beforeEach(() => {
    rideRepository = mock<RideRepository>();
    eventPublisher = mock<EventPublisher>();
    useCase = new RequestRideUseCase(rideRepository, eventPublisher);
  });

  it('should save a requested ride', async () => {
    const ride = await useCase.execute({
      rideId: 'ride123',
      riderId: 'rider123',
      pickupLocation: Location.at(0, 0),
      dropOfLocation: Location.at(0.01, 0),
    });

    expect(rideRepository.save).toHaveBeenCalledWith(ride);
    expect(ride.status).toBe('requested');
  });
});
