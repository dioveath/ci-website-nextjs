import styles from './primary_button.module.css';
import { AiFillEye } from 'react-icons/ai';

export default function PrimaryButton(props){
  return (
    <button name="" type={props.type ?? "button"}  onClick={props.onClick} className={styles.primaryButton}>{props.text}</button>
  );
}
