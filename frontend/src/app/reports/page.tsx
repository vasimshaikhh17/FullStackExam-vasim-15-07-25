"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

interface DailyRevenue {
  date: string;
  revenue: string; 
}

interface SalesByCategory {
  _id: string; 
  totalSales: number;
}

export default function ReportsPage() {
  const { userInfo } = useAuth();
  const router = useRouter();

  const [dailyRevenue, setDailyRevenue] = useState<DailyRevenue[]>([]);
  const [salesByCategory, setSalesByCategory] = useState<SalesByCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userInfo) {
      router.push('/login?redirect=/reports');
      return;
    }

    const fetchReports = async () => {
      try {
        const [revenueRes, categoryRes] = await Promise.all([
          api.get('/reports/daily-revenue'),
          api.get('/reports/sales-by-category'),
        ]);
        
        setDailyRevenue(revenueRes.data);
        setSalesByCategory(categoryRes.data);

      } catch (err) {
        console.error("Failed to fetch reports:", err);
        setError('Could not load report data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [userInfo, router]);

  if (loading) {
    return <p>Loading reports...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
<div className="max-w-4xl mx-auto p-4">
  <h1 className="text-2xl font-bold mb-6">Business Reports</h1>

  <div className="bg-white p-6 rounded-lg mb-8 shadow-sm border border-gray-100">
    <h2 className="text-lg font-semibold mb-4">Daily Revenue (Last 7 Days)</h2>
    {dailyRevenue.length > 0 ? (
      <ul className="divide-y divide-gray-100">
        {dailyRevenue.map((item) => (
          <li
            key={item.date}
            className="flex justify-between py-2 text-sm text-gray-700"
          >
            <span>{new Date(item.date).toLocaleDateString()}</span>
            <strong>${parseFloat(item.revenue).toFixed(2)}</strong>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500">No revenue data available.</p>
    )}
  </div>

  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    <h2 className="text-lg font-semibold mb-4">Total Sales by Category</h2>
    {salesByCategory.length > 0 ? (
      <ul className="divide-y divide-gray-100">
        {salesByCategory.map((item) => (
          <li
            key={item._id}
            className="flex justify-between py-2 text-sm text-gray-700"
          >
            <span>{item._id}</span>
            <strong>${item.totalSales.toFixed(2)}</strong>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500">No category sales data available.</p>
    )}
  </div>
</div>

  );
}