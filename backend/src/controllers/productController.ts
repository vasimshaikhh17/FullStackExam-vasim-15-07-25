import { Request, Response } from 'express';
import Product from '../models/mongo/Product';
import { isValidObjectId } from 'mongoose';

export const getProducts = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const pageSize = 10;
  const searchQuery = req.query.search ? String(req.query.search) : '';

  try {
    const query = searchQuery
      ? { $text: { $search: searchQuery } }
      : {};

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    if (!isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid product ID' });
    }
    
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};