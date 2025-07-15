"use client";

import { useState, FormEvent } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.post(`/auth/register`, { name, email, password });
      login(data);
      router.push('/');
    } catch (err: any) {
      console.log('err: ', err);
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
<form
  onSubmit={handleSubmit}
  className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md space-y-4"
>
  <h2 className="text-2xl font-bold text-center">Create an Account</h2>

  {error && <p className="text-red-600 text-sm text-center">{error}</p>}

  <div>
    <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
      Name
    </label>
    <input
      id="name"
      type="text"
      placeholder="Your Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      required
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  <div>
    <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
      Email
    </label>
    <input
      id="email"
      type="email"
      placeholder="your.email@example.com"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  <div>
    <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
      Password
    </label>
    <input
      id="password"
      type="password"
      placeholder="••••••"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  <button
    type="submit"
    disabled={loading}
    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {loading ? 'Registering...' : 'Register'}
  </button>

  <p className="mt-4 text-center text-sm">
    Already have an account?{' '}
    <Link href="/login" className="text-blue-600 hover:underline">
      Login
    </Link>
  </p>
</form>

  );
}