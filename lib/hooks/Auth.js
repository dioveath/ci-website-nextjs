import { createContext, useState, useContext, useEffect } from "react";
import { firebaseApp } from "../firebase.js";
import { deleteUser, getAuth, onAuthStateChanged } from "firebase/auth";
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

  // console.log(user);

  const handleError = (err) => {
    setError(err.message);
    setTimeout(() => setError(null), 5000);
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

  const registerWithEmailAndPassword = async (email, password, firstName, lastName) => {
    clearError();    
    setFetching(true);
    await AuthService.registerWithEmailAndPassword(email, password, firstName, lastName).catch(handleError).finally(finalize);
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
        console.log(`Auth State changed with - ${user?.uid}`);

        if(!user) {
          setFetching(false);
          return;
        }

        setUser(user);
        setFetching(false);
        const result = await UserService.getUser(user?.uid);

        if(!result.userData) {
          const { providerData, uid } = user;
          const { displayName, phoneNumber, photoURL } = providerData;
          const names = displayName ? displayName.split(' ') : null;

          const newUserData = {
            id: uid,
            firstName: names && names[0],
            lastName: names && names[names.length - 1],
            photoURL,
            phoneNumber
          };

          try {
            await UserService.addNewUser(newUserData);
            result = await UserService.getUser(user?.uid);
          } catch (e){
            console.log(e.message);
            finalize(e);
            // await logout();
            // TODO: Should we delete the user, if we can't create a userData?
            // No, let's give them a chance, that means we need to handle no data??
          }
        }

        setUserData(result.userData);
      },
      (error) => {
        console.log(error.message);
        handleError(error);
        setFetching(false);
      },
      () => {
        console.log("complete");
        setFetching(false);
      }
    );

    return () => unsubscribe();
  }, []);

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
