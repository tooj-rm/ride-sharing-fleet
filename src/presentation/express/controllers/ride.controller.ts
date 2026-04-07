import { RequestRideUseCase } from '~/application/usecases';
import { Request, Response } from 'express';

export class RideController {
  constructor(private readonly requestRideUseCase: RequestRideUseCase) {}

  request = async (req: Request, res: Response) => {
    const { rideId, riderId, pickupLocation, dropOfLocation } = req.body;
    await this.requestRideUseCase.execute({
      rideId,
      riderId,
      pickupLocation,
      dropOfLocation,
    });
    res.send({ message: 'Ride requested' });
  };
}
