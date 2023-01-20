import { firebaseApp } from "../firebase.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  deleteUser,
} from "firebase/auth";

import { UserService } from "./UserService";

const auth = getAuth(firebaseApp);

const AuthService = {
  loginWithGoogle: async () => {
    const provider = new GoogleAuthProvider();

    provider.setCustomParameters({
      prompt: "select_account",
    });

    const result = await signInWithPopup(auth, provider);
    const credentials = GoogleAuthProvider.credentialFromResult(result);
    const user = result.user;

    return {
      user: user,
    };
  },

  loginWithEmailAndPassword: async (email, password) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const user = credential.user;

    return {
      user: user,
    };
  },

  registerWithEmailAndPassword: async (email, password, firstName, lastName) => {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = credential.user;
    const { uid } = user;

    const newUserData = {
      id: uid,
      firstName,
      lastName,
      email,
    };

    try {
      await UserService.addNewUser(newUserData);
    } catch(e){
      await deleteUser(user);
      console.log(e.message);
      throw new Error(e.message);
    }

    return {
      user: user,
    };
  },

  logout: async () => {
    await signOut(auth);
  },
};

export { AuthService };
