import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ORIGIN_CORS, PORT } from './config/config.js';
import UserRoutes from './routes/user.routes.js';
import StripeRoutes from './routes/stripe.routes.js';
import AuthRoutes from './routes/auth.routes.js'
import WalletRoutes from './routes/wallet.routes.js';
import TransactionsRoutes from './routes/transactions.routes.js';
import MarketRoutes from './routes/market.routes.js';
import ProfileRoutes from './routes/dataProfile.routes.js';
import FilesRoutes from './routes/files.routes.js';
import AdminRoutes from './routes/admin.routes.js';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';


dotenv.config();
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());


// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || ORIGIN_CORS.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
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
app.use("/api",FilesRoutes);
app.use("/api/admin",AdminRoutes);



  
  app.listen(PORT);
  console.log('server on port', PORT)