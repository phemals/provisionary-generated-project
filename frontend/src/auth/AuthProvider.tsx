import { createContext, useState, ReactNode } from 'react';

export interface AuthAccount {
  name: string;
  username: string;
}

export interface AuthContextValue {
  account: AuthAccount | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  getIdToken: () => Promise<string | null>;
}

export const AuthContext = createContext<AuthContextValue>({
  account: null,
  isLoading: false,
  login: async () => {},
  logout: () => {},
  getIdToken: async () => null,
});

const MOCK_ACCOUNT: AuthAccount = {
  name: 'Demo Manager',
  username: 'manager@contoso.com',
};

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<AuthAccount | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async () => {
    setIsLoading(true);
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));
    setAccount(MOCK_ACCOUNT);
    setIsLoading(false);
  };

  const logout = () => {
    setAccount(null);
  };

  const getIdToken = async (): Promise<string | null> => {
    // Return a mock token for preview — real MSAL token in production
    return account ? 'mock-preview-token' : null;
  };

  return (
    <AuthContext.Provider value={{ account, isLoading, login, logout, getIdToken }}>
      {children}
    </AuthContext.Provider>
  );
}
