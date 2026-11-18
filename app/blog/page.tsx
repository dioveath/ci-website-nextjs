import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Charicha Institute',
  description: 'Charicha Institute Blogs'
};

// Merges live Firebase articles with Sanity posts on every request.
export const dynamic = 'force-dynamic';

import Navbar from '../../components/Navbar';

import styles from './blog.module.css';

import BlogCard from '../../components/blog/BlogCard';

import Footer from '../../components/footer/Footer';
import ParticlesBackground from '../../components/ParticlesBackground';
import { listPosts } from '@/lib/blog';


export default async function BlogPage(){
  const posts = await listPosts();

  return (
    <div className={styles.container}>


      <main className={'bg-linear-[-45deg] from-eggblue to-slategray pb-10'}>
        <Navbar path={'/blog'}/>
        <ParticlesBackground/>

	<div className='px-8 md:px-10 xl:px-20 2xl:px-48 mt-10'>
	  <h1 className='text-white text-2xl lg:text-4xl mb-2'> What&apos;s on the run?</h1>
          <h2 className='text-gray-400 text-lg lg:text-xl'> These are handpicked articles for you! </h2>          
        <div style={{height: "40px"}}></div>
        <div className={styles["cards-container"]}>
          {
            posts.map((blog) => <BlogCard key={`${blog.source}-${blog.id}`} blog={blog}/>)
          }
        </div>
          <div style={{height: "40px"}}></div>
        </div>    
      </main>

      <Footer/>

    </div>
  );

}

