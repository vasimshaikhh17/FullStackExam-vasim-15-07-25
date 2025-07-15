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
      const { data } = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, { name, email, password });
      // Log the user in automatically after successful registration
      login(data);
      // Redirect to the home page
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create an Account</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <label htmlFor="name">Name</label>
      <input
        id="name"
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        placeholder="your.email@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        placeholder="••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>

      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Already have an account?{' '}
        <Link href="/login" style={{ color: '#0070f3' }}>
          Login
        </Link>
      </p>
    </form>
  );
}