import request from 'supertest';
import app from '../app'; // Your main express app file
import { sequelize } from '../config/db';
import User from '../models/sql/User';
import Product from '../models/mongo/Product';
import mongoose from 'mongoose';

// This is a simplified test. A real test would require more setup/teardown.
describe('POST /api/orders', () => {
  let token: string;
  let userId: number;
  let productId: string;

  beforeAll(async () => {
    // Create a test user and get a token
    await User.destroy({ where: { email: 'test@example.com' }});
    const user = await User.create({ name: 'Test User', email: 'test@example.com', passwordHash: 'password123' });
    userId = user.id;
    const res = await request(app).post('/api/auth/login').send({ email: 'test@example.com', password: 'password123' });
    token = res.body.token;

    // Create a test product
    const product = await Product.create({ name: 'Test Book', description: 'A book for testing', price: 10, category: 'Books', stock: 100 });
    productId = product._id.toString();
  });

  afterAll(async () => {
    await User.destroy({ where: { id: userId }});
    await Product.findByIdAndDelete(productId);
    await sequelize.close();
    await mongoose.connection.close();
  });

  it('should create an order successfully with valid data', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        cartItems: [{ productId: productId, quantity: 2 }]
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.totalAmount).toEqual('20.00');
  });

  it('should fail if not authenticated', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        cartItems: [{ productId: productId, quantity: 1 }]
      });

    expect(res.statusCode).toEqual(401);
  });
});