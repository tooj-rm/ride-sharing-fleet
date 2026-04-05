import { InMemoryDriverRepository } from '~/infra/repositories/in-memory';
import {
  AcceptRideUseCase,
  CompleteRideUseCase,
  RegisterDriverUseCase,
} from '~/application/usecases';
import { ConsoleEventPublisher } from '~/infra/events';
import { DriverController } from '~/presentation/express/driver.controller';
import express from 'express';

const driverRepository = new InMemoryDriverRepository();
const registerDriverUseCase = new RegisterDriverUseCase(driverRepository);
const acceptRideUseCase = new AcceptRideUseCase(driverRepository);
const completeRideUseCase = new CompleteRideUseCase(driverRepository);
const eventPublisher = new ConsoleEventPublisher();

const driverController = new DriverController(
  registerDriverUseCase,
  acceptRideUseCase,
  completeRideUseCase,
  eventPublisher,
);

const router = express.Router();

router.post('/', driverController.register);
router.post('/accept-ride', driverController.acceptRide);
router.post('/complete-ride', driverController.completeRide);

export default router;
