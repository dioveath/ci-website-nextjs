import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Charicha Institute',
  description: 'Charicha Institute Blogs'
};

// Merges live Firebase articles with Sanity posts on every request.
export const dynamic = 'force-dynamic';

import Navbar from '../../components/Navbar';

import styles from './blog.module.css';

import TopBlog from '../../components/blog/TopBlog';
import BlogCard from '../../components/blog/BlogCard';

import Footer from '../../components/footer/Footer';
import { ArticleService } from '../../lib/service/ArticleService';
import { getBlogPosts } from '../../lib/sanity/fetchers';
import ParticlesBackground from '../../components/ParticlesBackground';
import type { BlogListItem } from '../../types';


export default async function BlogPage(){

  // Merge the Firebase user articles with the Sanity editorial posts, then sort
  // newest-first. Each source is normalised with a `source` discriminator and a
  // `sortTime` (ms epoch) so BlogCard can render the right shape.
  const [fbRes, cmsRes] = await Promise.all([
    ArticleService.listPublishedArticles().catch(() => []),
    getBlogPosts(),
  ]);

  const firebasePosts = JSON.parse(JSON.stringify(fbRes || [])).map((a: BlogListItem) => ({
    ...a,
    source: 'firebase',
    sortTime: (a.createdAt as { seconds?: number } | null)?.seconds
      ? (a.createdAt as { seconds: number }).seconds * 1000
      : (a.createdAt ? new Date(a.createdAt as string | number | Date).getTime() : 0),
  }));

  const cmsPosts = (cmsRes || []).map((p: BlogListItem) => ({
    ...p,
    source: 'sanity',
    id: p.slug,
    sortTime: p.publishedAt ? new Date(p.publishedAt).getTime() : 0,
  }));

  const posts = [...firebasePosts, ...cmsPosts].sort((a: BlogListItem, b: BlogListItem) => (b.sortTime ?? 0) - (a.sortTime ?? 0));
  const props = { posts };


  return (
    <div className={styles.container}>


      <main className={'bg-linear-[-45deg] from-eggblue to-slategray pb-10'}>
        <Navbar path={'/blog'}/>
        <ParticlesBackground/>

	<div className='px-8 md:px-10 xl:px-20 2xl:px-48 mt-10'>
          {/* <TopBlog/> */}
	  <h1 className='text-white text-2xl lg:text-4xl mb-2'> What&apos;s on the run?</h1>
          <h2 className='text-gray-400 text-lg lg:text-xl'> These are handpicked articles for you! </h2>          
        <div style={{height: "40px"}}></div>
        <div className={styles["cards-container"]}>
          {
            (props.posts ?? []).map((blog: BlogListItem) => <BlogCard key={`${blog.source}-${blog.id}`} blog={blog}/>)
          }
        </div>
          <div style={{height: "40px"}}></div>
        </div>    
      </main>

      <Footer/>

    </div>
  );

}

