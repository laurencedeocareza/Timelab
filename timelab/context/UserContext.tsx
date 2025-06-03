import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../FirebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserContextType {
  user: User | null;
  displayName: string | null;
  setDisplayName: (name: string) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  displayName: null,
  setDisplayName: () => {},
  isLoading: true,
});

export const UserProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        console.log("Auth state changed:", currentUser?.email);
        setUser(currentUser);
        
        if (currentUser) {
          // Try to get stored name first
          const storedName = await AsyncStorage.getItem('userName');
          
          if (storedName) {
            setDisplayName(storedName);
          } else if (currentUser.displayName) {
            // Use Firebase display name if available
            setDisplayName(currentUser.displayName);
            await AsyncStorage.setItem('userName', currentUser.displayName);
          }
        } else {
          setDisplayName(null);
        }
        
        setIsLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Error setting up auth state listener:", error);
      setIsLoading(false);
    }
  }, []);

  const updateDisplayName = async (name: string) => {
    setDisplayName(name);
    await AsyncStorage.setItem('userName', name);
  };

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        displayName, 
        setDisplayName: updateDisplayName,
        isLoading 
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);