import Head from 'next/head';
import Navbar from '../../components/Navbar.js';

import styles from './blog.module.css';

import TopBlog from '../../components/blog/TopBlog.js';
import BlogCard from '../../components/blog/BlogCard.js';

import Footer from '../../components/footer/Footer.js';
import { getPostsFirestore } from '../api/posts/index.js';

import { useCallback } from 'react';
import { loadFull } from 'tsparticles';
import Particles from 'react-particles';
import { particleConfig } from '../../lib/particle_config';

export default function Contact(props){
  const particlesInit = useCallback(async engine => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async container => {
    console.log(container);
  }, []);


  return (
    <div className={styles.container}>
      <Head>
        <title> Charicha Insitute </title>
        <meta name="description" content="Charicha Institute Blogs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <main className={'bg-gradient-[-45deg] from-eggblue to-slategray pb-10'}>
        <Navbar path={'/blog'}/>
        <Particles init={particlesInit} loaded={particlesLoaded} options={particleConfig}/>        

	<div className='px-8 md:px-10 xl:px-20 2xl:px-48 mt-10'>
        {/* <TopBlog/> */}
        <div style={{height: "40px"}}></div>
        <div className={styles["cards-container"]}>
          {
            props.posts.map((blog) => <BlogCard key={blog.id} blog={blog}/>)
          }
        </div>
          <div style={{height: "40px"}}></div>
        </div>    
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
