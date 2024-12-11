import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PORT } from './config/config.js';
import UserRoutes from './routes/user.routes.js';
import StripeRoutes from './routes/stripe.routes.js';
import AuthRoutes from './routes/auth.routes.js'
import WalletRoutes from './routes/wallet.routes.js';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';


dotenv.config();
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());


// Middleware
app.use(cors({
  origin: 'https://trade-nationn.netlify.app',
  credentials: true,
}));
app.use(UserRoutes);
app.use(StripeRoutes);
app.use("/api",AuthRoutes);
app.use("/api",WalletRoutes);



  
  app.listen(PORT);
  console.log('server on port', PORT)