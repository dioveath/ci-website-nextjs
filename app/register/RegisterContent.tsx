'use client';

import Image from 'next/image';
import styles from '../../styles/register/register.module.css';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

import Marginer from '../../components/utils/Marginer';
import PrimaryButton from '../../components/buttons/PrimaryButton';

import useAuth from '../../lib/hooks/Auth';
import { validateEmail, validatePassword, validateName } from '../../lib/utils/validator';
import PuffLoader from 'react-spinners/PuffLoader';

import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

import ParticlesBackground from '../../components/ParticlesBackground';


export default function RegisterContent() {
  const { user, error, fetching, registerWithEmailAndPassword } = useAuth();

  const [ fieldError, setFieldError ] = useState<string | null>(null);
  const [ passwordShow, setPasswordShow ] = useState(false);
  const [ confirmPasswordShow, setConfirmPasswordShow ] = useState(false);

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const confirmPassword = useRef<HTMLInputElement>(null);

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldError(null);

    if(!validateName((firstNameRef.current?.value ?? ''))) {
      setFieldError("Please enter a valid first name");
      return;
    }

    if(!validateName((lastNameRef.current?.value ?? ''))) {
      setFieldError("Please enter a valid last name");
      return;
    }    

    if(!validateEmail((email.current?.value ?? ''))) {
      setFieldError("Please enter a valid email!");
      return;
    }
    if(!validatePassword((password.current?.value ?? ''))) {
      setFieldError("Password length should be 6 with one A-Z, one a-z and one 1-9!");
      return;
    }
    if((password.current?.value ?? '') !== (confirmPassword.current?.value ?? '')) {
      setFieldError("Password & Confirm Password doesn't match!");
      return;
    }
    registerWithEmailAndPassword((email.current?.value ?? ''), (password.current?.value ?? ''), (firstNameRef.current?.value ?? ''), (lastNameRef.current?.value ?? ''));
  };

  const router = useRouter();
  if(user != null){
    router.push("/");
    return <div className='flex w-full min-h-screen h-full justify-center items-center bg-linear-[-45deg] from-eggblue to-slategray'>
             <PuffLoader className='text-eggblue'/>
           </div>;
  }
    
  return (
    <div className={styles.container}>
      <main className={'flex w-full min-h-screen h-full justify-center items-center bg-linear-[-45deg] from-eggblue to-slategray'}>
        <ParticlesBackground/>

        { <form className={styles.loginContainer} onSubmit={onSubmitHandler}>
            <div className={'min-w-md w-full h-full flex justify-center items-center'}>
              <Image className="shadow-md" alt='charicha pc hero image' src='/ci_pc.svg' width={'500'} height={'300'}/>
            </div>            
            <Marginer vertical="20px"/>
            <p className={'text-sm text-white font-light'}> Provide your details </p>
            <Marginer vertical="6px"/>          
	    <div className='flex gap-4'>
              <input name="firstName" type="text" placeholder="First Name" ref={firstNameRef} className={styles.inputText}/>
              <input name="lastName" type="text" placeholder="Last Name" ref={lastNameRef} className={styles.inputText}/>              
            </div>
            <Marginer vertical="14px"/>          
            <input name="email" type="email" placeholder="Email" ref={email} className={styles.inputText}/>
            <Marginer vertical="14px"/>
            <div className={styles.field}>
              <div className={styles.eyeIcon} onClick={() => { setPasswordShow(!passwordShow); }}> { passwordShow ? <AiFillEyeInvisible/> : <AiFillEye/>}</div>
              <input name="password" type={ passwordShow ? "text" : "password"} placeholder="Password" ref={password} className={styles.inputText} autoComplete='new-password'/>
            </div>
            <Marginer vertical="14px"/>
            <div className={styles.field}>
              <div className={styles.eyeIcon} onClick={() => { setConfirmPasswordShow(!confirmPasswordShow); }}> { confirmPasswordShow ? <AiFillEyeInvisible/> : <AiFillEye/>}</div>
              <input name="confirmPassword" type={ confirmPasswordShow ? "text" : "password"}  placeholder="Confirm Password" ref={confirmPassword} className={styles.inputText} autoComplete='new-password'/>
            </div>
	    <div className='max-h-12 h-full my-2'>
            {(fieldError || error) &&
             <div className='h-10 flex items-center p-4 bg-red-300 rounded-md'>
               <p className='text-red-600 text-xs animate-wiggle'> { fieldError || error }</p>              
             </div>}
            </div>
            <PrimaryButton type="submit" text="REGISTER" disabled={fetching}> </PrimaryButton>
            <Marginer vertical="14px"/>
            <p className={'text-aquamarine font-light cursor-pointer'} > Forget Your Password? </p>
            <Marginer vertical="18px"/>
            <div className='flex gap-2'>
              <p className={'text-white font-light'}> Already have an Account? </p>
              <p className='text-aquamarine font-light cursor-pointer' onClick={() => { router.push("/login"); }}> Login here! </p>
            </div>
          </form> }
      </main>

    </div>
    
  );

}
