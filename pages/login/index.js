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
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { ImGoogle2 } from 'react-icons/im';

export default function Login(){
  const email = useRef();
  const password = useRef();

  const { user, error, loading, loginWithGoogle, loginWithEmailAndPassword, logout } = useAuth();

  const [passwordShow, setPasswordShow] = useState(false);

  const router = useRouter();
  if(user != null) {
    router.push("/");
  }

  const onSubmitHandler = (e) => {
    e.preventDefault();
    loginWithEmailAndPassword(email.current.value, password.current.value);
  };
  
  return (
    <div className={styles.container}>
      <Head>
        <title> Charicha Insitute </title>
        <meta name="description" content="Charicha Institute - Login Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        { !loading || user == null ?
          <form className={styles.loginContainer} onSubmit={onSubmitHandler}>
            <img alt="" src="ci_pc.png" className={styles.image}/>
            <Marginer vertical="20px"/>
            <p className={styles.captionStyle}> Login with credentials </p>
            <Marginer vertical="6px"/>          
            <input name="email" type="email" placeholder="Email" ref={email} className={styles.inputText}/>
            <Marginer vertical="14px"/>                    
            <div className={styles.field}>
              <div className={styles.eyeIcon} onClick={() => { setPasswordShow(!passwordShow); }}> { passwordShow ? <AiFillEyeInvisible/> : <AiFillEye/>}</div>
              <input name="password" type={ passwordShow ? "text" : "password"} placeholder="Password" ref={password} className={styles.inputText}/>
            </div>
            <Marginer vertical="6px"/>
            { error != "" ? <p className={styles.captionStyle} style={{
              "color": "red",
              "fontSize": "12px"
            }}> * { error } </p> : "" }
            <Marginer vertical="14px"/>          
            <PrimaryButton type="submit" text="LOGIN"/>
            <Marginer vertical="6px"/>          
            <PrimaryButton onClick={() => loginWithGoogle() } text={ <div style={{
              "display": "flex",
              "justifyContent": "center",
              "align-items": "center"
            }}> <ImGoogle2 size={26}/> <Marginer/>LOGIN WITH GOOGLE </div>}/>
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
