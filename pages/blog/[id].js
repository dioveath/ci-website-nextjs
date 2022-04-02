
import Head from 'next/head';
import Navbar from '../../components/Navbar.js';

import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { FaFacebook, FaInstagram, FaDotCircle } from 'react-icons/fa';
import { AiFillHeart } from 'react-icons/ai';

import Marginer from '../../components/utils/Marginer.js';
import styles from './blogpage.module.css';
import htmr from 'htmr';

import { getPost } from '../api/posts/[postId].js';
import { getUser } from '../api/users/[userId].js';
import Footer from '../../components/footer/Footer.js';

export default function BlogPage(props){
  const router = useRouter();
  const { id } = router.query;

  const [userData, setUserData] = useState({ first_name: "null", last_name: "null"});
  const [loadingUser, setLoadingUser] = useState(true);

  const [blogData, setBlogData] = useState({title: "undefined"});
  const [loading, setLoading] = useState(true);

  useEffect(async () => {
    setLoading(true);
    let blog = await getPost(id);
    if(blog !== undefined)
      setBlogData(blog);
    setLoading(blogData.title === "undefined");
  }, [blogData.id]);

  useEffect(async () => {
    setLoadingUser(true);
    if(blogData.title !== "undefined") {
      let user = await getUser(blogData.writtenBy);
      if(user !== undefined){
        setUserData(user);
      }
      setLoadingUser(false);
    }
  }, [userData.first_name, blogData.id]);

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
            <img alt="" src={ loadingUser ? "Loading.." : userData.profile_URL } className={styles.profileImg}/>
            <Marginer horizontal="30px"/>                          
            <div className={styles.textDetails}>
              <p className={styles.infoText}> { loadingUser ? "Loading.." : userData.first_name + " " + userData.last_name }</p>
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
            {/* <Marginer horizontal="20px"/> */}
            <FaFacebook size="30px" color="blue"/>
            <Marginer horizontal="20px"/>            
            <FaInstagram size="30px" color="red"/>
            {/* <p className={styles.timeDetails} > Social Links </p> */}
          </div>
        </div>

        <div className={styles.contentContainer}>
          <div className={styles.content}>
            { loading ? "Loading..." : htmr(blogData.body) }
          </div>
          <div className={styles.rightContents}>
            <img alt="" src={ loadingUser ? "Loading.." : userData.profile_URL }
                 style={{
                   "width": "80px",
                   "height": "80px",
                   "object-fit": "cover",
                   "border-radius": "50%"
                 }}/>
            <div style={{
              "display": "flex",
              "align-items": "center"
            }}>
              <AiFillHeart size="20px" color="red"/>
              <Marginer horizontal="5px"/>
              <p style={{
                "font-size": "14px",
                "fontWeight": "300",
                "color": "grey"
              }}> { userData.hearts } Likes </p>
            </div>
            <p className={styles.infoText}> { loadingUser ? "Loading.." : userData.first_name + " " + userData.last_name } </p>
            <Marginer vertical="5px"/>                        
            <p style={{
              "font-size": "14px",
              "font-weight": "300",
              "color": "grey"
            }}> { loadingUser ? "Loading.." : userData.rank }</p>
            <Marginer vertical="20px"/>            
            <div className={styles.socialLinks}>
              <FaFacebook size="30px" color="blue"/>
              <Marginer horizontal="10px"/>            
              <FaInstagram size="30px" color="red"/>
            </div>            
          </div>
        </div>

      </main>

      <Footer/>
    </div>
  );

}
