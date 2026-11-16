'use client';

import { useState, useRef } from 'react';
import styles from '../DropdownMenu/dropdownmenu.module.css';
import { AiFillCaretDown } from 'react-icons/ai';
import useClickOutside from '../../lib/hooks/useClickOutside';

export interface DropdownItem { name: string; onClick?: () => void }
interface DropdownMenuProps { title?: React.ReactNode; itemList?: DropdownItem[] }


export function DropdownMenu(props: DropdownMenuProps){
  const [showList, setShowList] = useState(false);
  const close = () => setShowList(false);

  const ref = useClickOutside(close);

  return (
    <div ref={ref} className={styles.menuContainer}>
      <div className={styles.menuTitle} onClick={()=> { setShowList(!showList); }}>
        { props.title }
        <AiFillCaretDown className='text-white'/>
      </div>
      {
        showList &&
          <ul className={styles.itemList}>
            {
              props.itemList?.map((item: DropdownItem) => {
                return <li className={'text-black px-4 py-2 hover:text-white hover:bg-slategray rounded-md cursor-pointer'}
                           key={item.name} onClick={item.onClick}> { item.name } </li>;
              })
            }
          </ul>
      }
    </div>
  );
  
}
