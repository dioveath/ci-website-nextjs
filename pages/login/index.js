import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';

import Navbar from '../../components/Navbar.js';

import styles from '../../styles/login/login.module.css';
import Marginer from '../../components/utils/Marginer.js';
import PrimaryButton from '../../components/buttons/PrimaryButton.js';

import useAuth from '../../lib/hooks/Auth.js';

export default function Login(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { user, loginWithGoogle, logout } = useAuth();

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
          <input name="email" type="email" value={email} placeholder="Email" onChange={(e)=> { setEmail(e.value); }} className={styles.inputText}/>
          <Marginer vertical="14px"/>                    
          <input name="password" type="password" value={password} placeholder="Password" onChange={(e) => { setPassword(e.value); }} className={styles.inputText}/>
          <Marginer vertical="14px"/>          
          <PrimaryButton onClick={() => console.log("clicked")} text="LOGIN"/>
          <Marginer vertical="6px"/>          
          <PrimaryButton onClick={() => console.log("clicked")} text="LOGIN WITH FACEBOOK"/>
          <Marginer vertical="6px"/>                    
          <PrimaryButton onClick={() => loginWithGoogle() } text="LOGIN WITH GOOGLE"/>
          <Marginer vertical="14px"/>
          <p className={styles.captionStyle}> Forget Your Password? </p>
          <Marginer vertical="18px"/>          
          <p className={styles.bodyTextStyle}> Don't have an Account? Register </p>
        </div>
      </main>

    </div>
    
  );

}
