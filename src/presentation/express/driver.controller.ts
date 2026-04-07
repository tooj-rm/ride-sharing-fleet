import {
  AcceptRideUseCase,
  CompleteRideUseCase,
  RegisterDriverUseCase,
} from '~/application/usecases';
import { Request, Response } from 'express';
import { Location } from '~/domain/vo';

export class DriverController {
  constructor(
    private readonly registerDriverUseCase: RegisterDriverUseCase,
    private readonly acceptRideUseCase: AcceptRideUseCase,
    private readonly completeRideUseCase: CompleteRideUseCase,
  ) {}

  register = async (req: Request, res: Response) => {
    const { id, name } = req.body;
    await this.registerDriverUseCase.execute({ id, name });
    res.send({ message: 'Driver registered' });
  };

  acceptRide = async (req: Request, res: Response) => {
    const { driverId, rideId } = req.body;
    const pickupLocation = Location.at(0, 0);
    const driverLocation = Location.at(0.01, 0);
    await this.acceptRideUseCase.execute({
      driverId,
      rideId,
      pickupLocation,
      driverLocation,
    });
    res.send({ message: 'Ride accepted' });
  };

  completeRide = async (req: Request, res: Response) => {
    const { driverId, rideId, fareAmount } = req.body;
    await this.completeRideUseCase.execute({
      driverId,
      rideId,
      fareAmount,
    });
    res.send({ message: 'Ride completed' });
  };
}
