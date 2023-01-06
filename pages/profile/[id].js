import Head from "next/head";
import Link from 'next/link';

import { FaFacebook, FaInstagram, FaDotCircle } from "react-icons/fa";
import { AiFillHeart } from "react-icons/ai";
import { ImProfile } from "react-icons/im";
import { BsRecordCircleFill } from "react-icons/bs";

import { MdOutlineAccessTimeFilled } from "react-icons/md";
import Navbar from "../../components/Navbar.js";
import styles from "../../styles/profile/profile.module.css";
import Marginer from "../../components/utils/Marginer.js";
import Footer from "../../components/footer/Footer.js";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { coursesList } from "../../components/course/coursesList.js";

import { UserService } from '../../lib/service/UserService';

export default function Profile({ userData, error }) {
  const loadingUser = !userData;
  const isError = error;
  const userJoinedDate = new Date(userData?.joined_at);

  const Roles = (props) =>
    loadingUser ? (
      <Skeleton width={20} />
    ) : userData?.roles?.length ? (
      Object.keys(userData?.roles).map((key) => (
        <div key={key} className={styles.roleCard}>
          {key}
        </div>
      ))
    ) : (
      <p>No Roles</p>
    );

  const CoverImage = (props) =>
    loadingUser ? (
      <div className={styles.coverImg}>
        <Skeleton style={{ height: "200px", zIndex: "-10" }} />
      </div>
    ) : (
      <img
        alt="cover image"
        src="/landing_image.jpg"
        className={styles.coverImg}
      />
    );

  const ProfileImage = (props) =>
    loadingUser ? (
      <Skeleton circle={true} width={100} height={100} />
    ) : userData?.photoURL == "" ? (
      <div className={styles.profileTextImg}>
        {" "}
        <p> {userData?.fisrt_name[0]} </p>{" "}
      </div>
    ) : (
      <img
        alt=""
        src={userData?.photoURL ?? "/profile.jpg"}
        className={styles.profileImg}
      />
    );

  const UserInfo = (props) =>
    loadingUser ? (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Skeleton count={1} width={320} height={20} />
        <Marginer />
        <Skeleton count={1} width={320} height={15} />
      </div>
    ) : (
      <div className={styles.userTextInfoContainer}>
        <p className={styles.titleText}>
          {!isError ? (
            userData?.first_name + " " + userData?.last_name
          ) : (
            <Skeleton />
          )}
        </p>
        <p className={styles.subTitleText}> {userData?.rank} </p>
        <p className={styles.subTitleText}>
          Since
          {!isError ? (
            userJoinedDate?.toDateString()
          ) : (
            <Skeleton width={"80px"} />
          )}
        </p>
      </div>
    );

  const StatsInfo = (props) =>
    loadingUser ? (
      <Skeleton count={4} width={320} style={{ marginBottom: "10px" }} />
    ) : (
      <div className={styles.statsContainer}>
        <div className={styles.levelXpContainer}>
          <p className={styles.titleText} style={{ color: "greenyellow" }}>
            {" "}
            Gold{" "}
          </p>
          <p className={styles.subTitleText}> 314 XP </p>
        </div>
        <Marginer vertical="4px" />
        <div className={styles.levelBarContainer}>
          <div className={styles.levelHolder}></div>
          <div className={styles.completedLevel}></div>
        </div>
        <p className={styles.subTitleText}> To Platinum - 586 XP </p>
        <Marginer vertical="4px" />
        <div className={styles.heartsContainer}>
          <AiFillHeart color="red" />
          <Marginer horizontal="5px" />
          <p className={styles.subTitleText}>
            {" "}
            {userData?.hearts} Hearts{" "}
          </p>{" "}
        </div>
        <Marginer vertical="10px" />
        <div className={styles.rolesContainer}>
          <Roles />
        </div>
      </div>
    );

  const CoursesEnrolled = (props) => {
    return loadingUser ? (
      <Skeleton count={3} width={320} />
    ) : (
      <div>
        {Object.keys(userData?.courses).map((courseId) => {
          return (
            <div
              key={courseId}
              className={styles.roleCard}
              style={{ marginBottom: "10px" }}
            >
              <p
                className={styles.subTitleText}
                style={{
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <BsRecordCircleFill />
                <Marginer />
                {coursesList[courseId].title}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  const SecondaryStatsInfo = (props) =>
    loadingUser ? (
      <Skeleton count={3} width={320} style={{ marginBottom: "10px" }} />
    ) : (
      <div className={styles.statsContainer}>
        <div className={styles.rowCenterContainer}>
          <ImProfile size={20} />
          <Marginer />
          <p className={styles.subTitleText}> 100 Profile Visits </p>
        </div>
        <Marginer />
        <div className={styles.rowCenterContainer}>
          <MdOutlineAccessTimeFilled size={20} />
          <Marginer />
          <p className={styles.subTitleText}> 1d 23h Time Spent </p>
        </div>
        <Marginer />
        <div>
          <p className={styles.titleText}> Courses Enrolled </p>
          <Marginer />
          <CoursesEnrolled />
        </div>
      </div>
    );

  const BioInfo = (props) =>
    loadingUser ? (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Skeleton count={1} width={320} style={{ marginBottom: "10px" }} />
        <Skeleton count={1} width={320} height={100} />
      </div>
    ) : (
      <div className={styles.statsContainer}>
        <h2 className={styles.titleText}> Bio </h2>
        <p className={styles.subTitleText}>
          Typical pop culture geek. Coffee lover. Music enthusiast. Social media
          junkie. Extreme food advocate. Tv practitioner.
        </p>
      </div>
    );

  return (
    <div>
      <Head>
        <title> Charicha Insitute </title>
        <meta name="description" content="Charicha Institute Blogs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <main className={'bg-gradient-[-45deg] from-eggblue to-slategray'}>
        <Navbar />
        {isError && <div className='min-h-[85vh] h-full w-full flex justify-center items-center'>
		      <div>
		        <p className='text-[40px] text-white'> ERROR 404 : USER NOT FOUND </p>
                        <Link href='/' className='text-white font-light hover:text-aquamarine'> Go to Home </Link>                        
                      </div>
                    </div>}
        {!isError && (
          <>
            <CoverImage />
            <div className={styles.profileContainer}>
              <div className={styles.basicInfoContainer}>
                <ProfileImage />
                <Marginer horizontal="10px" />
                <UserInfo />
              </div>
              <div className={styles.socialMediaLinks}>
                <p className={styles.subTitleText}> Social Media </p>
                <Marginer horizontal="10px" />
                <FaFacebook size="24px" color="blue" />
                <Marginer horizontal="10px" />
                <FaInstagram size="24px" color="red" />
              </div>
            </div>

            <div className={styles.wrapContainer}>
              <StatsInfo />
              <SecondaryStatsInfo />
              <BioInfo />
            </div>

            {/* <Editor/> */}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}


export async function getStaticProps(context){
  try {
    const user = await UserService.getUser(context.params?.id);
    return {
      props: {
        userData: user.userData
      }
    };    
  } catch(e){
    return {
      props: {
        userData: null
      }
    };
  }

}


export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking"
  };
}
