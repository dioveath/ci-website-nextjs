import Link from 'next/link';
import Image from 'next/image';
import { BsFillCircleFill } from 'react-icons/bs';

import styles from './blogcard.module.css';
import Marginer from '../../components/utils/Marginer';
import type { BlogPost } from '@/lib/blog';

export default function BlogCard({ blog }: { blog: BlogPost }) {
  const summary = blog.summary.length > 250 ? `${blog.summary.substring(0, 250)}...` : blog.summary;

  return (
    <Link href={"/blog/" + blog.id} passHref>
    <div className={'w-full max-w-sm p-10 bg-slategray/80 rounded-2xl flex flex-col items-start shadow-2xl cursor-pointer hover:bg-slategray transition-all'}>
      <div className={'flex justify-center items-center w-full'}>
        <div className='relative w-full h-[200px]'>
          <Image alt={blog.title + ' thumbnail'} src={blog.coverImg ?? '/upload.webp'} fill sizes='(max-width: 640px) 100vw, 384px' className='object-cover'/>
        </div>
      </div>

      <div className={styles["info-container"]}>
        <div className={styles["smallinfo"]}>
          <p className={styles["small-category-text"] + ' text-cheeseyellow mt-2'}> {blog.category} </p>
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
          <Image src={blog.author.image ?? "/profile.jpg"} alt={blog.author.name + " profile picture"} width={40} height={40} className="object-cover"/>
        </div>
        <Marginer horizontal="10px"/>
        <div className={styles["blog-author-info-container"]}>
          <p className={styles["blog-author-name"] + ' text-aquamarine'}> { blog.author.name } </p>
          <Marginer vertical="2px"/>
          <p className={styles["blog-author-post"]}> { blog.author.title } </p>
        </div>
      </div>
    </div>
    </Link>
  );
}
