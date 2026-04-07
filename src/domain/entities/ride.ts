import { Location, RideStatus } from '~/domain/vo';
import { Entity } from '~/domain/entities';
import { DomainException, RideAlreadyAccepted } from '~/domain/exceptions';

export class Ride extends Entity {
  private _cancelledBy: 'rider' | 'driver' | null = null;

  private constructor(
    public readonly rideId: string,
    public readonly riderId: string,
    public readonly pickupLocation: Location,
    public readonly dropOfLocation: Location,
    private _status: RideStatus = 'requested',
    private _driverId: string | null = null,
  ) {
    super(rideId);
  }

  static request(
    rideId: string,
    riderId: string,
    pickupLocation: Location,
    dropOfLocation: Location,
  ) {
    const ride = new Ride(rideId, riderId, pickupLocation, dropOfLocation);
    ride.emitEvent({
      eventId: crypto.randomUUID(),
      aggregateId: ride.id,
      occurredAt: new Date(),
      type: 'RideRequested',
      rideId: ride.id,
      riderId: ride.riderId,
      pickupLocation: ride.pickupLocation,
      dropOfLocation: ride.dropOfLocation,
    });
    return ride;
  }

  get status() {
    return this._status;
  }

  get driverId() {
    return this._driverId;
  }

  get cancelledBy() {
    return this._cancelledBy;
  }

  accept(driverId: string) {
    if (this._status === 'accepted') {
      throw new RideAlreadyAccepted();
    }

    this._status = 'accepted';
    this._driverId = driverId;

    this.emitEvent({
      eventId: crypto.randomUUID(),
      aggregateId: this.id,
      occurredAt: new Date(),
      type: 'RideAccepted',
      rideId: this.id,
      riderId: this.riderId,
      pickupLocation: this.pickupLocation,
      dropOfLocation: this.dropOfLocation,
    });
  }

  start() {
    this._status = 'in_progress';

    this.emitEvent({
      eventId: crypto.randomUUID(),
      aggregateId: this.id,
      occurredAt: new Date(),
      type: 'RideStarted',
      rideId: this.id,
      riderId: this.riderId,
      pickupLocation: this.pickupLocation,
      dropOfLocation: this.dropOfLocation,
    });
  }

  cancel(cancelledBy: 'rider' | 'driver') {
    if (this._status === 'in_progress') {
      throw new DomainException('Cannot cancel ride in progress');
    }

    this._status = 'cancelled';
    this._cancelledBy = cancelledBy;

    this.emitEvent({
      eventId: crypto.randomUUID(),
      aggregateId: this.id,
      occurredAt: new Date(),
      type: 'RideCancelled',
      rideId: this.id,
      riderId: this.riderId,
      pickupLocation: this.pickupLocation,
      dropOfLocation: this.dropOfLocation,
    });
  }

  complete() {
    if (this._status !== 'in_progress') {
      throw new DomainException("Cannot complete ride if it's not started");
    }

    this._status = 'completed';

    this.emitEvent({
      eventId: crypto.randomUUID(),
      aggregateId: this.id,
      occurredAt: new Date(),
      type: 'RideCompleted',
      rideId: this.id,
      riderId: this.riderId,
      pickupLocation: this.pickupLocation,
      dropOfLocation: this.dropOfLocation,
    });
  }

  static hydrate(
    id: string,
    riderId: string,
    pickupLocation: { lat: number; lng: number },
    dropOfLocation: {
      lat: number;
      lng: number;
    },
    status: RideStatus,
    driverId: string | null,
  ) {
    return new Ride(
      id,
      riderId,
      Location.at(pickupLocation.lat, pickupLocation.lng),
      Location.at(dropOfLocation.lat, dropOfLocation.lng),
      status,
      driverId,
    );
  }
}
