import {
  AcceptRideUseCase,
  CompleteRideUseCase,
  RegisterDriverUseCase,
} from '~/application/usecases';
import { Request, Response } from 'express';
import { EventPublisher } from '~/infra/events';
import { Location } from '~/domain/entities';

export class DriverController {
  constructor(
    private readonly registerDriverUseCase: RegisterDriverUseCase,
    private readonly acceptRideUseCase: AcceptRideUseCase,
    private readonly completeRideUseCase: CompleteRideUseCase,
    private readonly eventPublisher: EventPublisher,
  ) {}

  register = async (req: Request, res: Response) => {
    const { id, name } = req.body;

    const driver = await this.registerDriverUseCase.execute({ id, name });
    await this.eventPublisher.publish(driver.releaseEvents());

    res.send({ message: 'Driver registered' });
  };

  acceptRide = async (req: Request, res: Response) => {
    const { driverId, rideId } = req.body;
    const pickupLocation = Location.at(0, 0);
    const driverLocation = Location.at(0.01, 0);

    const driver = await this.acceptRideUseCase.execute({
      driverId,
      rideId,
      pickupLocation,
      driverLocation,
    });
    await this.eventPublisher.publish(driver.releaseEvents());

    res.send({ message: 'Ride accepted' });
  };

  completeRide = async (req: Request, res: Response) => {
    const { driverId, rideId, fareAmount } = req.body;

    const driver = await this.completeRideUseCase.execute({
      driverId,
      rideId,
      fareAmount,
    });
    await this.eventPublisher.publish(driver.releaseEvents());

    res.send({ message: 'Ride completed' });
  };
}
