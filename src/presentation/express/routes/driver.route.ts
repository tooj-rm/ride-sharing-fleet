import {
  AcceptRideUseCase,
  CompleteRideUseCase,
  RegisterDriverUseCase,
  StartTripUseCase,
} from '~/application/usecases';
import { DriverController } from '~/presentation/express/controllers';
import express from 'express';
import { container } from '~/presentation/express/container';
import { DriverRepository, RideRepository } from '~/domain/repositories';
import { EventPublisher } from '~/domain/events';

const driverRepository = container.get('driverRepository') as DriverRepository;
const rideRepository = container.get('rideRepository') as RideRepository;
const eventPublisher = container.get('eventPublisher') as EventPublisher;

const registerDriverUseCase = new RegisterDriverUseCase(
  driverRepository,
  eventPublisher,
);
const acceptRideUseCase = new AcceptRideUseCase(
  driverRepository,
  rideRepository,
  eventPublisher,
);
const startTripUseCase = new StartTripUseCase(
  driverRepository,
  rideRepository,
  eventPublisher,
);
const completeRideUseCase = new CompleteRideUseCase(
  driverRepository,
  rideRepository,
  eventPublisher,
);

const driverController = new DriverController(
  registerDriverUseCase,
  acceptRideUseCase,
  startTripUseCase,
  completeRideUseCase,
);

const router = express.Router();

router.post('/', driverController.register);
router.post('/accept-ride', driverController.acceptRide);
router.post('/start-trip', driverController.startTrip);
router.post('/complete-ride', driverController.completeRide);

export default router;
