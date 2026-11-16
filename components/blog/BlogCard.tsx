'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

import Image from 'next/image';
import styles from './blogcard.module.css';
import { BsFillCircleFill } from 'react-icons/bs';

import Marginer from '../../components/utils/Marginer';

import { extractSummary } from '../../lib/utils/summaryHelper';
import type { BlogListItem, UserData } from '../../types';

// Sanity editorial posts: author is inline and the body/summary come ready from
// the CMS, so there's no client-side user fetch.
function SanityBlogCard({ blog }: { blog: BlogListItem }) {
  const summary = blog.excerpt
    ? `${blog.excerpt.substring(0, 250)}`
    : '';

  return (
    <Link href={"/blog/" + blog.slug} passHref>
    <div className={'w-full max-w-sm p-10 bg-slategray/80 rounded-2xl flex flex-col items-start shadow-2xl cursor-pointer hover:bg-slategray transition-all'}>
      <div className={'flex justify-center items-center w-full'}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt={blog.title + ' thumbnail'} src={blog.coverImg} className='w-full h-[200px] object-cover'/>
      </div>

      <div className={styles["info-container"]}>
        <div className={styles["smallinfo"]}>
          <p className={styles["small-category-text"] + ' text-cheeseyellow mt-2'}> {blog.category || 'Tech'} </p>
          <div style={{ width: "10px"}}></div>
          <BsFillCircleFill size={4}/>
          <div style={{ width: "10px"}}></div>
          <p className={styles["small-publish-date"]}> { blog.publishedAt ? new Date(blog.publishedAt).toUTCString() : '' } </p>
        </div>

        <div className={'text-2xl font-semibold text-cheeseyellow'}> { blog.title }</div>
        <div className={styles["blog-summary"]}> { summary } </div>

        <div style={{height: "10px"}}></div>
      </div>

      <div className={styles["blog-author-container"]}>
        <div className={styles["author-profile"]}>
          <Image src={blog.authorImg ?? "/profile.jpg"} alt={blog.authorName + " profile picture"} width={40} height={40} className="object-cover"/>
        </div>
        <Marginer horizontal="10px"/>
        <div className={styles["blog-author-info-container"]}>
          <p className={styles["blog-author-name"] + ' text-aquamarine'}> { blog.authorName } </p>
          <Marginer vertical="2px"/>
          <p className={styles["blog-author-post"]}> Charicha Team </p>
        </div>
      </div>
    </div>
    </Link>
  );
}

// Firebase user articles: author lives in Firebase, fetched client-side by uid.
function FirebaseBlogCard({ blog }: { blog: BlogListItem }) {
  const summary = `${extractSummary(blog.body ?? null).substring(0, 250)}...`;

  const [userData, setUserData] = useState<Partial<UserData>>({ first_name: "null", last_name: "null" });
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      let res = await fetch('/api/users/' + blog.writtenBy);
      let user = await res.json();
      setUserData(user);
      setLoading(false);
    })();
  }, [blog.writtenBy]);

  return(
    <Link href={"/blog/" + blog.id} passHref>
    <div className={'w-full max-w-sm p-10 bg-slategray/80 rounded-2xl flex flex-col items-start shadow-2xl cursor-pointer hover:bg-slategray transition-all'}>
      <div className={'flex justify-center items-center w-full  bg-red-400'}>
        <div className='relative w-full h-[200px]'>
          <Image alt={blog.title + ' thumbnail'} src={blog.thumbnail?.downloadURL ?? '/upload.webp'} fill sizes='(max-width: 640px) 100vw, 384px' className='object-cover'/>
        </div>
      </div>


      <div className={styles["info-container"]}>
        <div className={styles["smallinfo"]}>
          <p className={styles["small-category-text"] + ' text-cheeseyellow mt-2'}> Tech </p>
          <div style={{ width: "10px"}}></div>
          <BsFillCircleFill size={4}/>
          <div style={{ width: "10px"}}></div>
          <p className={styles["small-publish-date"]}> { new Date(((blog.createdAt as { seconds?: number })?.seconds ?? 0) * 1000).toUTCString() } </p>
        </div>

        <div className={'text-2xl font-semibold text-cheeseyellow'}> { blog.title }</div>
        <div className={styles["blog-summary"]}> { summary } </div>

        <div style={{height: "10px"}}></div>




      </div>

        {
          isLoading ? "Loading...."
            : <div className={styles["blog-author-container"]}>
		<div className={styles["author-profile"]}>
                  <Image src={userData.profile_URL ?? "/profile.jpg"} alt={userData?.first_name + " Profile picture"} width={40} height={40} className="object-cover"/>
                </div>
                <Marginer horizontal="10px"/>
                <div className={styles["blog-author-info-container"]}>
                  <p className={styles["blog-author-name"] + ' text-aquamarine'}> { userData.first_name + " " + userData.last_name} </p>
                  <Marginer vertical="2px"/>
                  <p className={styles["blog-author-post"]}> { (userData as { rank?: string }).rank }</p>
                </div>
              </div>
        }
    </div>
    </Link>
  );

}

export default function BlogCard(props: { blog: BlogListItem }){
  const blog = props.blog;
  if (blog.source === 'sanity') return <SanityBlogCard blog={blog} />;
  return <FirebaseBlogCard blog={blog} />;
}
