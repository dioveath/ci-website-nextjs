import styles from './primary_button.module.css';

export default function PrimaryButton(props){
  return (
    <input name="" type="button" value={props.text} onClick={props.onClick} className={styles.primaryButton}/>
  );
}
