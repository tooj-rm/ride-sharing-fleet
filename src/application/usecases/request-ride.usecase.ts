import { RideRepository } from '~/domain/repositories';
import { Location, Ride } from '~/domain/entities';

export class RequestRideUseCase {
  constructor(private readonly rideRepository: RideRepository) {}

  async execute({
    dropOfLocation,
    pickupLocation,
    rideId,
    riderId,
  }: RequestRideInput) {
    const ride = Ride.request(rideId, riderId, pickupLocation, dropOfLocation);

    await this.rideRepository.save(ride);
    return ride;
  }
}

type RequestRideInput = {
  rideId: string;
  riderId: string;
  pickupLocation: Location;
  dropOfLocation: Location;
};
