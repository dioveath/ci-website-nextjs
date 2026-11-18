import { firebaseApp } from "../firebase";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const auth = getAuth(firebaseApp);

const AuthService = {
  loginWithGoogle: async () => {
    const provider = new GoogleAuthProvider();

    provider.setCustomParameters({
      prompt: "select_account",
    });

    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    return {
      user: user,
    };
  },

  logout: async () => {
    await signOut(auth);
  },
};

export { AuthService };
