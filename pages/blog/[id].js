import Image from 'next/image';
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
import { UserService } from '../../lib/service/UserService.js';
import Footer from '../../components/footer/Footer.js';
import { serialize } from 'bson';

export default function BlogPage({ blog: blogData, user: userData }){

  return (
    <div>
      <Head>
        <title> Charicha Insitute Blogs | { blogData?.title || "Empty Blog" } </title>
        <meta name="description" content={htmr(blogData?.body || "") + "..."} />
        {/* <meta property="og:image" itemProp="image" content={"landing_image.png"}/> */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar/>

      <main className={styles.main}>

        <div className={styles.authorDetailsContainer}>
          <div className={styles.authorLeftContainer}>
            <Image alt={userData?.first_name + " Profile"} src={ userData?.profile_URL || "/profile.jpg" } className={styles.profileImg} width="60px" height="60px" objectFit='cover'/>
            <Marginer horizontal="30px"/>                          
            <div className={styles.textDetails}>
              <p className={styles.infoText}> { userData?.first_name + " " + userData?.last_name }</p>
              <div className={styles.timeDetails}>
                <p className={styles.infoTextGrey}> { Date(blogData?.createdAt.seconds * 100).toLocaleString() } </p>
                <Marginer horizontal="10px"/>              
                <FaDotCircle size="5px"/>
                <Marginer horizontal="10px"/>
                <p className={styles.infoTextGrey}> { parseInt(blogData?.body.length / 450) + " min read"}</p>              
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
            { htmr(blogData?.body || "") }
          </div>
          <div className={styles.rightContents}>
            <Image alt=""
                   src={ userData?.profile_URL || "/profile.jpg" }
                   width="80px"
                   height="80px"
                   objectFit="cover"
                   className={styles.profileImg}/>
            <div style={{
              "display": "flex",
              "alignItems": "center"
            }}>
              <AiFillHeart size="20px" color="red"/>
              <Marginer horizontal="5px"/>
              <p style={{
                "fontSize": "14px",
                "fontWeight": "300",
                "color": "grey"
              }}> { userData?.hearts } Likes </p>
            </div>
            <p className={styles.infoText}> { userData?.first_name + " " + userData?.last_name } </p>
            <Marginer vertical="5px"/>                        
            <p style={{
              "fontSize": "14px",
              "fontWeight": "300",
              "color": "grey"
            }}> { userData?.rank }</p>
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


export async function getServerSideProps(context){
  const blog = await getPost(context.params.id);

  let user;
  if(blog)
    user = await UserService.getUser(blog.writtenBy);

  let { createdAt, ...serializableBlog } = blog;
  createdAt = createdAt.toDate().toString();

  let { joinedAt, ...serializableUser} = user.userData;
  joinedAt = joinedAt.toDate().toString();

  return {
    props: {
      blog: { ...serializableBlog, createdAt },
      user: { ...serializableUser, joinedAt }
    }
  }
}
