import { DomainException } from '~/domain/exceptions';

export class RideNotFound extends DomainException {
  constructor() {
    super('Ride not found', 'ride_not_found', 404);
  }
}

export class RideAlreadyAccepted extends DomainException {
  constructor() {
    super('Ride already accepted', 'ride_already_accepted', 422);
  }
}
