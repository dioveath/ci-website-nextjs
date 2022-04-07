import Head from 'next/head';
import styles from '../../styles/register/register.module.css';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';

import Marginer from '../../components/utils/Marginer.js';
import PrimaryButton from '../../components/buttons/PrimaryButton.js';

import useAuth from '../../lib/hooks/Auth.js';
import PuffLoader from 'react-spinners/PuffLoader';

import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';

export default function Register(){
  const { user, registerError, loading, registerWithEmailAndPassword, logout } = useAuth();

  const [ fieldError, setFieldError ] = useState(null);
  const [ passwordShow, setPasswordShow ] = useState(false);
  const [ confirmPasswordShow, setConfirmPasswordShow ] = useState(false);

  const email = useRef();
  const password = useRef();
  const confirmPassword = useRef();

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
      <main className={styles.main}>
        { !loading || user == null ?
          <form className={styles.loginContainer} onSubmit={onSubmitHandler}>
            <img alt="" src="ci_pc.png" className={styles.image}/>
            <Marginer vertical="20px"/>
            <p className={styles.captionStyle}> Provide your details </p>
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
            <p className={styles.captionStyle} style={{ "cursor": "pointer" }}> Forget Your Password? </p>
            <Marginer vertical="18px"/>
            <div style={{
              "display": "flex",
              "gap": "5px"
            }}>
              <p className={styles.bodyTextStyle}> Already have an Account? </p>
              <p style={{
                "cursor": "pointer"
              }} onClick={() => { router.push("/login"); }}> Login here! </p>
            </div>
          </form> : <div> <PuffLoader/> </div>
        }
      </main>

    </div>
    
  );

}
