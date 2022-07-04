import { useState } from 'react';
import styles from './tabbar.module.css';

/* 
  Tab { 
    id: "a0vnwvenwv9en8",
    header: "Creative",
    content: <Content/>
  }
*/
 
export default function Tabbar({ tabs }) {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);

  return (
    <>
      <ul className={styles.tabItems}>
        {tabs.map((t, index) => (
          <li
            key={t.header}
            className={
              currentTabIndex == index ? styles.tabItemActive : styles.tabItem
            }
            onClick={() => {
              setPreviousIndex(currentTabIndex);
              setCurrentTabIndex(index);
            }}
          >
            {t.header}
          </li>
        ))}
      </ul>
      <div className={styles.tabContentsContainer}>
        {tabs.map((t, index) => (
          <div
            key={t.id}
            className={`${styles.tabContent} ${
              currentTabIndex == index &&
              (previousIndex > currentTabIndex
                ? styles.tabActiveLeftToRight
                : styles.tabActiveRightToLeft)
            }`}
          >
            {t.content}
          </div>
        ))}
      </div>
    </>
  );
}
