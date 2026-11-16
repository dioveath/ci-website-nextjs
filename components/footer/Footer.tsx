'use client';

import Image from 'next/image';
import styles from './footer.module.css';
import FooterLinkItem from './FooterLinkItem';

import { BsPhoneFill } from 'react-icons/bs';
import { MdEmail, MdLocationOn } from 'react-icons/md';

import { useSiteSettings } from '../../lib/sanity/useSiteSettings';

export default function Footer ({ path }: { path?: string }){
  const settings = useSiteSettings();
  const contact = settings.contact || {};

  return (<div className='bg-slategray'>
            <footer className={''}>
              <div className={'flex flex-wrap justify-between gap-2 px-8 md:px-10 xl:px-20 2xl:px-48 py-10'}>

                <div className={'max-w-sm'}>
                  <Image src="/ci_logo_light_blue.png" alt="Charicha Institute Logo" width={150} height={50}/>
                  <p className={'text-sm text-white font-light'}>{settings.footerDescription}</p>
                </div>

                <div className={'max-w-xs flex flex-col'}>
                  <h3 className='text-white uppercase mb-2'> Menu </h3>
                  <ul className={'flex flex-col gap-2'}>
                    {(settings.footerLinks || []).map((link) => (
                      <li key={link.href + link.label}>
                        <FooterLinkItem label={link.label} to={link.href} path={path}/>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={'max-w-xs flex flex-col'}>
                  <h3 className='text-white uppercase mb-2'>Partner Links</h3>
                  <ul className={'flex flex-col gap-2'}>
                    {(settings.partners || []).map((partner) => (
                      <li key={partner.href + partner.label}>
                        <a className='text-white hover:text-aquamarine' href={partner.href}>{partner.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={'flex flex-col gap-2'}>
                  <h3 className='text-white uppercase'> Contact Us </h3>
                  <div className={'flex items-center gap-2 text-white'}>
                    <BsPhoneFill color="greenyellow"/> {contact.phone}
                  </div>
                  <div className={'flex items-center gap-2 text-white'}>
                    <MdEmail color="#39A1FF"/> {contact.email}
                  </div>
                  <div className={'flex items-center gap-2 text-white'}>
                    <MdLocationOn color="red"/> {contact.address}
                  </div>
                </div>
              </div>

            </footer>
            <div className={styles.copyright}>
              <p>{settings.copyright}</p>
            </div>
          </div>
         );
}
