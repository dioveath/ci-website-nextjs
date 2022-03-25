import { useState, useEffect } from 'react';

import Image from 'next/image';
import styles from './blogcard.module.css';
import { BsFillCircleFill } from 'react-icons/bs';

export default function BlogCard(props){

  const blog = props.blog;
  let summary = "Summary";
  blog.body.replace(/<p>(.*?)<\/p>/g, function () {
    // arguments[0] is the entire match
    summary = arguments[0];
  });

  const [userData, setUserData] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(async () => {
    setLoading(true);
    let res = await fetch('api/users/' + blog.writtenBy);
    let user = await res.json();
    setUserData(user);
    setLoading(userData == null);
  }, []);

  return(
    <div className={styles["blog-container"]}>
      <div className={styles["image-container"]}>
        <img src={blog.imageURL} className={styles["blog-image"]}/>
      </div>

      <div className={styles["info-container"]}>
        <div className={styles["smallinfo"]}>
          <p className={styles["small-category-text"]}> Travels </p>
          <div style={{ width: "10px"}}></div>
          <BsFillCircleFill size={4}/>
          <div style={{ width: "10px"}}></div>          
          <p className={styles["small-publish-date"]}> { Date(blog.createdAt.seconds * 100).toLocaleString() } </p>  
        </div>

        <div className={styles["blog-title"]}> { blog.title }</div>
        <div className={styles["blog-summary"]}> Pharetra pharetra, massa massa ultricies mi, quis hendrerit dolor magna eget est lorem ipsum dolor. Maecenas volutpat blandit aliquam etiam erat velit, scelerisque in dictum non, consectetur a erat nam. </div>
        <div style={{height: "10px"}}></div>
        {
          isLoading ? "Loading...."
            : <div className={styles["blog-author-container"]}>
                <img src={userData.profile_URL} className={styles["author-profile"]}/>
                <div style={{width: "10px"}}></div>          
                <div className={styles["blog-author-info-container"]}>
                  <p className={styles["blog-author-name"]}> { userData.first_name + " " + userData.last_name} </p>        
                  <p className={styles["blog-author-post"]}> { userData.rank }</p>          
                </div>
              </div>
        }

      </div>      
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

