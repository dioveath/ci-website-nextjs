import Head from "next/head";
import { useRouter } from 'next/router';

import styles from "../../../styles/dashboard/index.module.css";
import Footer from "../../../components/footer/Footer.js";
import MediaContainer from '../../../containers/media';

import queryClient from '../../../lib/queryclient';
import { QueryClientProvider } from "@tanstack/react-query";
import useAuth from "../../../lib/hooks/Auth";
import LoadingScreen from "../../../components/LoadingScreen";

export default function Article() {
  const { loading, isLoggedIn } = useAuth();
  const router = useRouter();
  
  if(loading) return <LoadingScreen/>;
  if(!isLoggedIn){
    router.push('/');
    return <LoadingScreen/>;
  }
  
  window.scrollTo(0, 0);    

  return (
    <div className={styles.container}>
      <Head>
        <title> Charicha Institute | Dashboard </title>
        <meta name="description" content="User Dashboard" />
        <meta property="og:image" itemProp="image" content="_image.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <QueryClientProvider client={queryClient}>
        <main className="bg-gradient-[-45deg] from-eggblue to-slategray">
          <MediaContainer/>
        </main>
      </QueryClientProvider>
      <Footer />
    </div>
  );
}
