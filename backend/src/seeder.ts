import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { products } from './data/products';
import Product from './models/mongo/Product';

dotenv.config();

const connectMongo = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MONGO_URI not found in .env file.');
      process.exit(1);
    }
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected for seeding...');
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectMongo();
        await Product.deleteMany();
        await Product.insertMany(products);

    console.log('✅ Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error importing data: ${error}`);
    process.exit(1);
  }
};
const destroyData = async () => {
  try {
    await connectMongo();
    
    await Product.deleteMany();

    console.log('✅ Data Destroyed Successfully!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error destroying data: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}