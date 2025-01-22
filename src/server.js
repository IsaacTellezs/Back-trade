import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PORT } from './config/config.js';
import UserRoutes from './routes/user.routes.js';
import StripeRoutes from './routes/stripe.routes.js';
import AuthRoutes from './routes/auth.routes.js'
import WalletRoutes from './routes/wallet.routes.js';
import TransactionsRoutes from './routes/transactions.routes.js';
import MarketRoutes from './routes/market.routes.js';
import ProfileRoutes from './routes/dataProfile.routes.js';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';


dotenv.config();
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());


// Middleware
app.use(cors({
  origin: ['https://trdnation.com', 'https://www.trdnation.com'],
  // origin: 'http://localhost:5174',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(UserRoutes);
app.use(StripeRoutes);
app.use("/api",AuthRoutes);
app.use("/api",WalletRoutes);
app.use("/api",TransactionsRoutes);
app.use("/api",MarketRoutes);
app.use("/api",ProfileRoutes);



  
  app.listen(PORT);
  console.log('server on port', PORT)