import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../firebase';
import { getDataByIdWithCache } from '../firebase/firestoreWithCache';
import { CacheInvalidation } from '../firebase/firestoreWithCache';
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
    console.log('🔥 AuthProvider mounted');
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('👤 Auth state changed:', firebaseUser ? `User: ${firebaseUser.uid}` : 'No user');
      setUser(firebaseUser);

      if (firebaseUser) {
        // Fetch user profile from Firestore with cache
        try {
          const profile = await getDataByIdWithCache<Users>('users', firebaseUser.uid);
          console.log('✅ User profile fetched:', profile ? profile.role : 'null');
          setUserProfile(profile);
        } catch (error) {
          console.error('❌ Error fetching user profile:', error);
          setUserProfile(null);
        }
      } else {
        // Clear user profile and cache when logged out
        console.log('🧹 Clearing user profile and cache');
        setUserProfile(null);
        CacheInvalidation.onLogout();
      }

      // Mark as initialized AFTER user profile is loaded
      setIsInitialized(true);
      console.log('✅ Auth initialized');
    });

    return () => unsubscribe();
  }, []);

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
