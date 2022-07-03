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
  const [userData, setUserData] = useState({ id: 0});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [registerError, setRegisterError] = useState("");

  const loginWithGoogle = async () => {
    setLoading(true);

    // log in with google
    const googleResult = await AuthService.loginWithGoogle();
    setUser(googleResult.user ?? null);
    setError(googleResult.error ?? "");

    if(googleResult.error === undefined) {
      // get the user data
      const userDataResult = await UserService.getUser(user?.uid);
      setError(userDataResult.error ?? "");
      // if there are no data add new user data with google user info
      if(userDataResult.userData === undefined) {
        const newUserResult = await UserService.addNewUser({
          id: googleResult.user.uid,
          firstName: googleResult.user.displayName.split(" ")[0],
          lastName: googleResult.user.displayName.split(" ")[1],
          photoURL: googleResult.user.photoURL,
        });
        setError(newUserResult.error ?? "");
      }       
    }

    setLoading(false);
  };

  const loginWithEmailAndPassword = async (email, password) => {
    setLoading(true);
    const { error, user } = await AuthService.loginWithEmailAndPassword(email, password);
    setUser(user ?? null);
    // const { userDataError, userData } = await UserService.getUser(user?.uid);
    // setUserData(userData ?? null);    
    setError(error ?? "");
    setLoading(false);
  };

  const registerWithEmailAndPassword = async (email, password) => {
    setLoading(true);
    const { error, user } = await AuthService.registerWithEmailAndPassword(email, password);
    setUser(user ?? null);
    setRegisterError(error ?? null);

    if(error === undefined) {
      const { userDataError, userData } = await UserService.addNewUser({
        id: user.uid
      });
      setRegisterError(error ?? "");      
    }

    setLoading(false);
  };

  const logout = async() => {
    setLoading(true);    
    await AuthService.logout();
    setLoading(false);    
    setUser(null);
  };

  onAuthStateChanged(auth, async user => {
    setUser(user ?? null);
    const result = await UserService.getUser(user?.uid);
    if(result.userData !== undefined && result.userData.id != userData.id) {
      setUserData(result.userData);
    }
  });

  const value = { user, userData, error, registerError, loading, loginWithGoogle, loginWithEmailAndPassword, registerWithEmailAndPassword, logout};

  return <authContext.Provider value={value} {...props}/>;
}

