import { Request, Response } from 'express';
import Product from '../models/mongo/Product';
import { isValidObjectId } from 'mongoose';

export const getCartDetails = async (req: Request, res: Response) => {
  const { productIds } = req.body;

  if (!Array.isArray(productIds) || productIds.some(id => !isValidObjectId(id))) {
    return res.status(400).json({ message: 'Invalid product IDs provided.' });
  }
  
  try {
    const products = await Product.find({
      '_id': { $in: productIds }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};