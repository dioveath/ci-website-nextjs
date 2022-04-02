import styles from './primary_button.module.css';
import { AiFillEye } from 'react-icons/ai';

export default function PrimaryButton(props){
  return (
    <input name="" type={props.type ?? "button"} value={props.text} onClick={props.onClick} className={styles.primaryButton}/>
  );
}
