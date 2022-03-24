import '../styles/globals.css';
import { UserProvider } from '@auth0/nextjs-auth0';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
        
}

export default MyApp;
