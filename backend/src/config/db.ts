import { Sequelize } from 'sequelize';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.DATABASE_URL;
const mongoUri = process.env.MONGO_URI;

if (!dbUrl || !mongoUri) {
  console.error("Database environment variables DATABASE_URL and MONGO_URI must be set.");
  process.exit(1);
  
}

export const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  logging: false,
  ...(process.env.NODE_ENV === 'production' && {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, 
      },
    },
  }),
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected...');
    
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected...');
  } catch (error) {
    console.error('Unable to connect to the databases:', error);
    process.exit(1);
  }
};