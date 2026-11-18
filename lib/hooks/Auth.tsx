'use client';

import { createContext, useState, useContext, useEffect, type ReactNode } from "react";
import { deleteUser, onAuthStateChanged, type User } from "firebase/auth";

import { firebaseAuth } from "../firebase";
import { AuthService } from "../service/AuthService";
import { UserService } from "../service/UserService";
import type { UserData } from "../../types";

export interface AuthContextValue {
  user: User | null;
  userData: UserData | null;
  isLoggedIn: boolean;
  error: string | null;
  fetching: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
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
  // Resolved in the browser only: reading `currentUser` at module scope ran
  // getAuth() during prerender, where there are no credentials.
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  // Only "loading" if there is actually an auth state to wait for. Firebase
  // config is inlined at build time (next.config.js `env`), so this resolves
  // the same on the server and in the browser.
  const [loading, setLoading] = useState(() => firebaseAuth() !== null);
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

  const logout = async () => {
    clearError();
    setFetching(true);
    await AuthService.logout().catch(handleError);
    setUser(null);
    setUserData(null);
    setFetching(false);
  };

  useEffect(() => {
    const auth = firebaseAuth();

    // No Firebase configuration: the marketing pages still render and the
    // visitor is simply treated as signed out rather than seeing a crash.
    // `loading` already started false in that case, so there is nothing to
    // settle here.
    if (!auth) return undefined;

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
    logout
  };

  return <authContext.Provider value={value} {...props} />;
}
