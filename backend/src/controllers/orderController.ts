import { Request, Response } from 'express';
import { sequelize } from '../config/db';
import {Order} from '../models';
import {OrderItem} from '../models';
import Product from '../models/mongo/Product';

interface AuthenticatedRequest extends Request {
  user?: { id: number };
}

export const createOrder = async (req: AuthenticatedRequest, res: Response) => {
  const { cartItems } = req.body; 
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ message: 'No items in cart' });
  }

  const transaction = await sequelize.transaction();

  try {
    const productIds = cartItems.map((item: any) => item.productId);
    const products = await Product.find({ '_id': { $in: productIds } });

    let totalAmount = 0;
    for (const item of cartItems) {
      const product = products.find(p => p._id.toString() === item.productId);
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Not enough stock for ${product.name}`);
      }
      totalAmount += product.price * item.quantity;
    }

    const order = await Order.create({
      userId,
      totalAmount,
    }, { transaction });

    for (const item of cartItems) {
      const product = products.find(p => p._id.toString() === item.productId)!;
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
      }, { transaction });

      product.stock -= item.quantity;
      await product.save();
    }

    await transaction.commit();
    res.status(201).json(order);
  } catch (error: any) {
    await transaction.rollback();
    res.status(500).json({ message: error.message || 'Server error during order creation' });
  }
};

export const getMyOrders = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const orders = await Order.findAll({
      where: { userId },
      include: [OrderItem],
      order: [['createdAt', 'DESC']],
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}