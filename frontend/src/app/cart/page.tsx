"use client";


import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useRouter } from 'next/navigation';
import api from '../../utils/api';

export default function CartPage() {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const { userInfo } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!userInfo) {
      router.push('/login?redirect=/cart');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderItems = cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      }));
      
      await api.post('/orders', { cartItems: orderItems });

      clearCart();
      router.push('/orders');
      
    } catch (err: any) {
      console.log('err: ', err);
      setError(err.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty. <Link href="/" style={{color: '#0070f3'}}>Go Shopping</Link></p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <div>
            {cartItems.map(item => (
              <div key={item.productId} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                <img src={item.imageUrl || 'https://via.placeholder.com/100'} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '1rem' }}/>
                <div style={{ flexGrow: 1 }}>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>{item.name}</p>
                  <p style={{ margin: '0.25rem 0' }}>Quantity: {item.quantity}</p>
                  <p style={{ margin: 0 }}>${item.price.toFixed(2)}</p>
                </div>
                <button onClick={() => removeFromCart(item.productId)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}>
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px' }}>
            <h2>Order Summary</h2>
            <p style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal</span>
              <strong>${total.toFixed(2)}</strong>
            </p>
            <button onClick={handleCheckout} disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
              {loading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
            {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}