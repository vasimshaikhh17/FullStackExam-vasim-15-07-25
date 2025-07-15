
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import api from '../../../utils/api';
import AddToCartButton from '../../../components/AddToCartButton';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
}

// This function receives the route params and fetches data
async function getProduct(id: string): Promise<Product | null> {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`;
    const res = await fetch(apiUrl, { cache: 'no-store' });

    if (!res.ok) {
      if (res.status === 404) {
        notFound();
      }
      throw new Error('Failed to fetch product');
    }
    
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Failed to fetch product:", error);
    if (error.message.includes('not found')) { // Or check for notFound error type
        notFound();
    }
    return null;
  }
}

// This is the function to generate dynamic metadata (e.g., the page title)
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getProduct(params.id);
  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }
  return {
    title: product.name,
    description: product.description,
  };
}

// This is our main page component
export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    // This case might be hit if the getProduct function returned null for a non-404 error
    return <p>Could not load product details.</p>;
  }

  const productForCart = {
    productId: product._id,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'flex-start' }}>
      <div>
        <img
          src={product.imageUrl || 'https://via.placeholder.com/500'}
          alt={product.name}
          style={{ width: '100%', borderRadius: '8px' }}
        />
      </div>
      <div>
        <h1 style={{ marginTop: 0 }}>{product.name}</h1>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0070f3' }}>
          ${product.price.toFixed(2)}
        </p>
        <p style={{ color: '#666' }}>{product.description}</p>
        <p>
          Status: <span style={{ color: product.stock > 0 ? 'green' : 'red', fontWeight: 'bold' }}>
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </p>
        {product.stock > 0 && <AddToCartButton product={productForCart} />}
      </div>
    </div>
  );
}