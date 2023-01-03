import Head from 'next/head';
import Image from 'next/image';
import styles from '../../styles/register/register.module.css';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';

import Marginer from '../../components/utils/Marginer.js';
import PrimaryButton from '../../components/buttons/PrimaryButton.js';

import useAuth from '../../lib/hooks/Auth.js';
import PuffLoader from 'react-spinners/PuffLoader';

import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

import { useCallback } from 'react';
import { loadFull } from 'tsparticles';
import Particles from 'react-particles';
import { particleConfig } from '../../lib/particle_config';


export default function Register(){
  const { user, registerError, loading, registerWithEmailAndPassword, logout } = useAuth();

  const [ fieldError, setFieldError ] = useState(null);
  const [ passwordShow, setPasswordShow ] = useState(false);
  const [ confirmPasswordShow, setConfirmPasswordShow ] = useState(false);

  const email = useRef();
  const password = useRef();
  const confirmPassword = useRef();

  const particlesInit = useCallback(async engine => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async container => {
    console.log(container);
  }, []);    

  const router = useRouter();
  if(user != null){
    router.push("/");
  }

  const validateEmail = (email) => {
    return String(email).toLowerCase().match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  const validatePassword = (password) => {
    return String(password).match(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/      
    );
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();

    if(!validateEmail(email.current.value)) {
      setFieldError("Please enter a valid email!");
      return;
    }
    if(!validatePassword(password.current.value)) {
      setFieldError("Password length should be 6 with one A-Z, one a-z and one 1-9!");
      return;
    }
    if(password.current.value !== confirmPassword.current.value) {
      setFieldError("Password & Confirm Password doesn't match!");
      return;
    }
    registerWithEmailAndPassword(email.current.value, password.current.value);
  };
  
  return (
    <div className={styles.container}>
      <Head>
        <title> Charicha Insitute </title>
        <meta name="description" content="Charicha Institute - Login Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={'flex w-full min-h-screen h-full justify-center items-center bg-gradient-[-45deg] from-eggblue to-slategray'}>
        <Particles init={particlesInit} loaded={particlesLoaded} options={particleConfig}/>        
        { !loading || user == null ?
          <form className={styles.loginContainer} onSubmit={onSubmitHandler}>
            <div className={'min-w-md w-full h-full flex justify-center items-center'}>
              <Image className="shadow-md" alt='charicha pc hero image' src='/ci_pc.svg' width={'500'} height={'300'}/>
            </div>            
            <Marginer vertical="20px"/>
            <p className={'text-sm text-white font-light'}> Provide your details </p>
            <Marginer vertical="6px"/>          
            <input name="email" type="email" placeholder="Email" ref={email} className={styles.inputText}/>
            <Marginer vertical="14px"/>
            <div className={styles.field}>
              <div className={styles.eyeIcon} onClick={() => { setPasswordShow(!passwordShow); }}> { passwordShow ? <AiFillEyeInvisible/> : <AiFillEye/>}</div>
              <input name="password" type={ passwordShow ? "text" : "password"} placeholder="Password" ref={password} className={styles.inputText}/>
            </div>
            <Marginer vertical="14px"/>
            <div className={styles.field}>
              <div className={styles.eyeIcon} onClick={() => { setConfirmPasswordShow(!confirmPasswordShow); }}> { confirmPasswordShow ? <AiFillEyeInvisible/> : <AiFillEye/>}</div>
              <input name="confirmPassword" type={ confirmPasswordShow ? "text" : "password"}  placeholder="Confirm Password" ref={confirmPassword} className={styles.inputText}/>
            </div>            
            <Marginer vertical="6px"/>
            { registerError != "" || fieldError != null ? <p className={styles.captionStyle} style={{
              "color": "red",
              "fontSize": "12px"
            }}> * { fieldError || registerError } </p> : "" }
            <Marginer vertical="14px"/>          
            <PrimaryButton type="submit" text="REGISTER"/>
            <Marginer vertical="14px"/>
            <p className={'text-aquamarine font-light cursor-pointer'} > Forget Your Password? </p>
            <Marginer vertical="18px"/>
            <div className='flex gap-2'>
              <p className={'text-white font-light'}> Already have an Account? </p>
              <p className='text-aquamarine font-light cursor-pointer' onClick={() => { router.push("/login"); }}> Login here! </p>
            </div>
          </form> : <div> <PuffLoader/> </div>
        }
      </main>

    </div>
    
  );

}
