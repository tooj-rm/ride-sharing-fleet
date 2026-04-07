import {
  AcceptRideUseCase,
  CompleteRideUseCase,
  RegisterDriverUseCase,
} from '~/application/usecases';
import { DriverController } from '~/presentation/express/driver.controller';
import express from 'express';
import { container } from '~/presentation/express/container';

const driverRepository = container.get('driverRepository');
const rideRepository = container.get('rideRepository');
const eventPublisher = container.get('eventPublisher');

const registerDriverUseCase = new RegisterDriverUseCase(
  driverRepository,
  eventPublisher,
);
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
