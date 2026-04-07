import express from 'express';
import { driverRoute, rideRoute } from '~/presentation/express/routes';
import { errorHandler } from '~/presentation/express/error-handler';

const app = express();

app.use(express.json());

app.use('/drivers', driverRoute);
app.use('/rides', rideRoute);
app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
