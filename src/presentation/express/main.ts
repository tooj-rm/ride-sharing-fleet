import express from 'express';
import driverRoute from '~/presentation/express/driver.route';
import rideRoute from '~/presentation/express/ride.route';

const app = express();

app.use(express.json());

app.use('/drivers', driverRoute);
app.use('/rides', rideRoute);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
