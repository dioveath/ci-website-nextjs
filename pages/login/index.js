import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useRef } from 'react';

import Navbar from '../../components/Navbar.js';

import styles from '../../styles/login/login.module.css';
import Marginer from '../../components/utils/Marginer.js';
import PrimaryButton from '../../components/buttons/PrimaryButton.js';

import useAuth from '../../lib/hooks/Auth.js';

export default function Login(){
  const email = useRef();
  const password = useRef();

  const { user, error, loginWithGoogle, loginWithEmailAndPassword, logout } = useAuth();

  const router = useRouter();
  if(user != null) {
    router.push("/");
  }


  return (
    <div className={styles.container}>
      <Head>
        <title> Charicha Insitute </title>
        <meta name="description" content="Charicha Institute Official Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.loginContainer}>
          {/* <Image alt="" src="/ci_pc.png" width="400px" height="100px" layout="responsive"/> */}
          <img alt="" src="ci_pc.png"/>
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
          <p className={styles.captionStyle}> Forget Your Password? </p>
          <Marginer vertical="18px"/>          
          <p className={styles.bodyTextStyle}> Don&apos;t have an Account? Register </p>
        </div>
      </main>

    </div>
    
  );

}
