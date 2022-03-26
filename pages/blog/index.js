import Head from 'next/head';
import Navbar from '../../components/Navbar.js';

import styles from './blog.module.css';
import { AiFillPhone } from 'react-icons/ai';
import { ImLocation } from 'react-icons/im';

import TopBlog from '../../components/blog/TopBlog.js';
import BlogCard from '../../components/blog/BlogCard.js';

import Footer from '../../components/footer/Footer.js';
import { getPostsFirestore } from '../api/posts/index.js';

export default function Contact(props){

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
          {
            props.posts.map((blog) => <BlogCard key={blog.id} blog={blog}/>)
          }
        </div>
        <div style={{height: "40px"}}></div>
      </main>

      <Footer/>

    </div>
  );

}

export async function getStaticProps(){
  const res = await getPostsFirestore();
  const posts = {
    posts: res
  };
  return {
    props: posts
  };
}
