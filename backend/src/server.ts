import app from './app';
import { config } from './config';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🍯 Bee's Treatz UK Backend API`);
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log(`📍 Base Restaurant Postcode: ${config.delivery.restaurantPostcode}`);
  console.log(`🌐 Allowed Frontend: ${config.frontendUrl}`);
  console.log(`===============================================`);
});
