import { useState } from 'react';
import Image from 'next/image';

import { GiHamburgerMenu } from 'react-icons/gi';
import { RxCross1 } from 'react-icons/rx';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import useAuth from '../../lib/hooks/Auth';

export default function SideMenu({ pages, setPage, currentPage }){
  const { userData, fetching } = useAuth();
  const [isOpen, setOpen] = useState(true);
  const isOpenStyle = isOpen ? `w-full max-w-xs` : `w-12`;
  const contentStyle = isOpen ? `block` : `hidden`;

  const photoURL = userData?.profile_URL;
  const name = `${userData?.first_name} ${userData?.last_name}`;

  return (
    <div className={'min-h-screen h-full bg-gradient-[-45deg] from-eggblue/70 to-slategray shadow-lg transition-all ' + isOpenStyle }>
      <div className={`w-full mt-4 flex justify-center items-center ${isOpen ? 'hidden' : ''}`}>
        <GiHamburgerMenu className='text-white text-3xl cursor-pointer hover:animate-pulse' onClick={() => setOpen(true)}/>
      </div>
      <div className={`w-full h-full ${contentStyle} transition-all`}>
        <div className='flex justify-between px-10 py-4 items-center'>
          <Image
            src="/ci_logo_light_blue.png"
            alt="Charicha Institute Logo"
            width={140}
            height={50}
          />          
	  <RxCross1 onClick={() => setOpen(false)} className='text-white text-3xl hover:rotate-45 cursor-pointer transition-all'/>
        </div>
	<div className='w-full flex justify-center  items-center'>
          <ProfileImage fetching={fetching} photoURL={photoURL}/>
        </div>
	<div className='w-full flex justify-center pb-4 items-center'>
	  <p className='text-white text-lg font-light'> { name } </p>
        </div>        
        <nav>
          { pages.map((page, idx) => {
	    return (<li key={page.label}
                        onClick={() => setPage(idx)}
                        className={`flex gap-2 items-center list-none cursor-pointer py-4 px-10 w-64 rounded-r-full text-white text-xl font-light
                                    transition-all ${currentPage === idx ? 'bg-slategray' : 'hover:bg-eggblue'}`}>
                      {page.icon} { page.label }
                    </li>);
          })}
        </nav>
      </div>    
    </div>
  );
}

const ProfileImage = ({ fetching, photoURL }) =>
      fetching ? (
        <Skeleton circle={true} width={100} height={100} /> )
      : (<div className='rounded-full overflow-clip w-[100px] h-[100px] object-cover border-4 border-eggblue'
         ><Image
           alt=""
           src={photoURL ?? "/profile.jpg"}
           width={'100px'}
           height={'100px'}
           objectFit={'cover'}
        /></div>);
