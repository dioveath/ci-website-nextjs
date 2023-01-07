import Head from "next/head";

import styles from "../../../styles/dashboard/index.module.css";
import Footer from "../../../components/footer/Footer.js";
import MediaContainer from '../../../containers/media';

import queryClient from '../../../lib/queryclient';
import { QueryClientProvider } from "@tanstack/react-query";



export default function Article() {
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
