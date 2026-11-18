'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import styles from '../../styles/login/login.module.css';
import Marginer from '../../components/utils/Marginer';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import LoadingScreen from '../../components/LoadingScreen';

import useAuth from '../../lib/hooks/Auth';
import { ImGoogle2 } from 'react-icons/im';

import ParticlesBackground from '../../components/ParticlesBackground';

// Google is the only sign-in method. There is no separate sign-up: the first
// Google sign-in creates the user's profile (see AuthProvider in lib/hooks/Auth).
export default function LoginContent() {
  const { error, fetching, loading, isLoggedIn, loginWithGoogle } = useAuth();
  const router = useRouter();

  const signedIn = !loading && !fetching && isLoggedIn;

  // Navigation is a side effect, so it runs after render rather than during it.
  useEffect(() => {
    if (signedIn) router.push('/dashboard');
  }, [signedIn, router]);

  if (loading || signedIn) return <LoadingScreen/>;

  return (
    <div className={styles.container}>
      <ParticlesBackground/>
      <main className={'flex w-full min-h-screen h-full justify-center items-center bg-linear-[-45deg] from-eggblue to-slategray'}>
        <div className={styles.loginContainer}>
          <div className={'w-full h-full flex justify-center items-center'}>
            <Image className="shadow-md" alt='charicha pc hero image' src='/ci_pc.svg' width={'500'} height={'300'}/>
          </div>
          <Marginer vertical="20px"/>
          <p className={'text-sm text-white font-light text-center'}>
            Sign in with your Google account. New here? Signing in creates your account.
          </p>
          <div className='max-h-12 h-full my-2'>
            {error &&
             <div className='h-full flex items-center p-4 bg-red-300 rounded-md'>
               <p className='text-red-600 text-xs animate-wiggle'> { error }</p>
             </div>}
          </div>
          <PrimaryButton disabled={fetching} onClick={() => loginWithGoogle()} text={
            <div className='flex justify-center items-center'>
              <ImGoogle2 size={26}/> <Marginer/>CONTINUE WITH GOOGLE
            </div>
          }/>
        </div>
      </main>
    </div>
  );
}
