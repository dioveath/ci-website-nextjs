import Link from 'next/link';
import Image from 'next/image';
import styles from './footer.module.css';
import Marginer from '../../components/utils/Marginer.js';
import FooterLinkItem from './FooterLinkItem';

import { BsPhoneFill } from 'react-icons/bs';
import { MdEmail, MdLocationOn } from 'react-icons/md';

export default function Footer ({path}){
  return (<div className='bg-slategray'>
            <footer className={''}>
              <div className={'flex flex-wrap justify-between gap-2 px-48 py-10'}>

                <div className={'max-w-sm'}>
                  <Image src="/ci_logo_light_blue.png" alt="Charicha Institute Logo" width={'150px'} height={'50px'}/>
                  <p className={'text-sm text-white font-light'}>Charicha Institute helps interested students to learn and use their computer skills from basic
                    courses to advanced courses like programming in real world. Come join us and
                    grow.
                  </p>
                </div>

                <div className={'max-w-xs flex flex-col'}>
                  <h3 className='text-white uppercase mb-2'> Menu </h3>
                  <ul className={'flex flex-col gap-2'}>
		    <li> <FooterLinkItem label={'Home'} to='/' path={path}/> </li>
		    <li> <FooterLinkItem label={'Courses'} to='/courses' path={path}/> </li>
		    <li> <FooterLinkItem label={'Services'} to='/services' path={path}/> </li>
		    <li> <FooterLinkItem label={'Blog'} to='/blog' path={path}/> </li>
                  </ul>
                </div>
                <div className={'max-w-xs flex flex-col'}>
                  <h3 className='text-white uppercase mb-2'>Partner Links</h3>
                  <ul className={'flex flex-col gap-2'}>
                    <li><a className='text-white hover:text-aquamarine' href="#">Charicha Productions</a></li>
                    <li><a className='text-white hover:text-aquamarine' href="https://chcgaming.azurewebsites.net">Charicha Gaming</a></li>
                  </ul>
                </div>

                <div className={'flex flex-col gap-2'}>
                  <h3 className='text-white uppercase'> Contact Us </h3>
                  <div className={'flex items-center gap-2 text-white'}>
                    <BsPhoneFill color="greenyellow"/> +977 981-7388966
                  </div>
                  <div className={'flex items-center gap-2 text-white'}>
                    <MdEmail color="#39A1FF"/> charichainstitute@gmail.com
                  </div>
                  <div className={'flex items-center gap-2 text-white'}>
                    <MdLocationOn color="red"/> Belbari - 11, Morang
                  </div>
                </div>
              </div>

            </footer>
            <div className={styles.copyright}>
              <p>Charicha Institute &copy; All Rights Reserved</p>
            </div>            
          </div>          
         );
}
