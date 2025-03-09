import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import passport from './config/passport';
import { env } from './config/env';
import createRouter from './routes';
import errorMiddleware from './middlewares/error.middleware';
import morgan from 'morgan'

dotenv.config();

const app = express();
const PORT = env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));


// Passport
app.use(passport.initialize());

// Routes
app.use('/api',createRouter)

// Error handling middleware
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
