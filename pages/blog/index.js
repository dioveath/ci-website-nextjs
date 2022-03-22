import Head from 'next/head';
import Navbar from '../../components/Navbar.js';

import styles from './blog.module.css';
import { AiFillPhone } from 'react-icons/ai';
import { ImLocation } from 'react-icons/im';

import TopBlog from './TopBlog.js';
import BlogCard from './BlogCard.js';

export default function Contact(){
  
  return (
    <div className={styles.container}>
      <Head>
        <title> Charicha Insitute </title>
        <meta name="description" content="Charicha Institute Blogs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar/>

      <main className={styles.main}>
        <TopBlog/>

        <div style={{height: "40px"}}></div>
        <div className={styles["cards-container"]}>
          <BlogCard/>
          <BlogCard/>
          <BlogCard/>                    
        </div>

      </main>

    </div>
  );

}
