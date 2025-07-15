import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true, index: true },
  stock: { type: Number, required: true, default: 0 },
  imageUrl: { type: String, required: false },
}, {
  timestamps: true
});

ProductSchema.index({ name: 'text', category: 'text' });

export default mongoose.model<IProduct>('Product', ProductSchema);