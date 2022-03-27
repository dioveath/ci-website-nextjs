import '../styles/globals.css';

import { AuthProvider } from '../lib/hooks/Auth.js';

function MyApp({ Component, pageProps }) {

  return <AuthProvider>
           <Component {...pageProps} />
         </AuthProvider>;

}

export default MyApp;
