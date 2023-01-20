import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';

import styles from '../../styles/login/login.module.css';
import Marginer from '../../components/utils/Marginer.js';
import PrimaryButton from '../../components/buttons/PrimaryButton.js';
import LoadingScreen from '../../components/LoadingScreen';

import useAuth from '../../lib/hooks/Auth.js';
import { validateEmail, validatePassword } from '../../lib/utils/validator';
import PuffLoader from 'react-spinners/PuffLoader';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { ImGoogle2 } from 'react-icons/im';

import { useCallback } from 'react';
import { loadFull } from 'tsparticles';
import Particles from 'react-particles';
import { particleConfig } from '../../lib/particle_config';

export default function Login(){
  const [fieldError, setFieldError] = useState(null);
  const email = useRef();
  const password = useRef();

  const {  error, fetching, loading, isLoggedIn, loginWithGoogle, loginWithEmailAndPassword } = useAuth();
  const [passwordShow, setPasswordShow] = useState(false);

  const particlesInit = useCallback(async engine => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async container => {
    console.log(container);
  }, []);  

  const router = useRouter();

  if(loading){
    return <LoadingScreen/>;
  }

  if(!fetching && !loading && isLoggedIn) {
    router.push("/dashboard");
    return <LoadingScreen/>;
  }

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setFieldError(null);
    if(!validateEmail(email.current.value)) {
      setFieldError("Please enter a valid email!");
      return;
    }
    if(!validatePassword(password.current.value)) {
      setFieldError("Password is not valid!");
      return;
    }

    loginWithEmailAndPassword(email.current.value, password.current.value);
  };
  
  return (
    <div className={styles.container}>
      <Head>
        <title> Charicha Insitute </title>
        <meta name="description" content="Charicha Institute - Login Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Particles init={particlesInit} loaded={particlesLoaded} options={particleConfig}/>
      <main className={'flex w-full min-h-screen h-full justify-center items-center bg-gradient-[-45deg] from-eggblue to-slategray'}>
          <form className={styles.loginContainer} onSubmit={onSubmitHandler}>
            <div className={'min-w-md w-full h-full flex justify-center items-center'}>
              <Image className="shadow-md" alt='charicha pc hero image' src='/ci_pc.svg' width={'500'} height={'300'}/>
            </div>            
            {/* <img alt="" src="ci_pc.png" className={styles.image}/> */}
            <Marginer vertical="20px"/>
            <p className={'text-sm text-white font-light'}> Login with credentials </p>
            <Marginer vertical="6px"/>          
            <input name="email" type="email" placeholder="Email" ref={email} className={styles.inputText}/>
            <Marginer vertical="14px"/>                    
            <div className={styles.field}>
              <div className={styles.eyeIcon} onClick={() => { setPasswordShow(!passwordShow); }}> { passwordShow ? <AiFillEyeInvisible/> : <AiFillEye/>}</div>
              <input name="password" type={ passwordShow ? "text" : "password"} placeholder="Password" ref={password} className={styles.inputText}/>
            </div>
	    <div className='max-h-12 h-full my-2'>
            {(fieldError || error) &&
             <div className='h-full flex items-center p-4 bg-red-300 rounded-md'>
               <p className='text-red-600 text-xs animate-wiggle'> { fieldError || error }</p>              
             </div>}
            </div>
            <PrimaryButton type="submit" text="LOGIN" disabled={fetching}/>
            <Marginer vertical="6px"/>          
            <PrimaryButton disabled={fetching} onClick={() => loginWithGoogle() } text={ <div style={{
              "display": "flex",
              "justifyContent": "center",
              "alignItems": "center"
            }}> <ImGoogle2 size={26}/> <Marginer/>LOGIN WITH GOOGLE </div>}/>
            <Marginer vertical="14px"/>
            <p className={'text-aquamarine font-light cursor-pointer'}> Forget Your Password? </p>
            <Marginer vertical="18px"/>
            <div className='flex gap-2'>
              <p className={'text-white font-light'}> Don&apos;t have an Account? </p>
              <p className={'text-aquamarine font-light cursor-pointer'} onClick={() => {
                router.push('/register');
              }}> Register </p>
            </div>
          </form> 
      </main>

    </div>
    
  );

}
