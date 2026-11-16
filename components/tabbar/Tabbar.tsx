'use client';

import { useState } from 'react';
import styles from './tabbar.module.css';

/* 
  Tab { 
    id: "a0vnwvenwv9en8",
    header: "Creative",
    content: <Content/>
  }
*/
 
export interface Tab { id: string; header: string; content: React.ReactNode }

export default function Tabbar({ tabs }: { tabs: Tab[] }) {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);

  return (
    <>
      <ul className={styles.tabItems}>
        {tabs.map((t: Tab, index: number) => (
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
        {tabs.map((t: Tab, index: number) => (
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
