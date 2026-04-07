import express from 'express';
import { driverRoute, rideRoute } from '~/presentation/express/routes';

const app = express();

app.use(express.json());

app.use('/drivers', driverRoute);
app.use('/rides', rideRoute);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
