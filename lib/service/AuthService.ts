import { firebaseAuth } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

/** Every entry point needs a configured Auth; this is where that is checked. */
function requireAuth() {
  const auth = firebaseAuth();
  if (!auth) {
    throw new Error(
      'Firebase is not configured. Set the FIREBASE_* environment variables to enable sign-in.'
    );
  }
  return auth;
}

const AuthService = {
  loginWithGoogle: async () => {
    const provider = new GoogleAuthProvider();

    provider.setCustomParameters({
      prompt: "select_account",
    });

    const result = await signInWithPopup(requireAuth(), provider);
    const user = result.user;

    return {
      user: user,
    };
  },

  logout: async () => {
    await signOut(requireAuth());
  },
};

export { AuthService };
