import express from 'express';
import driverRoute from '~/presentation/express/driver.route';

const app = express();

app.use(express.json());

app.use('/drivers', driverRoute);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
