import { DomainException } from '~/domain/exceptions';

export class DriverNotFound extends DomainException {
  constructor() {
    super('Driver not found', 'driver_not_found', 404);
  }
}

export class DriverAlreadyRegistered extends DomainException {
  constructor() {
    super('Driver already registered', 'driver_already_registered', 422);
  }
}

export class DriverNotAssignedToRide extends DomainException {
  constructor() {
    super(
      'This driver is not assigned to this ride',
      'driver_not_assigned_to_ride',
      422,
    );
  }
}

export class DriverNotAvailable extends DomainException {
  constructor() {
    super('Driver is not available', 'driver_not_available', 422);
  }
}

export class DriverNotOnTrip extends DomainException {
  constructor() {
    super('Driver is not on-trip', 'driver_not_on_trip', 422);
  }
}
