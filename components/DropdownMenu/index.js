import { useState } from 'react';
import styles from '../DropdownMenu/dropdownmenu.module.css';
import { AiFillCaretDown } from 'react-icons/ai';

export function DropdownMenu(props){
  const [showList, setShowList] = useState(false);

  const close = () => {
    setShowList(false);
  };

  // setTimeout(()=> {
  //   if(showList)
  //     window.addEventListener('click', close);
  //   else
  //     window.removeEventListener('click', close);
  // }, 0);

  return (
    <div className={styles.menuContainer}>
      <div className={styles.menuTitle} onClick={()=> { setShowList(!showList); }}> { props.title } <AiFillCaretDown/> </div>
      { showList ? <ul className={styles.itemList}>
        {
          props.itemList?.map((item) => {
            return <li className={styles.item} key={item.name} onClick={item.onClick}> { item.name } </li>;
          })
        }
        </ul> : ""
      }
    </div>
  );
  
}
