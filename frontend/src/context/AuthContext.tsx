import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { useRouter } from 'next/navigation';

interface UserInfo {
  id: number;
  name: string;
  email: string;
  token: string;
}

interface AuthContextType {
  userInfo: UserInfo | null;
  login: (data: UserInfo) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    }
  }, []);

  const login = (data: UserInfo) => {
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUserInfo(data);
    router.push('/');
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};