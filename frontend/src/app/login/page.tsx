import { Suspense } from 'react';
import LoginForm from '../../components/LoginForm';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}