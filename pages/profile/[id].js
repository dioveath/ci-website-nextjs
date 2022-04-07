import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getUser } from '../api/users/[userId].js';

import { FaFacebook, FaInstagram, FaDotCircle } from 'react-icons/fa';
import { AiFillHeart } from 'react-icons/ai';
import { ImProfile } from 'react-icons/im';
import { MdOutlineAccessTimeFilled } from 'react-icons/md';
import Navbar from '../../components/Navbar.js';
import styles from '../../styles/profile/profile.module.css';
import Marginer from '../../components/utils/Marginer.js';
import Footer from '../../components/footer/Footer.js';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';


export default function Profile(props){
  const router = useRouter();
  const { id } = router.query;

  const [userData, setUserData ] = useState({first_name: "null", last_name: "null"});
  const [loadingUser, setLoadingUser] = useState(true);
  const [isError, setError] = useState(false);

  const userJoinedDate = new Date(userData?.joinedAt?.seconds * 1000);

  useEffect(async () => {
    setLoadingUser(true);
    let { user, error } = await getUser(id);
    if(user !== undefined) {
      setUserData(user);
      setError(false);
    } else {
      setError(true);
    }
    setLoadingUser(false);
  }, [userData.first_name, userData.last_name]);

  let Roles = (props) => <p> No Roles </p>;
  if(userData.first_name != "null")
    Roles = (props) =>  Object.keys(userData.roles).map(key => <div key={key} className={styles.roleCard}> {key} </div> );

  return (
    <div>
      <Head>
        <title> Charicha Insitute </title>
        <meta name="description" content="Charicha Institute Blogs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar/>

      <main className={styles.main}>


        {/* <div className={styles.coverImg}> */}
        {/*   <Skeleton style={{"height": "200px", "z-index": "-10"}}/> */}
        {/* </div> */}
        <img alt="cover image" src="/landing_image.jpg" className={styles.coverImg}/>
        <div className={styles.profileContainer}>
          <div className={styles.basicInfoContainer}>
            <img alt="" src={ !isError ? userData.profile_URL : "/profile.jpg"} className={styles.profileImg}/>
            <Marginer horizontal="10px"/>
            <div className={styles.userTextInfoContainer}>
              <p className={styles.titleText}> { !isError ? userData.first_name + " " + userData.last_name : <Skeleton/>}</p>
              <p className={styles.subTitleText}> { userData?.rank } </p>
              <p className={styles.subTitleText}> Since { !isError ? userJoinedDate?.toDateString() : <Skeleton width={"80px"}/>}</p>
            </div>
          </div>
          <div className={styles.socialMediaLinks}>
            <p className={styles.subTitleText}> Social Media  </p>
            <Marginer horizontal="10px"/>            
            <FaFacebook size="24px" color="blue"/>
            <Marginer horizontal="10px"/>
            <FaInstagram size="24px" color="red"/>            
          </div>
          
        </div>

        <div className={styles.wrapContainer}>
          <div className={styles.statsContainer}>
            <div className={styles.levelXpContainer}>
              <p className={styles.titleText} style={{color: "greenyellow"}}> Gold </p>
              <p className={styles.subTitleText}> 314 XP </p>
            </div>
            <Marginer vertical="4px"/>          
            <div className={styles.levelBarContainer}>
              <div className={styles.levelHolder}></div>
              <div className={styles.completedLevel}></div>
            </div>
            <p className={styles.subTitleText}> To Platinum - 586 XP </p>
            <Marginer vertical="4px"/>                    
            <div className={styles.heartsContainer}>
              <AiFillHeart color="red"/>
              <Marginer horizontal="5px"/>
              <p className={styles.subTitleText}> {userData.hearts} Hearts </p> </div>
            <Marginer vertical="10px"/>
            <div className={styles.rolesContainer}>
              <Roles/>
            </div>
          </div>

          <div className={styles.statsContainer}>
            <div className={styles.rowCenterContainer}>
              <ImProfile size={20}/>
              <Marginer/>
              <p className={styles.subTitleText}> 100 Profile Visits </p>
            </div>
            <Marginer/>
            <div className={styles.rowCenterContainer}>
              <MdOutlineAccessTimeFilled size={20}/>
              <Marginer/>
              <p className={styles.subTitleText}>  1d 23h Time Spent </p>
            </div>            
          </div>

          <div className={styles.statsContainer}>
            <h2 className={styles.titleText}> Bio </h2>
            <p className={styles.subTitleText}>
              Typical pop culture geek. Coffee lover. Music enthusiast. Social media junkie. Extreme food advocate. Tv practitioner.
            </p>
          </div>          

        </div>    


      </main>

      <Footer/>
    </div>
  );
}
