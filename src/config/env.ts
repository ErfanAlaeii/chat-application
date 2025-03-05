import dotenv from 'dotenv';

dotenv.config();

export const env = {
  PORT: process.env.PORT || '5000',
  JWT_SECRET: process.env.JWT_SECRET || 'secret_key',
  DATABASE_URL: process.env.DATABASE_URL || '',
};
