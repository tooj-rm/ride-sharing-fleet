import { Ride } from '~/domain/entities';

export interface RideRepository {
  findById(rideId: string): Promise<Ride | null>;
  save(ride: Ride): Promise<void>;
}
