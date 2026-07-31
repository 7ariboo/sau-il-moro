"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, appleProvider } from '@/lib/firebase';
import { sendWelcomeEmail } from '@/lib/email';
import { isAdminEmail } from '@/lib/auth';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  surname: string;
  phone: string;
  address?: string;
  city?: string;
  zip?: string;
  newsletter?: boolean;
  role: 'customer' | 'admin';
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { email: string; password: string; name: string; surname: string; phone?: string; newsletter?: boolean }) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  loginWithApple: () => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateUserProfile: (updates: Partial<AuthUser>) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync Firebase Auth state with Firestore user profile or LocalStorage fallback
  useEffect(() => {
    if (auth && db) {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          try {
            const userDocRef = doc(db!, 'users', fbUser.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              const data = userDoc.data();
              const profile: AuthUser = {
                id: fbUser.uid,
                email: fbUser.email || '',
                name: data.name || fbUser.displayName?.split(' ')[0] || 'Utente',
                surname: data.surname || fbUser.displayName?.split(' ').slice(1).join(' ') || '',
                phone: data.phone || '',
                address: data.address || '',
                city: data.city || '',
                zip: data.zip || '',
                newsletter: !!data.newsletter,
                role: data.role || (isAdminEmail(fbUser.email) ? 'admin' : 'customer'),
              };
              setUser(profile);
              localStorage.setItem('sau-auth-user', JSON.stringify(profile));
            } else {
              const name = fbUser.displayName?.split(' ')[0] || 'Utente';
              const surname = fbUser.displayName?.split(' ').slice(1).join(' ') || '';
              const newProfile: AuthUser = {
                id: fbUser.uid,
                email: fbUser.email || '',
                name,
                surname,
                phone: '',
                role: isAdminEmail(fbUser.email) ? 'admin' : 'customer',
              };
              await setDoc(userDocRef, { ...newProfile, createdAt: new Date().toISOString() });
              setUser(newProfile);
              localStorage.setItem('sau-auth-user', JSON.stringify(newProfile));
              if (fbUser.email) {
                fetch('/api/email/welcome', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: fbUser.email, name }),
                }).catch(e => console.error('Error triggering welcome email:', e));
              }
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        } else {
          setUser(null);
          localStorage.removeItem('sau-auth-user');
        }
        setIsLoading(false);
      });
      return () => unsubscribe();
    } else {
      const saved = localStorage.getItem('sau-auth-user');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && isAdminEmail(parsed.email)) {
            parsed.role = 'admin';
          }
          setUser(parsed);
        } catch {
          localStorage.removeItem('sau-auth-user');
        }
      }
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      if (auth) {
        await signInWithEmailAndPassword(auth, email, password);
        return { success: true };
      } else {
        const mockUser: AuthUser = {
          id: isAdminEmail(email) ? 'admin-1' : `user-${Date.now()}`,
          email,
          name: email.split('@')[0],
          surname: 'Sardo',
          phone: '+39 333 1234567',
          role: isAdminEmail(email) ? 'admin' : 'customer',
        };
        setUser(mockUser);
        localStorage.setItem('sau-auth-user', JSON.stringify(mockUser));
        return { success: true };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Credenziali non valide' };
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    name: string;
    surname: string;
    phone?: string;
    newsletter?: boolean;
  }) => {
    try {
      if (auth && db) {
        const userCred = await createUserWithEmailAndPassword(auth, data.email, data.password);
        const profile: AuthUser = {
          id: userCred.user.uid,
          email: data.email,
          name: data.name,
          surname: data.surname,
          phone: data.phone || '',
          role: 'customer',
        };
        await setDoc(doc(db!, 'users', userCred.user.uid), {
          ...profile,
          newsletter: !!data.newsletter,
          createdAt: new Date().toISOString(),
        });
        setUser(profile);
        localStorage.setItem('sau-auth-user', JSON.stringify(profile));
        fetch('/api/email/welcome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: data.email, name: data.name }),
        }).catch(e => console.error('Error triggering welcome email:', e));
        return { success: true };
      } else {
        const mockUser: AuthUser = {
          id: `user-${Date.now()}`,
          email: data.email,
          name: data.name,
          surname: data.surname,
          phone: data.phone || '',
          role: 'customer',
        };
        setUser(mockUser);
        localStorage.setItem('sau-auth-user', JSON.stringify(mockUser));
        fetch('/api/email/welcome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: data.email, name: data.name }),
        }).catch(e => console.error('Error triggering welcome email:', e));
        return { success: true };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Errore nella registrazione' };
    }
  };

  const loginWithGoogle = async () => {
    try {
      if (auth && googleProvider) {
        await signInWithPopup(auth, googleProvider);
        return { success: true };
      } else {
        const mockUser: AuthUser = {
          id: `google-user-${Date.now()}`,
          email: 'utente.google@gmail.com',
          name: 'Utente',
          surname: 'Google',
          phone: '',
          role: 'customer',
        };
        setUser(mockUser);
        localStorage.setItem('sau-auth-user', JSON.stringify(mockUser));
        return { success: true };
      }
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      let message = 'Errore durante l\'accesso con Google';
      if (err.code === 'auth/unauthorized-domain') {
        message = 'Dominio non autorizzato su Firebase. Aggiungi sauilmoro.com e vercel.app in Firebase Console → Authentication → Impostazioni → Domini autorizzati.';
      } else if (err.code === 'auth/operation-not-allowed') {
        message = 'Google Login non è abilitato su Firebase. Vai in Firebase Console → Authentication → Metodo di accesso e abilita Google.';
      } else if (err.code === 'auth/popup-closed-by-user') {
        message = 'Finestra di accesso chiusa prima di completare il login.';
      }
      return { success: false, error: message };
    }
  };

  const loginWithApple = async () => {
    try {
      if (auth && appleProvider) {
        await signInWithPopup(auth, appleProvider);
        return { success: true };
      } else {
        const mockUser: AuthUser = {
          id: `apple-user-${Date.now()}`,
          email: 'utente.apple@icloud.com',
          name: 'Utente',
          surname: 'Apple',
          phone: '',
          role: 'customer',
        };
        setUser(mockUser);
        localStorage.setItem('sau-auth-user', JSON.stringify(mockUser));
        return { success: true };
      }
    } catch (err: any) {
      console.error('Apple Auth Error:', err);
      let message = 'Errore durante l\'accesso con Apple';
      if (err.code === 'auth/unauthorized-domain') {
        message = 'Dominio non autorizzato su Firebase. Aggiungi sauilmoro.com in Firebase Console → Authentication → Domini autorizzati.';
      } else if (err.code === 'auth/operation-not-allowed') {
        message = 'Apple Login non abilitato su Firebase Console (richiede Apple Services ID).';
      } else if (err.code === 'auth/popup-closed-by-user') {
        message = 'Finestra di accesso chiusa prima di completare il login.';
      }
      return { success: false, error: message };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      if (auth) {
        await sendPasswordResetEmail(auth, email);
        return { success: true };
      } else {
        console.log(`[SIMULATED PASSWORD RESET] Email sent to ${email}`);
        return { success: true };
      }
    } catch (err: any) {
      console.error('Reset Password Error:', err);
      let message = 'Impossibile inviare la mail di ripristino password.';
      if (err.code === 'auth/user-not-found') {
        message = 'Nessun account trovato con questo indirizzo email.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Indirizzo email non valido.';
      }
      return { success: false, error: message };
    }
  };

  const updateUserProfile = async (updates: Partial<AuthUser>) => {
    try {
      const updatedUser = user ? { ...user, ...updates } : null;
      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem('sau-auth-user', JSON.stringify(updatedUser));
      }
      if (auth?.currentUser && db) {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        await setDoc(userDocRef, updates, { merge: true });
      }
      return { success: true };
    } catch (err: any) {
      console.error('Error updating user profile:', err);
      return { success: false, error: err.message || 'Errore durante l\'aggiornamento del profilo' };
    }
  };

  const logout = async () => {
    if (auth) {
      await signOut(auth);
    }
    setUser(null);
    localStorage.removeItem('sau-auth-user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        loginWithGoogle,
        loginWithApple,
        resetPassword,
        updateUserProfile,
        logout,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
