import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { products } from './data/products';
import Product from './models/mongo/Product';

// Load environment variables
dotenv.config();

// Function to connect directly to MongoDB
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

// Function to import data
const importData = async () => {
  try {
    await connectMongo();
    
    // To make the script re-runnable, clear existing products first
    await Product.deleteMany();
    
    // Insert the sample products
    await Product.insertMany(products);

    console.log('✅ Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error importing data: ${error}`);
    process.exit(1);
  }
};

// Function to destroy data
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

// Logic to run the correct function based on command-line arguments
// To run: `ts-node src/seeder.ts` to import
// To run: `ts-node src/seeder.ts -d` to destroy
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}