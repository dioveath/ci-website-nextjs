'use client';

import styles from './primary_button.module.css';
import { AiFillEye } from 'react-icons/ai';

interface PrimaryButtonProps {
  type?: 'button' | 'submit' | 'reset';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  text?: React.ReactNode;
  children?: React.ReactNode;
}

export default function PrimaryButton(props: PrimaryButtonProps){
  const { disabled } = props;
  return (
    <button name="" type={props.type ?? "button"}  onClick={props.onClick}
            className={'text-white text-xl py-4 bg-eggblue hover:bg-slategray rounded-lg shadow-md transition-all ' + (!!disabled ? 'bg-gray-300 hover:bg-gray-500 animate-pulse' : ' ')}
            disabled={!!disabled}>
      {props.text}
    </button>
  );
}
