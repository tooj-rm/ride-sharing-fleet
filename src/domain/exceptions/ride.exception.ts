import { DomainException } from '~/domain/exceptions';

export class RideNotFound extends DomainException {
  constructor() {
    super('Ride not found');
  }
}

export class RideAlreadyAccepted extends DomainException {
  constructor() {
    super('Ride already accepted');
  }
}
