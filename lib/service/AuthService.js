import { firebaseApp } from '../firebase.js';
import { User, getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

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
      const token = credential.accessToken;
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

  logout: async () => {
    await signOut(auth);
  }
  
};

export { AuthService };
