import { useState } from 'react';

export default function Accordian(props) {
  const [isClicked, setIsClicked] = useState(false);

  const AccordianContent = props.content;

  return (
    <div>
      <div className={styles["accordian-title"]} onClick={setIsClicked(!isClicked)}> { props.title }</div>
      { isClicked ? <div className={styles["accordian-content"]}>
                      <AccordianContent/>
                    </div> : ""}
    </div>
  );

}
