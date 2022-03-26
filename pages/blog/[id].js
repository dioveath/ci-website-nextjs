import Head from 'next/head';
import Navbar from '../../components/Navbar.js';

import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { FaFacebook, FaInstagram, FaDotCircle } from 'react-icons/fa';

import Marginer from '../../components/utils/Marginer.js';
import styles from './blogpage.module.css';
import htmr from 'htmr';

import { getPost } from '../api/posts/[postId].js';
import Footer from '../../components/footer/Footer.js';

export default function BlogPage(props){
  const router = useRouter();
  const { id } = router.query;

  const [blogData, setBlogData] = useState({title: "undefined"});
  const [loading, setLoading] = useState(true);

  useEffect(async () => {
    setLoading(true);
    let blog = await getPost(id);
    if(blog !== undefined)
      setBlogData(blog);
    setLoading(blogData.title === "undefined");
    console.log(blog);
  }, [blogData.title]);

  return (
    <div>
      <Head>
        <title> Charicha Insitute </title>
        <meta name="description" content="Charicha Institute Blogs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar/>

      <main className={styles.main}>

        <div className={styles.authorDetailsContainer}>
          <div className={styles.authorLeftContainer}>
            <img alt="" src="/profile.jpg" className={styles.profileImg}/>
            <Marginer horizontal="30px"/>                          
            <div className={styles.textDetails}>
              <p className={styles.infoText}> Ajaya Rajbhandari </p>
              <div className={styles.timeDetails}>
                <p className={styles.infoTextGrey}> { loading ? "Loading..." : Date(blogData.createdAt.seconds * 100).toLocaleString() } </p>
                <Marginer horizontal="10px"/>              
                <FaDotCircle size="5px"/>
                <Marginer horizontal="10px"/>
                <p className={styles.infoTextGrey}> { loading ? "Loading.." : parseInt(blogData.body.length / 450) + " min read"}</p>              
              </div>
            </div>
          </div>

          <div className={styles.socialLinks}>
            <FaFacebook size="30px" color="blue"/>
            <Marginer horizontal="20px"/>            
            <FaInstagram size="30px" color="red"/>
          </div>
        </div>

        <Marginer vertical="40px"/>        
        <div>
          { loading ? "Loading..." : htmr(blogData.body) }
        </div>

      </main>

      <Footer/>
    </div>
  );

}
