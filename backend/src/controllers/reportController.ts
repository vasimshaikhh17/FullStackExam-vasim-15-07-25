import { Request, Response } from "express";
import { sequelize } from "../config/db";
import { QueryTypes } from "sequelize";
import { OrderItem } from "../models";
import Product from "../models/mongo/Product";

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
    res.status(500).json({ message: "Server error fetching daily revenue." });
  }
};

export const getSalesByCategory = async (req: Request, res: Response) => {
  try {
    const allOrderItems = await OrderItem.findAll();

    if (allOrderItems.length === 0) {
      return res.json([]);
    }
    const productIds = allOrderItems.map((item) => item.productId);

    const productsFromMongo = await Product.find({
      _id: { $in: productIds },
    }).select("_id category");

    const productCategoryMap = new Map(
      productsFromMongo.map((p) => [p._id.toString(), p.category])
    );

    const categorySales: { [key: string]: number } = {};

    for (const item of allOrderItems) {
      const category = productCategoryMap.get(item.productId);

      if (category) {
        if (!categorySales[category]) {
          categorySales[category] = 0;
        }

        const itemTotal = item.price * item.quantity;
        categorySales[category] += itemTotal;
      }
    }

    const result = Object.entries(categorySales).map(
      ([category, totalSales]) => ({
        _id: category,
        totalSales: totalSales,
      })
    );

    res.json(result);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error fetching sales by category." });
  }
};
