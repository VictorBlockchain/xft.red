// UserContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';

interface UserContextProps {
  children: ReactNode;
}

const UserContext = createContext<any | null>(null);

export const UserProvider: React.FC<UserContextProps> = ({ children }) => {
  // Manage user state here
  const [account, setAccount] = React.useState<any | null>(null);

  return (
    <UserContext.Provider value={{ account, setAccount }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
