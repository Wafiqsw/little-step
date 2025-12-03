import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../firebase';
import { getDataById } from '../firebase/firestore';
import { Users } from '../types/Users';

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: Users | null;
  isInitialized: boolean;
  setUserProfile: (profile: Users | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<Users | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    console.log('🔥 AuthProvider mounted - non-blocking mode');
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('👤 Auth state changed:', firebaseUser ? `User: ${firebaseUser.uid}` : 'No user');
      setUser(firebaseUser);

      if (firebaseUser) {
        // Fetch user profile from Firestore asynchronously (non-blocking)
        getDataById<Users>('users', firebaseUser.uid)
          .then(profile => {
            console.log('✅ User profile fetched:', profile ? profile.role : 'null');
            setUserProfile(profile);
          })
          .catch(error => {
            console.error('❌ Error fetching user profile:', error);
            setUserProfile(null);
          });
      } else {
        // Clear user profile when logged out
        console.log('🧹 Clearing user profile');
        setUserProfile(null);
      }

      // Mark as initialized immediately after setting user
      if (!isInitialized) {
        console.log('✅ Auth initialized');
        setIsInitialized(true);
      }
    });

    return () => unsubscribe();
  }, [isInitialized]);

  return (
    <AuthContext.Provider value={{ user, userProfile, isInitialized, setUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
