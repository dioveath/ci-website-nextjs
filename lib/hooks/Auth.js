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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registerError, setRegisterError] = useState("");

  const loginWithGoogle = async () => {
    setLoading(true);
    await AuthService.loginWithGoogle();
    setLoading(false);
  };

  const loginWithEmailAndPassword = async (email, password) => {
    setLoading(true);
    await AuthService.loginWithEmailAndPassword(email, password);
    setLoading(false);
  };

  const registerWithEmailAndPassword = async (email, password) => {
    setLoading(true);
    await AuthService.registerWithEmailAndPassword(email, password);
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    await AuthService.logout();
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        setLoading(true);
        setUser(user ?? null);

        const result = await UserService.getUser(user?.uid);
        if (user && result.userData && result.userData.id != userData?.id) {
          setUserData(result.userData);
        }

        // if(user && result === undefined) {
        // }

        console.log("onAuthStateChange");
        setLoading(false);
      },
      (error) => {
        console.log("error: " + error.message);
        setLoading(false);
      },
      () => {
        console.log("complete");
        setLoading(false);
      }
    );
  }, []);

  const value = {
    user,
    userData,
    error,
    registerError,
    loading,
    loginWithGoogle,
    loginWithEmailAndPassword,
    registerWithEmailAndPassword,
    logout,
  };

  return <authContext.Provider value={value} {...props} />;
}
