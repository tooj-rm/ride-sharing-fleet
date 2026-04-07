import { Entity } from '~/domain/entities';
import { DriverStatus, Location } from '~/domain/vo';
import {
  DomainException,
  DriverNotAvailable,
  DriverNotOnTrip,
} from '~/domain/exceptions';

export class Driver extends Entity {
  static register(id: string, name: string) {
    if (id.trim().length < 5) {
      throw new DomainException('Driver ID must be at least 5 characters');
    }

    if (name.trim().length < 2) {
      throw new DomainException('Driver name must be at least 2 characters');
    }

    const driver = new Driver(id.trim(), name.trim());

    driver.emitEvent({
      eventId: crypto.randomUUID(),
      occurredAt: new Date(),
      aggregateId: driver.id,
      type: 'DriverRegistered',
      driverId: driver.id,
      name: driver.name,
    });

    return driver;
  }

  private constructor(
    public readonly id: string = '',
    public readonly name: string = '',
    private _status: DriverStatus = 'available',
    private _currentRide: string | null = null,
    private _earnings = 0,
  ) {
    super(id);
  }

  get status() {
    return this._status;
  }

  get earnings() {
    return this._earnings;
  }

  get currentRide() {
    return this._currentRide;
  }

  acceptRide(
    rideId: string,
    pickupLocation: Location,
    driverLocation: Location,
  ) {
    if (this._status !== 'available') {
      throw new DriverNotAvailable();
    }

    if (driverLocation.distanceTo(pickupLocation) > 5) {
      throw new DomainException('Driver is too far from pickup location');
    }

    this._status = 'on_trip';
    this._currentRide = rideId;

    this.emitEvent({
      eventId: crypto.randomUUID(),
      occurredAt: new Date(),
      aggregateId: this.id,
      type: 'DriverAcceptedRide',
      rideId,
      driverId: this.id,
      pickupLocation,
      driverLocation,
    });
  }

  completeRide(amount: number) {
    if (this._currentRide === null) {
      throw new DriverNotOnTrip();
    }

    if (amount < 0) {
      throw new DomainException('Fare amount must be positive');
    }

    const completeRideId = this._currentRide;

    this._status = 'available';
    this._earnings += amount;
    this._currentRide = null;

    this.emitEvent({
      eventId: crypto.randomUUID(),
      occurredAt: new Date(),
      aggregateId: this.id,
      type: 'DriverCompletedRide',
      driverId: this.id,
      rideId: completeRideId,
      fareAmount: amount,
      totalEarnings: this.earnings,
    });
  }

  static hydrate(
    id: string,
    name: string,
    status: DriverStatus,
    currentRide: string | null,
  ) {
    return new Driver(id, name, status, currentRide);
  }
}
