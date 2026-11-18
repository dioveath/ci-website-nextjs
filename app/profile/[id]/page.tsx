import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Charicha Institute',
  description: 'Charicha Institute Profile'
};

import Link from 'next/link';
import Image from 'next/image';

import { FaFacebook, FaInstagram } from "react-icons/fa";
import { AiFillHeart } from "react-icons/ai";
import { ImProfile } from "react-icons/im";
import { BsRecordCircleFill } from "react-icons/bs";

import { MdOutlineAccessTimeFilled } from "react-icons/md";
import Navbar from "../../../components/Navbar";
import styles from "../../../styles/profile/profile.module.css";
import Marginer from "../../../components/utils/Marginer";
import Footer from "../../../components/footer/Footer";

import { coursesList } from "../../../components/course/coursesList";

import type { UserData } from '../../../types';
import { getUser } from '@/lib/users';

function UserNotFound() {
  return (
    <div className='min-h-[85vh] h-full w-full flex justify-center items-center'>
      <div>
        <p className='text-[40px] text-white'> ERROR 404 : USER NOT FOUND </p>
        <Link href='/' className='text-white font-light hover:text-aquamarine'> Go to Home </Link>
      </div>
    </div>
  );
}

// Server-rendered, so there is no loading state: by the time this renders the
// user has either been fetched or not found.
function ProfileView({ userData }: { userData: UserData }) {
  const userJoinedDate = new Date(userData.joined_at ?? 0);
  // roles is a { roleName: boolean } map, not an array.
  const activeRoles = Object.keys(userData.roles ?? {}).filter((role) => userData.roles[role]);
  const enrolledCourseIds = Object.keys(userData.courses ?? {});

  const coverImage = (
    <Image
      alt="cover image"
      src="/landing_image.jpg"
      className={`${styles.coverImg} w-full h-auto`}
      width={1200}
      height={200}
    />
  );

  const profileImage =
    userData.profile_URL == "" ? (
      <div className={styles.profileTextImg}>
        <p> {userData.first_name?.[0]} </p>{" "}
      </div>
    ) : (
      <Image
        alt=""
        src={userData.profile_URL ?? "/profile.jpg"}
        className={styles.profileImg}
        width={200}
        height={200}
      />
    );

  const userInfo = (
    <div className={styles.userTextInfoContainer}>
      <p className={styles.titleText}>
        {userData.first_name + " " + userData.last_name}
      </p>
      <p className={styles.subTitleText}> {(userData as { rank?: string }).rank} </p>
      <p className={styles.subTitleText}>
        Since
        {userJoinedDate.toDateString()}
      </p>
    </div>
  );

  const roles = activeRoles.length ? (
    activeRoles.map((role) => (
      <div key={role} className={styles.roleCard}>
        {role}
      </div>
    ))
  ) : (
    <p>No Roles</p>
  );

  const statsInfo = (
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
          {userData.hearts} Hearts{" "}
        </p>{" "}
      </div>
      <Marginer vertical="10px" />
      <div className={styles.rolesContainer}>{roles}</div>
    </div>
  );

  const coursesEnrolled = (
    <div>
      {enrolledCourseIds.map((courseId) => (
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
            {coursesList[Number(courseId)]?.title}
          </p>
        </div>
      ))}
    </div>
  );

  const secondaryStatsInfo = (
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
        {coursesEnrolled}
      </div>
    </div>
  );

  const bioInfo = (
    <div className={styles.statsContainer}>
      <h2 className={styles.titleText}> Bio </h2>
      <p className={styles.subTitleText}>
        Typical pop culture geek. Coffee lover. Music enthusiast. Social media
        junkie. Extreme food advocate. Tv practitioner.
      </p>
    </div>
  );

  return (
    <>
      {coverImage}
      <div className={styles.profileContainer}>
        <div className={styles.basicInfoContainer}>
          {profileImage}
          <Marginer horizontal="10px" />
          {userInfo}
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
        {statsInfo}
        {secondaryStatsInfo}
        {bioInfo}
      </div>
    </>
  );
}

// getStaticPaths returned no paths with fallback:"blocking"; the App Router
// equivalent is an empty generateStaticParams with dynamicParams left on.
export async function generateStaticParams() {
  return [];
}

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Resolve the data first: JSX built inside a try/catch would not have its
  // render errors caught anyway, and React lint rightly flags that.
  let userData: UserData | null = null;
  try {
    userData = await getUser(id);
  } catch {
    userData = null;
  }

  return (
    <div>
      <main className={'bg-linear-[-45deg] from-eggblue to-slategray'}>
        <Navbar />
        {userData ? <ProfileView userData={userData} /> : <UserNotFound />}
      </main>
      <Footer />
    </div>
  );
}
