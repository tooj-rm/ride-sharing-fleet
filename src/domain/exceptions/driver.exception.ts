import { DomainException } from '~/domain/exceptions';

export class DriverNotFound extends DomainException {
  constructor() {
    super('Driver not found');
  }
}

export class DriverAlreadyRegistered extends DomainException {
  constructor() {
    super('Driver already registered');
  }
}

export class DriverNotAssignedToRide extends DomainException {
  constructor() {
    super('This driver is not assigned to this ride');
  }
}

export class DriverNotAvailable extends DomainException {
  constructor() {
    super('Driver is not available');
  }
}

export class DriverNotOnTrip extends DomainException {
  constructor() {
    super('Driver is not on-trip');
  }
}
