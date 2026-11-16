import { firebaseApp } from "../firebase";
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

  loginWithEmailAndPassword: async (email: string, password: string) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const user = credential.user;

    return {
      user: user,
    };
  },

  registerWithEmailAndPassword: async (
    email: string, password: string, firstName: string, lastName: string
  ) => {
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
      const message = e instanceof Error ? e.message : String(e);
      console.log(message);
      throw new Error(message);
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
