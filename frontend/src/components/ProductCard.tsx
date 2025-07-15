import Link from 'next/link';
import AddToCartButton from './AddToCartButton';

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const productForCart = {
    productId: product._id,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
  };

  return (
<div className="border border-[#e0e0e0] rounded-lg overflow-hidden shadow-sm">
  <Link href={`/products/${product._id}`} passHref>
    <img
      src={product.imageUrl || 'https://via.placeholder.com/300'}
      alt={product.name}
      className="w-full h-[200px] object-cover block"
    />
  </Link>
  <div className="p-4">
    <h3 className="text-[1.1rem] mb-2 font-medium">{product.name}</h3>
    <p className="text-[1.2rem] font-bold mb-4">${product.price.toFixed(2)}</p>
    <AddToCartButton product={productForCart} />
  </div>
</div>

  );
};

export default ProductCard;
