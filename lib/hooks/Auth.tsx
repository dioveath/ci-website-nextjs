'use client';

import { createContext, useState, useContext, useEffect, type ReactNode } from "react";
import { deleteUser, getAuth, onAuthStateChanged, type User } from "firebase/auth";

import { firebaseApp } from "../firebase";
import { AuthService } from "../service/AuthService";
import { UserService } from "../service/UserService";
import type { UserData } from "../../types";

const auth = getAuth(firebaseApp);

export interface AuthContextValue {
  user: User | null;
  userData: UserData | null;
  isLoggedIn: boolean;
  error: string | null;
  fetching: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  registerWithEmailAndPassword: (
    email: string, password: string, firstName: string, lastName: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const authContext = createContext<AuthContextValue | null>(null);

export default function useAuth(): AuthContextValue {
  const context = useContext(authContext);
  // Previously this returned undefined and every caller threw a TypeError while
  // destructuring. _app wraps the tree in AuthProvider, so this cannot fire in
  // practice -- it just names the mistake if someone moves the provider.
  if (!context) throw new Error("useAuth must be used within an <AuthProvider>");
  return context;
}

function messageOf(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

export function AuthProvider(props: { children?: ReactNode }) {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (err: unknown) => {
    setError(messageOf(err));
    setTimeout(() => setError(null), 5000);
  };

  const finalize = () => setFetching(false);
  const clearError = () => setError(null);

  const loginWithGoogle = async () => {
    clearError();
    setFetching(true);
    await AuthService.loginWithGoogle().catch(handleError).finally(finalize);
  };

  const loginWithEmailAndPassword = async (email: string, password: string) => {
    clearError();
    setFetching(true);
    await AuthService.loginWithEmailAndPassword(email, password).catch(handleError).finally(finalize);
  };

  const registerWithEmailAndPassword = async (
    email: string, password: string, firstName: string, lastName: string
  ) => {
    clearError();
    setFetching(true);
    await AuthService.registerWithEmailAndPassword(email, password, firstName, lastName)
      .catch(handleError).finally(finalize);
  };

  const logout = async () => {
    clearError();
    setFetching(true);
    await AuthService.logout().catch(handleError);
    setUser(null);
    setUserData(null);
    setFetching(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setFetching(true);

      if (!authUser) {
        setFetching(false);
        setLoading(false);
        return;
      }

      setUser(authUser);

      let result = await UserService.getUser(authUser.uid);
      if (!result.userData) {
        const { email, providerData, uid } = authUser;
        const profile = providerData[0];
        const names = profile?.displayName ? profile.displayName.split(" ") : null;

        try {
          await UserService.addNewUser({
            id: uid,
            firstName: names && names[0],
            lastName: names && names[names.length - 1],
            email,
            photoURL: profile?.photoURL,
            phoneNumber: profile?.phoneNumber
          });
          result = await UserService.getUser(authUser.uid);
        } catch (e) {
          console.log(messageOf(e));
          deleteUser(authUser);
          handleError(e);
        } finally {
          finalize();
        }
      }

      setUserData(result.userData);
      setFetching(false);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextValue = {
    user,
    userData,
    isLoggedIn: !!userData,
    error,
    fetching,
    loading,
    loginWithGoogle,
    loginWithEmailAndPassword,
    registerWithEmailAndPassword,
    logout
  };

  return <authContext.Provider value={value} {...props} />;
}
