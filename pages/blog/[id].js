import Image from 'next/image';
import Head from 'next/head';
import Navbar from '../../components/Navbar.js';

import { FaFacebook, FaInstagram, FaDotCircle } from 'react-icons/fa';
import { AiFillHeart } from 'react-icons/ai';

import styles from './blogpage.module.css';
import EditorJSRenderer from '../../components/EditorJSRenderer';

import { getPost } from '../api/posts/[postId].js';
import { UserService } from '../../lib/service/UserService.js';
import Footer from '../../components/footer/Footer.js';
import { serialize } from 'bson';

export default function BlogPage({ blog: blogData, user: userData }){

  return (
    <div>
      <Head>
        <title> Charicha Insitute Blogs | { blogData?.title || "Empty Blog" } </title>
        <meta name="description" />
        {/* <meta property="og:image" itemProp="image" content={"landing_image.png"}/> */}
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <main className={'bg-riverbed pb-10'}>
        <Navbar/>

	<div className='px-8 md:px-10 xl:px-20 2xl:px-48 mt-10 text-white'>
        
        <div className={'flex flex-col gap-2'}>
          <div className={'flex gap-2 xl:gap-4 items-center'}>
            <Image alt={userData?.first_name + " Profile"} src={ userData?.profile_URL || "/profile.jpg" } className={styles.profileImg + ' shadow-md'} width="60px" height="60px" objectFit='cover'/>
            <div className={''}>
              <p className={styles.infoText}> { userData?.first_name + " " + userData?.last_name }</p>
              <div className={'flex items-center gap-2 text-xs lg:text-sm font-extralight text-cheeseyellow'}>
                <p className={''}> { new Date(blogData.createdAt).toUTCString() } </p>
                <FaDotCircle size="5px"/>
                <p className={styles.infoTextGrey}> { parseInt(blogData?.body.length / 1000) + " min read"}</p>              
              </div>
            </div>
          </div>

          <div className={'flex gap-4'}>
            <FaFacebook className='text-3xl text-white/90 hover:text-white cursor-pointer'/>
            <FaInstagram className='text-3xl text-white/90 hover:text-white cursor-pointer'/>
          </div>
        </div>

        <div className={styles.contentContainer}>
          <div className={styles.content}>
            <EditorJSRenderer data={blogData.body}/>
            {/* { htmr(blogData?.body || "") } */}
          </div>
          <div className={styles.rightContents}>
            <Image alt={userData.first_name + "'s Profile Picture"}
                   src={ userData?.profile_URL || "/profile.jpg" }
                   width="80px"
                   height="80px"
                   objectFit="cover"
                   className='rounded-full shadow-lg'/>
            <div className='flex items-center gap-2'>
              <AiFillHeart className='text-3xl text-red-600'/>
              <p className='text-sm font-light text-white'> { userData?.hearts } Likes </p>
            </div>
            <p className={styles.infoText}> { userData?.first_name + " " + userData?.last_name } </p>
            <p className={'font-light text-cheeseyellow'}> { userData?.rank }</p>
            <div className={'flex gap-2 mt-2'}>
              <FaFacebook className='text-white text-3xl'/>
              <FaInstagram className='text-white text-3xl'/>
            </div>            
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

  let { joined_at, ...serializableUser} = user.userData;
  const joinedAt = new Date(joined_at).toString();

  return {
    props: {
      blog: { ...serializableBlog, createdAt },
      user: { ...serializableUser, joinedAt }
    }
  };
}
