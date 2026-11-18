'use client';

/*
 * Google is the only sign-in method, and there is no separate sign-up: the
 * first sign-in creates the user's profile document.
 */

import { createContext, useState, useContext, useEffect, type ReactNode } from "react";
import { deleteUser, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, type User } from "firebase/auth";

import { firebaseAuth } from "./firebase";
import { createUser, getUser } from "./users";
import type { UserData } from "../types";

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
  if (!context) throw new Error("useAuth must be used within an <AuthProvider>");
  return context;
}

function messageOf(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

// Loads the profile for a signed-in user, creating it on their first sign-in.
async function loadOrCreateProfile(authUser: User): Promise<UserData | null> {
  const existing = await getUser(authUser.uid);
  if (existing) return existing;

  const profile = authUser.providerData[0];
  const names = profile?.displayName ? profile.displayName.split(" ") : null;
  try {
    await createUser({
      id: authUser.uid,
      firstName: names && names[0],
      lastName: names && names[names.length - 1],
      email: authUser.email,
      photoURL: profile?.photoURL,
      phoneNumber: profile?.phoneNumber
    });
  } catch (e) {
    // A sign-in without a profile is unusable, so undo the new account.
    deleteUser(authUser);
    throw e;
  }
  return getUser(authUser.uid);
}

export function AuthProvider(props: { children?: ReactNode }) {
  // Resolved in the browser only: reading `currentUser` at module scope ran
  // getAuth() during prerender, where there are no credentials.
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  // Only "loading" if there is actually an auth state to wait for. The
  // NEXT_PUBLIC_ Firebase config is inlined at build time, so this resolves
  // the same on the server and in the browser.
  const [loading, setLoading] = useState(() => firebaseAuth() !== null);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (err: unknown) => {
    setError(messageOf(err));
    setTimeout(() => setError(null), 5000);
  };

  const loginWithGoogle = async () => {
    setError(null);
    const auth = firebaseAuth();
    if (!auth) {
      handleError(new Error("Sign-in is unavailable: Firebase is not configured."));
      return;
    }
    setFetching(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    await signInWithPopup(auth, provider).catch(handleError).finally(() => setFetching(false));
  };

  const logout = async () => {
    setError(null);
    setFetching(true);
    const auth = firebaseAuth();
    if (auth) await signOut(auth).catch(handleError);
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

      if (authUser) {
        setUser(authUser);
        try {
          setUserData(await loadOrCreateProfile(authUser));
        } catch (e) {
          handleError(e);
        }
      }

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
