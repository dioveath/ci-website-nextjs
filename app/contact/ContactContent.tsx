'use client';

import Navbar from '../../components/Navbar';

import styles from '../../styles/contact/Contact.module.css';
import { AiFillPhone } from 'react-icons/ai';
import { ImLocation } from 'react-icons/im';

import Footer from '../../components/footer/Footer';
import PrimaryButton from '../../components/buttons/PrimaryButton';


import { getContactPage } from '../../lib/sanity/fetchers';
import { contactPageFallback } from '../../lib/sanity/fallbacks';
import ParticlesBackground from '../../components/ParticlesBackground';

export default function ContactContent({ page = contactPageFallback }: { page?: typeof contactPageFallback }){
  const contact = page.contact || {};
  return (
    <div className={styles.container}>


      <main className={'bg-linear-[-45deg] from-eggblue to-slategray pb-10'}>
        <Navbar path='/contact'/>
        <ParticlesBackground/>
	<div className='px-8 md:px-10 xl:px-20 2xl:px-48 mt-10'>
          <div className='px-8'>
            <h2 className='text-2xl text-white'> {page.title} </h2>
            <p className='text-base text-white font-light'> {page.description} </p>
          </div>


          <div className={'flex flex-wrap gap-10 mt-10 justify-center'}>
          <form className={'w-full flex-1 flex flex-col gap-8 p-4 xl:p-12 bg-slategray rounded-2xl shadow-lg'}>
	    <p className='text-2xl text-white font-light border-b-2 border-b-cheeseyellow'> Contact Details </p>
            <input name="" type="text" className={styles["form-input"]} placeholder="First Name"/>
            <input name="" type="text"  className={styles["form-input"]} placeholder="Last Name"/>
            <input name="" type="email" className={styles["form-input"]} placeholder="Email"/>
            <input name="" type="number"  className={styles["form-input"]} placeholder="Phone Number"/>

            <textarea cols={30} id="" name="" rows={10} className={styles["text-area"]} placeholder="Your message here..."> </textarea>
            <PrimaryButton text="Submit" onClick={()=> {
              console.log("something");
            }}/>
          </form>
          <div className={'flex-1 flex flex-col gap-4'}>
            <h2 className='text-2xl text-white'> Charicha Institute </h2>
            <p className={'text-white text-sm font-light'}> We look forward to hearing from you and helping you learn more about the exciting opportunities available at our computer institute. </p>

	    <div className='flex flex-col gap-2'>
              <p className={'flex text-white text-sm font-light items-center gap-2'}> <AiFillPhone color="blue"/>  {contact.phone} </p>
              <p className={'flex text-white text-sm font-light items-center gap-2'}> <ImLocation color="red"/> {contact.address} </p>
            </div>

	    <div className='w-full h-full rounded-2xl overflow-clip shadow-md'>
              <iframe src={page.mapEmbedUrl} width="100%" height="100%" style={{'border': 0}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>

          </div>
        </div>
        </div>

      </main>

      <Footer/>

    </div>

  );

}

