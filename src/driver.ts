import { Location } from '~/location';

type DriverStatus = 'available' | 'on-trip' | 'offline';

export class Driver {
  private constructor(
    public readonly id: string = '',
    public readonly name: string = '',
    private _status: DriverStatus = 'available',
    private _earnings = 0,
    private _currentRide: string | null = null,
  ) {}

  static register(id: string, name: string) {
    if (id.trim().length < 5) {
      throw new Error('Driver ID must be at least 5 characters');
    }

    if (name.trim().length < 2) {
      throw new Error('Driver name must be at least 2 characters');
    }

    return new Driver(id.trim(), name.trim());
  }

  get status() {
    return this._status;
  }

  get earnings() {
    return this._earnings;
  }

  acceptRide(
    rideId: string,
    pickupLocation: Location,
    driverLocation: Location,
  ) {
    if (this._status !== 'available') {
      throw new Error('Driver is not available');
    }

    if (driverLocation.distanceTo(pickupLocation) > 5) {
      throw new Error('Driver is too far from pickup location');
    }

    this._status = 'on-trip';
    this._currentRide = rideId;
  }

  completeRide(amount: number) {
    if (this._currentRide === null) {
      throw new Error('Driver is not on-trip');
    }

    if (amount < 0) {
      throw new Error('Fare amount must be positive');
    }

    this._status = 'available';
    this._earnings += amount;
    this._currentRide = null;
  }
}
