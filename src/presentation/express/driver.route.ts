import {
  InMemoryDriverRepository,
  InMemoryRideRepository,
} from '~/infra/repositories/in-memory';
import {
  AcceptRideUseCase,
  CompleteRideUseCase,
  RegisterDriverUseCase,
} from '~/application/usecases';
import { ConsoleEventPublisher } from '~/infra/events';
import { DriverController } from '~/presentation/express/driver.controller';
import express from 'express';

const driverRepository = new InMemoryDriverRepository();
const rideRepository = new InMemoryRideRepository();
const eventPublisher = new ConsoleEventPublisher();
const registerDriverUseCase = new RegisterDriverUseCase(driverRepository);
const acceptRideUseCase = new AcceptRideUseCase(
  driverRepository,
  rideRepository,
  eventPublisher,
);
const completeRideUseCase = new CompleteRideUseCase(driverRepository);

const driverController = new DriverController(
  registerDriverUseCase,
  acceptRideUseCase,
  completeRideUseCase,
);

const router = express.Router();

router.post('/', driverController.register);
router.post('/accept-ride', driverController.acceptRide);
router.post('/complete-ride', driverController.completeRide);

export default router;
