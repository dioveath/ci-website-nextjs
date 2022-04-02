import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';

import Navbar from '../../components/Navbar.js';

import styles from '../../styles/login/login.module.css';
import Marginer from '../../components/utils/Marginer.js';
import PrimaryButton from '../../components/buttons/PrimaryButton.js';

import useAuth from '../../lib/hooks/Auth.js';
import PuffLoader from 'react-spinners/PuffLoader';

export default function Login(){
  const email = useRef();
  const password = useRef();

  const { user, error, loading, loginWithGoogle, loginWithEmailAndPassword, logout } = useAuth();

  const router = useRouter();
  if(user != null) {
    router.push("/");
  }
  
  return (
    <div className={styles.container}>
      <Head>
        <title> Charicha Insitute </title>
        <meta name="description" content="Charicha Institute - Login Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        { !loading ?
          <form className={styles.loginContainer}>
            <img alt="" src="ci_pc.png" className={styles.image}/>
            <Marginer vertical="20px"/>
            <p className={styles.captionStyle}> Login with credentials </p>
            <Marginer vertical="6px"/>          
            <input name="email" type="email" placeholder="Email" ref={email} className={styles.inputText}/>
            <Marginer vertical="14px"/>                    
            <input name="password" type="password" placeholder="Password" ref={password} className={styles.inputText}/>
            <Marginer vertical="6px"/>
            { error != "" ? <p className={styles.captionStyle} style={{
              "color": "red"
            }}> { error } </p> : "" }
            <Marginer vertical="14px"/>          
            <PrimaryButton onClick={() => loginWithEmailAndPassword(email.current.value, password.current.value)} text="LOGIN"/>
            <Marginer vertical="6px"/>          
            <PrimaryButton onClick={() => console.log("clicked")} text="LOGIN WITH FACEBOOK"/>
            <Marginer vertical="6px"/>                    
            <PrimaryButton onClick={() => loginWithGoogle() } text="LOGIN WITH GOOGLE"/>
            <Marginer vertical="14px"/>
            <p className={styles.captionStyle} style={{ "cursor": "pointer" }}> Forget Your Password? </p>
            <Marginer vertical="18px"/>
            <div style={{
              "display": "flex",
              "gap": "5px"
            }}>
              <p className={styles.bodyTextStyle}> Don&apos;t have an Account? </p>
              <p style={{
                "cursor": "pointer"
              }} onClick={() => {
                router.push('/register');
              }}> Register </p>
            </div>
          </form> : <div> <PuffLoader/> </div>
        }
      </main>

    </div>
    
  );

}
