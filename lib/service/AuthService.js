import { firebaseApp } from '../firebase.js';
import { User, getAuth, GoogleAuthProvider, signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth(firebaseApp);

const AuthService = {

  loginWithGoogle: async () => {
    const provider = new GoogleAuthProvider();

    provider.setCustomParameters({
      prompt: "select_account"
    });

    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;

      return {
        user: user
      };

    } catch(e){
      return {
        error: e.message
      };
    }
  },

  loginWithEmailAndPassword: async (email, password) => {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const user = credential.user;
      return {
        user: user
      };
    } catch(e){
      return {
        error: e.message
      };
    }

  },

  registerWithEmailAndPassword: async (email, password) => {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      const user = credential.user;
      return {
        user: user
      };
    } catch(e){
      return {
        error: e.message
      };
    }
  },

  logout: async () => {
    await signOut(auth);
  }
  
};

export { AuthService };
