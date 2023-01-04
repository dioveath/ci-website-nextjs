import { createContext, useState, useContext, useEffect } from "react";
import { firebaseApp } from "../firebase.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { AuthService } from "../service/AuthService.js";
import { UserService } from "../service/UserService.js";

const auth = getAuth(firebaseApp);
const authContext = createContext();

export default function useAuth() {
  return useContext(authContext);
}

export function AuthProvider(props) {
  const [user, setUser] = useState(auth.currentUser);
  const [userData, setUserData] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);

  const handleError = (err) => {
    setError(err.message);
  };

  const finalize = () => setFetching(false);
  const clearError = () => setError(null);

  const loginWithGoogle = async () => {
    clearError();
    setFetching(true);
    await AuthService.loginWithGoogle().catch(handleError).finally(finalize);
  };

  const loginWithEmailAndPassword = async (email, password) => {
    clearError();    
    setFetching(true);
    await AuthService.loginWithEmailAndPassword(email, password).catch(handleError).finally(finalize);
  };

  const registerWithEmailAndPassword = async (email, password) => {
    clearError();    
    setFetching(true);
    await AuthService.registerWithEmailAndPassword(email, password).catch(handleError).finally(finalize);
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
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        setFetching(true);
        setUser(user ?? null);

        console.log('afds');

        const result = await UserService.getUser(user?.uid);
        if (user && result.userData && result.userData.id != userData?.id) {
          setUserData(result.userData);
        }

        setFetching(false);
      },
      (error) => {
        console.log("error: " + error.message);
        setFetching(false);
      },
      () => {
        console.log("complete");
        setFetching(false);
      }
    );
    return () => unsubscribe();
  }, [userData?.id]);

  const value = {
    user,
    userData,
    error,
    fetching,
    loginWithGoogle,
    loginWithEmailAndPassword,
    registerWithEmailAndPassword,
    logout,
  };

  return <authContext.Provider value={value} {...props} />;
}
