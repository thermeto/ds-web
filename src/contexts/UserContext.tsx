import { createContext, useContext } from 'react';
import { User } from 'firebase/auth';

type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

// Create context with undefined initial value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook to use the UserContext and ensure it's not outside a Provider
export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}

export default UserContext;
