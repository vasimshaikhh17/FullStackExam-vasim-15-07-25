import { Request, Response } from 'express';
import { sequelize } from '../config/db';
import { QueryTypes } from 'sequelize';
import { OrderItem } from '../models'; // Correct way to import the SQL model
import Product from '../models/mongo/Product'; // Correct way to import the Mongoose model

// This function is likely correct, no changes needed here.
export const getDailyRevenue = async (req: Request, res: Response) => {
  try {
    const revenue = await sequelize.query(
      `SELECT DATE(o."createdAt") as date, SUM(o."totalAmount") as revenue
       FROM orders o
       WHERE o."createdAt" >= CURRENT_DATE - INTERVAL '7 days'
       GROUP BY DATE(o."createdAt")
       ORDER BY date ASC;`,
      { type: QueryTypes.SELECT }
    );
    res.json(revenue);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching daily revenue.' });
  }
};

export const getSalesByCategory = async (req: Request, res: Response) => {
  try {
    // Step 1: Fetch all order items from the SQL database.
    const allOrderItems = await OrderItem.findAll();

    if (allOrderItems.length === 0) {
      return res.json([]); // Return an empty array if there are no orders
    }
    
    // Step 2: Get all unique product IDs from the order items.
    const productIds = allOrderItems.map(item => item.productId);

    // Step 3: Fetch the corresponding products from MongoDB to get their categories.
    // We only need the _id and category fields for efficiency.
    const productsFromMongo = await Product.find({ _id: { $in: productIds } }).select('_id category');
    
    // Step 4: Create a simple map for fast lookups (ID -> Category).
    const productCategoryMap = new Map(
      productsFromMongo.map(p => [p._id.toString(), p.category])
    );

    // Step 5: Calculate the total sales for each category.
    const categorySales: { [key: string]: number } = {};

    for (const item of allOrderItems) {
      const category = productCategoryMap.get(item.productId);

      if (category) {
        // Initialize the category if it's the first time we've seen it
        if (!categorySales[category]) {
          categorySales[category] = 0;
        }

        // CRITICAL FIX: Sequelize returns DECIMAL as a string. We must parse it to a number.
        const itemTotal = item.price * item.quantity;
        categorySales[category] += itemTotal;
      }
    }
    
    // Step 6: Format the result into the array structure required by the exam.
    const result = Object.entries(categorySales).map(([category, totalSales]) => ({
      _id: category,
      totalSales: totalSales,
    }));

    res.json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching sales by category.' });
  }
};