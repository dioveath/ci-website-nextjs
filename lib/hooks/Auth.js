import { createContext, useState, useContext } from "react";
import { firebaseApp } from '../firebase.js';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { AuthService } from '../service/AuthService.js';
import { UserService } from '../service/UserService.js';

const auth = getAuth(firebaseApp);
const authContext = createContext();

export default function useAuth(){
  return useContext(authContext);
} 

export function AuthProvider(props){
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loginWithGoogle = async () => {
    setLoading(true);
    const { error, user } = await AuthService.loginWithGoogle();
    setUser(user ?? null);
    const { userDataError, userData } = await UserService.getUser(user?.uid);
    setUserData(userData ?? null);
    setError(error ?? "");
    setLoading(false);
  };

  const loginWithEmailAndPassword = async (email, password) => {
    setLoading(true);
    const { error, user } = await AuthService.loginWithEmailAndPassword(email, password);
    setUser(user ?? null);
    const { userDataError, userData } = await UserService.getUser(user?.uid);
    setUserData(userData ?? null);    
    setError(error ?? "");
    setLoading(false);
  };

  const registerWithEmailAndPassword = async (email, password) => {
    setLoading(true);
    const { error, user } = await AuthService.registerWithEmailAndPassword(email, password);
    setUser(user ?? null);
    const { userDataError, userData } = await UserService.addNewUser({
      id: user.uid,
      first_name: "First Name",
      last_name: "Last Name",
      exp_points: 0,
      hearts: 0,
      rank: "Guest",
      roles: {
        guest: true
      },
    });

    setUserData(userData ?? null);
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


  const value = { user, userData, error, loading, loginWithGoogle, loginWithEmailAndPassword, registerWithEmailAndPassword, logout};

  return <authContext.Provider value={value} {...props}/>;
}

