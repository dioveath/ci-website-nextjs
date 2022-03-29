import { createContext, useState, useContext } from "react";
import { firebaseApp } from '../firebase.js';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { AuthService } from '../service/AuthService.js';

const auth = getAuth(firebaseApp);
const authContext = createContext();

export default function useAuth(){
  return useContext(authContext);
} 

export function AuthProvider(props){
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const loginWithGoogle = async () => {
    const { error, user } = await AuthService.loginWithGoogle();
    setUser(user ?? null);
    setError(error ?? "");
  };

  const loginWithEmailAndPassword = async (email, password) => {
    console.log(email, password);
    const { error, user } = await AuthService.loginWithEmailAndPassword(email, password);
    setUser(user ?? null);
    setError(error ?? "");
  };

  const logout = async() => {
    await AuthService.logout();
    setUser(null);
  };

  onAuthStateChanged(auth, user => {
    setUser(user ?? null);
    setError(error ?? "");
  });  

  const value = { user, error, loginWithGoogle, loginWithEmailAndPassword, logout};

  return <authContext.Provider value={value} {...props}/>;
}

