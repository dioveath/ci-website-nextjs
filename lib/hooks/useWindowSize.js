import { useState, useEffect } from 'react';

function getWinSize(){
  if(typeof window === 'undefined') return { width: undefined, height: undefined};
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

export default function useWindowSize(){
  const [winSize, setWinSize] = useState(getWinSize());

  useEffect(() => {
    function handleResize(){
      setWinSize(getWinSize());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return winSize;
}
