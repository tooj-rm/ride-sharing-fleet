import { Ride } from '~/domain/entities';

export class InMemoryRideRepository {
  private readonly _rides: Ride[] = [];

  findById(rideId: string): Promise<Ride | null> {
    return Promise.resolve(
      this._rides.find((ride) => ride.id === rideId) || null,
    );
  }

  save(ride: Ride): Promise<void> {
    this._rides.push(ride);
    return Promise.resolve();
  }
}
