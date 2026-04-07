import express from 'express';
import { RideController } from '~/presentation/express/ride.controller';
import { RequestRideUseCase } from '~/application/usecases';
import { container } from '~/presentation/express/container';

const rideRepository = container.get('rideRepository');
const eventPublisher = container.get('eventPublisher');

const requestRideUseCase = new RequestRideUseCase(
  rideRepository,
  eventPublisher,
);

const rideController = new RideController(requestRideUseCase);

const router = express.Router();

router.post('/', rideController.request);

export default router;
