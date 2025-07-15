"use client";

import { useCart } from "../context/CartContext";
import toast from "react-hot-toast"; 


interface CartProduct {
  productId: string;
  name: string;
  price: number;
  imageUrl?: string;
}

interface AddToCartButtonProps {
  product: CartProduct;
}

const AddToCartButton = ({ product }: AddToCartButtonProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);

  };

  return (
  <button
  onClick={handleAddToCart}
  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
>
  Add to Cart
</button>

  );
};

export default AddToCartButton;