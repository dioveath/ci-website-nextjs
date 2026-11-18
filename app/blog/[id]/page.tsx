import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticle(id);
  const cmsPost = article ? null : await getBlogPostBySlug(id);
  const post = article ?? cmsPost;

  const title = `Charicha Institute Blogs | ${post?.title ?? 'Empty Blog'}`;
  if (!post) return { title, description: 'Charicha Institute Blogs' };

  // Firebase articles have no excerpt, so summarise the body instead. A body
  // that fails to parse must not take the whole page down with it.
  let summary: string = cmsPost?.excerpt ?? '';
  if (article) {
    try { summary = articleSummary(article.body).trim(); } catch { summary = ''; }
  }
  const description = summary && summary !== '...(empty)'
    ? (summary.length > 200 ? summary.slice(0, 197).trimEnd() + '...' : summary)
    : 'Charicha Institute Blogs';
  const image: string | undefined = article ? article.thumbnail?.downloadURL : cmsPost?.coverImg ?? undefined;

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
      ...(image ? { images: [{ url: image, alt: post.title }] } : {}),
      ...(cmsPost?.publishedAt ? { publishedTime: cmsPost.publishedAt } : {})
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

import { getBlogPostBySlug } from '../../../lib/sanity/fetchers';
import { articleSummary } from '../../../lib/editor/serialize';
import Footer from '../../../components/footer/Footer';
import type { BlogListItem, UserData } from '../../../types';
import { getUser } from '@/lib/users';
import { getArticle } from '@/lib/articles';

// Firebase user article: author comes from the Firebase user record.
function FirebaseBlogPage({ blog: blogData, user: userData }: { blog: BlogListItem; user?: (Partial<UserData> & { joinedAt?: string | null }) | null }){
  return (
    <div>


      <main className={'bg-linear-[-45deg] from-eggblue to-slategray pb-10'}>
        <Navbar/>

	<div className='px-8 md:px-10 xl:px-20 2xl:px-48 mt-10 text-white'>

	<header>
	  <h1 className='text-2xl mb-4 lg:text-4xl text-cheeseyellow'> { blogData.title } </h1>
        </header>

        <div className={'flex flex-col gap-2'}>
          <div className={'flex gap-2 xl:gap-4 items-center'}>
            <Image alt={userData?.first_name + " Profile"} src={ userData?.profile_URL || "/profile.jpg" } className={styles.profileImg + ' shadow-md'} width={60} height={60}/>
            <div className={''}>
              <p className={styles.infoText}> { userData?.first_name + " " + userData?.last_name }</p>
              <div className={'flex items-center gap-2 text-xs lg:text-sm font-extralight text-cheeseyellow'}>
                <p className={''}> { new Date(blogData.createdAt as string | number | Date).toUTCString() } </p>
                <FaDotCircle size="5px"/>
                <p className={styles.infoTextGrey}> { Math.floor((blogData?.body?.length ?? 0) / 1000) + " min read"}</p>
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
            <ArticleRenderer data={blogData.body}/>
          </div>
          <div className={styles.rightContents}>
            <Image alt={userData?.first_name + "'s Profile Picture"}
                   src={ userData?.profile_URL || "/profile.jpg" }
                   width={80}
                   height={80}
                   className='rounded-full shadow-lg'/>
            <div className='flex items-center gap-2'>
              <AiFillHeart className='text-3xl text-red-600'/>
              <p className='text-sm font-light text-white'> { userData?.hearts } Likes </p>
            </div>
            <p className={styles.infoText}> { userData?.first_name + " " + userData?.last_name } </p>
            <p className={'font-light text-cheeseyellow'}> { (userData as { rank?: string } | null | undefined)?.rank }</p>
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
function SanityBlogPage({ blog }: { blog: BlogListItem }){
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
          <img alt={blog.authorName + " profile"} src={blog.authorImg} className={styles.profileImg + ' shadow-md'} width="60" height="60" style={{ objectFit: 'cover' }}/>
          <div>
            <p className={styles.infoText}> { blog.authorName }</p>
            <div className={'flex items-center gap-2 text-xs lg:text-sm font-extralight text-cheeseyellow'}>
              <p> { blog.publishedAt ? new Date(blog.publishedAt).toUTCString() : "" } </p>
              <FaDotCircle size="5px"/>
              <p className={styles.infoTextGrey}> { blog.category || 'Tech' } </p>
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

function BlogView({ blog, user }: { blog: BlogListItem; user?: (Partial<UserData> & { joinedAt?: string | null }) | null }){
  if (blog?.source === 'sanity') return <SanityBlogPage blog={blog}/>;
  return <FirebaseBlogPage blog={blog} user={user}/>;
}




export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 1) Firebase user article, matched by document id.
  const fbBlog = await getArticle(id);
  if (fbBlog) {
    // Older articles can lack writtenBy; doc() throws on an undefined path
    // segment, so skip the author lookup rather than crash the page.
    const user = fbBlog.writtenBy ? await getUser(fbBlog.writtenBy) : null;

    const { createdAt, ...serializableBlog } = fbBlog;
    const createdAtString = (createdAt as { toDate?: () => Date })?.toDate
      ? (createdAt as { toDate: () => Date }).toDate().toString()
      : new Date(createdAt as string | number | Date).toString();

    let serializableUser = null;
    if (user) {
      const { joined_at, ...rest } = user;
      serializableUser = { ...rest, joinedAt: joined_at ? new Date(joined_at).toString() : null };
    }

    return (
      <BlogView
        blog={{ ...serializableBlog, source: 'firebase', createdAt: createdAtString } as BlogListItem}
        user={serializableUser}
      />
    );
  }

  // 2) Sanity editorial post, matched by slug.
  const cmsPost = await getBlogPostBySlug(id);
  if (cmsPost) {
    return <BlogView blog={{ ...cmsPost, source: 'sanity' } as BlogListItem} user={null} />;
  }

  notFound();
}
