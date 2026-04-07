import { RideRepository } from '~/domain/repositories';
import { Ride } from '~/domain/entities';
import { Location } from '~/domain/vo';
import { EventPublisher } from '~/domain/events';

export class RequestRideUseCase {
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({
    dropOfLocation,
    pickupLocation,
    rideId,
    riderId,
  }: RequestRideInput) {
    const ride = Ride.request(rideId, riderId, pickupLocation, dropOfLocation);

    await this.rideRepository.save(ride);
    await this.eventPublisher.publish(ride.releaseEvents());
    return ride;
  }
}

type RequestRideInput = {
  rideId: string;
  riderId: string;
  pickupLocation: Location;
  dropOfLocation: Location;
};
