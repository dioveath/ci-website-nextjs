import Head from 'next/head';
import Navbar from '../../components/Navbar.js';

import styles from './blog.module.css';
import { AiFillPhone } from 'react-icons/ai';
import { ImLocation } from 'react-icons/im';

import TopBlog from '../../components/blog/TopBlog.js';
import BlogCard from '../../components/blog/BlogCard.js';

import Footer from '../../components/footer/Footer.js';

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
            props.posts.map((blog) => <BlogCard key={blog.title} blog={blog}/>)
          }
        </div>
        <div style={{height: "40px"}}></div>
      </main>

      <Footer/>

    </div>
  );

}

export async function getStaticProps(){
  const res = await fetch('http://localhost:3000/api/posts/posts');
  // console.log(await res.json());
  const posts = {
    posts: await res.json()
  };
  return {
    props: posts
  };
}
