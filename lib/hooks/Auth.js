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
  const [loading, setLoading] = useState(false);

  const loginWithGoogle = async () => {
    setLoading(true);
    const { error, user } = await AuthService.loginWithGoogle();
    setUser(user ?? null);
    setError(error ?? "");
    setLoading(false);
  };

  const loginWithEmailAndPassword = async (email, password) => {
    setLoading(true);
    const { error, user } = await AuthService.loginWithEmailAndPassword(email, password);
    setUser(user ?? null);
    setError(error ?? "");
    setLoading(false);
  };

  const registerWithEmailAndPassword = async (email, password) => {
    setLoading(true);
    const { error, user } = await AuthService.registerWithEmailAndPassword(email, password);
    setUser(user ?? null);
    setError(error ?? "");
    setLoading(false);
  };

  const logout = async() => {
    setLoading(true);    
    await AuthService.logout();
    setLoading(false);    
    setUser(null);
  };

  onAuthStateChanged(auth, user => {
    setUser(user ?? null);
    setError(error ?? "");
  });  

  const value = { user, error, loading, loginWithGoogle, loginWithEmailAndPassword, registerWithEmailAndPassword, logout};

  return <authContext.Provider value={value} {...props}/>;
}

