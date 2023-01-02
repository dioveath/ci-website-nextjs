import Link from 'next/link';
import { useState, useEffect } from 'react';

import Image from 'next/image';
import styles from './blogcard.module.css';
import { BsFillCircleFill } from 'react-icons/bs';

import Marginer from '../../components/utils/Marginer.js';
import parse from 'html-react-parser';

export default function BlogCard(props){

  const blog = props.blog;
  let result = blog.body.match(/<p>(.*?)<\/p>/g).map((val) => val.replace(/<\/?p>/g, ''));
  let summary = result.filter((res) => res[0].match(/[a-z]/i))[0] || 'Loading...';
  summary = summary.substr(0, 200) + '....';

  const [userData, setUserData] = useState({ first_name: "null", last_name: "null"});
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      let res = await fetch('api/users/' + blog.writtenBy);
      let user = await res.json();
      setUserData(user);
      setLoading(false);
    })();
  }, [blog.writtenBy]);

  return(
    <Link href={"/blog/" + blog.id} passHref>
    <div className={'w-full max-w-lg p-10 bg-slategray/80 rounded-2xl flex flex-col items-center shadow-2xl cursor-pointer hover:bg-slategray transition-all'}>
      <div className={''}>
        <img src={blog.imageURL} className={'h-40 object-cover'}/>
      </div>

      <Marginer vertical="10px"/>
      
      <div className={styles["info-container"]}>
        <div className={styles["smallinfo"]}>
          <p className={styles["small-category-text"] + ' text-cheeseyellow'}> Travels </p>
          <div style={{ width: "10px"}}></div>
          <BsFillCircleFill size={4}/>
          <div style={{ width: "10px"}}></div>          
          <p className={styles["small-publish-date"]}> { new Date(blog.createdAt.seconds * 1000).toUTCString() } </p>  
        </div>

        <div className={'text-2xl font-semibold text-cheeseyellow'}> { blog.title }</div>
        <div className={styles["blog-summary"]}> { parse(summary) } </div>
        <div style={{height: "10px"}}></div>


        {
          isLoading ? "Loading...."
            : <div className={styles["blog-author-container"]}>
		<div className={styles["author-profile"]}>
                  <Image src={userData.profile_URL} alt={userData?.first_name + " Profile picture"} layout="responsive" width={"40px"} height={"40px"} objectFit="cover"/>
                </div>
                <Marginer horizontal="10px"/>
                <div className={styles["blog-author-info-container"]}>
                  <p className={styles["blog-author-name"] + ' text-aquamarine'}> { userData.first_name + " " + userData.last_name} </p>
                  <Marginer vertical="2px"/>                  
                  <p className={styles["blog-author-post"]}> { userData.rank }</p>          
                </div>
              </div>
        }

      </div>      
    </div>
    </Link>
  );

}
