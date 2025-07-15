"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

interface OrderItem {
  productName: string;
  quantity: number;
  price: string;
}

interface Order {
  id: number;
  totalAmount: string;
  status: string;
  createdAt: string;
  OrderItems: OrderItem[];
}

export default function OrdersPage() {
  const { userInfo } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/my-orders');
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userInfo, router]);

  if (loading) {
    return <p>Loading your orders...</p>;
  }

  return (
<div className="max-w-3xl mx-auto p-4">
  <h1 className="text-2xl font-bold mb-6">My Orders</h1>

  {orders.length === 0 ? (
    <p className="text-gray-600">You have no past orders.</p>
  ) : (
    <div className="space-y-6">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
        >
          <div className="flex justify-between border-b border-gray-200 pb-4 mb-4">
            <div>
              <p className="text-sm">
                <strong>Order ID:</strong> {order.id}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm">
                <strong>Total:</strong> ${parseFloat(order.totalAmount).toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                <strong>Status:</strong> {order.status}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {order.OrderItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between text-sm text-gray-700"
              >
                <span>{item.productName} (x{item.quantity})</span>
                <span>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )}
</div>

  );
}