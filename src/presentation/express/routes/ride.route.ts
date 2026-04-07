import express from 'express';
import { RideController } from '~/presentation/express/controllers';
import { RequestRideUseCase } from '~/application/usecases';
import { container } from '~/presentation/express/container';
import { RideRepository } from '~/domain/repositories';
import { EventPublisher } from '~/domain/events';

const rideRepository = container.get('rideRepository') as RideRepository;
const eventPublisher = container.get('eventPublisher') as EventPublisher;

const requestRideUseCase = new RequestRideUseCase(
  rideRepository,
  eventPublisher,
);

const rideController = new RideController(requestRideUseCase);

const router = express.Router();

router.post('/', rideController.request);

export default router;
