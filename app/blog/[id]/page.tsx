import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);

  const title = `Charicha Institute Blogs | ${post?.title ?? 'Empty Blog'}`;
  if (!post) return { title, description: 'Charicha Institute Blogs' };

  const summary = post.summary.trim();
  const description = summary
    ? (summary.length > 200 ? summary.slice(0, 197).trimEnd() + '...' : summary)
    : 'Charicha Institute Blogs';

  // Link previews (Facebook, WhatsApp, LinkedIn...). Relative URLs resolve
  // against metadataBase in the root layout.
  return {
    title,
    description,
    openGraph: {
      type: 'article',
      title: post.title,
      description,
      url: `/blog/${id}`,
      siteName: 'Charicha Institute',
      locale: 'en_GB',
      ...(post.coverImg ? { images: [{ url: post.coverImg, alt: post.title }] } : {}),
      ...(post.source === 'sanity' && post.publishedAt ? { publishedTime: post.publishedAt } : {})
    }
  };
}

export const dynamic = 'force-dynamic';

import Image from 'next/image';
import Navbar from '../../../components/Navbar';

import { FaFacebook, FaInstagram, FaDotCircle } from 'react-icons/fa';
import { AiFillHeart } from 'react-icons/ai';

import styles from './blogpage.module.css';
import ArticleRenderer from '../../../components/ArticleRenderer';
import PortableBody from '../../../components/blog/PortableBody';

import Footer from '../../../components/footer/Footer';
import { getPost, type BlogPostDetail } from '@/lib/blog';

type FirebasePost = Extract<BlogPostDetail, { source: 'firebase' }>;
type SanityPost = Extract<BlogPostDetail, { source: 'sanity' }>;

// Firebase user article: author comes from the Firebase user record.
function FirebaseBlogPage({ blog }: { blog: FirebasePost }){
  return (
    <div>


      <main className={'bg-linear-[-45deg] from-eggblue to-slategray pb-10'}>
        <Navbar/>

	<div className='px-8 md:px-10 xl:px-20 2xl:px-48 mt-10 text-white'>

	<header>
	  <h1 className='text-2xl mb-4 lg:text-4xl text-cheeseyellow'> { blog.title } </h1>
        </header>

        <div className={'flex flex-col gap-2'}>
          <div className={'flex gap-2 xl:gap-4 items-center'}>
            <Image alt={blog.author.name + " Profile"} src={ blog.author.image || "/profile.jpg" } className={styles.profileImg + ' shadow-md'} width={60} height={60}/>
            <div className={''}>
              <p className={styles.infoText}> { blog.author.name }</p>
              <div className={'flex items-center gap-2 text-xs lg:text-sm font-extralight text-cheeseyellow'}>
                <p className={''}> { blog.publishedAt ? new Date(blog.publishedAt).toUTCString() : '' } </p>
                <FaDotCircle size="5px"/>
                <p className={styles.infoTextGrey}> { Math.floor(blog.body.length / 1000) + " min read"}</p>
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
            <ArticleRenderer data={blog.body}/>
          </div>
          <div className={styles.rightContents}>
            <Image alt={blog.author.name + "'s Profile Picture"}
                   src={ blog.author.image || "/profile.jpg" }
                   width={80}
                   height={80}
                   className='rounded-full shadow-lg'/>
            <div className='flex items-center gap-2'>
              <AiFillHeart className='text-3xl text-red-600'/>
              <p className='text-sm font-light text-white'> { blog.authorHearts } Likes </p>
            </div>
            <p className={styles.infoText}> { blog.author.name } </p>
            <p className={'font-light text-cheeseyellow'}> { blog.author.title }</p>
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

// Sanity editorial post: inline author, Portable Text body, no hearts/likes.
function SanityBlogPage({ blog }: { blog: SanityPost }){
  return (
    <div>

      <main className={'bg-linear-[-45deg] from-eggblue to-slategray pb-10'}>
        <Navbar/>

	<div className='px-8 md:px-10 xl:px-20 2xl:px-48 mt-10 text-white'>

	<header>
	  <h1 className='text-2xl mb-4 lg:text-4xl text-cheeseyellow'> { blog.title } </h1>
        </header>

        <div className={'flex gap-2 xl:gap-4 items-center mb-6'}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt={blog.author.name + " profile"} src={blog.author.image ?? undefined} className={styles.profileImg + ' shadow-md'} width="60" height="60" style={{ objectFit: 'cover' }}/>
          <div>
            <p className={styles.infoText}> { blog.author.name }</p>
            <div className={'flex items-center gap-2 text-xs lg:text-sm font-extralight text-cheeseyellow'}>
              <p> { blog.publishedAt ? new Date(blog.publishedAt).toUTCString() : "" } </p>
              <FaDotCircle size="5px"/>
              <p className={styles.infoTextGrey}> { blog.category } </p>
            </div>
          </div>
        </div>

        {blog.coverImg && (
          <div className='mb-6'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt={blog.title + ' cover'} src={blog.coverImg} className='w-full max-h-[420px] rounded-2xl shadow-lg' style={{ objectFit: 'cover' }}/>
          </div>
        )}

        <div className={styles.contentContainer}>
          <div className={styles.content}>
            <PortableBody value={blog.body}/>
          </div>
        </div>
            </div>

      </main>

      <Footer/>
    </div>
  );
}

export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();
  return post.source === 'sanity' ? <SanityBlogPage blog={post}/> : <FirebaseBlogPage blog={post}/>;
}
