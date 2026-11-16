'use client';

import { useEffect } from "react";

const useLink = (url: string, rel: string) => {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = url;
    link.rel = rel;

    document.body.appendChild(link);

    // Braces matter: returning removeChild's value made this an invalid
    // EffectCallback, since React treats a returned non-function as a mistake.
    return () => {
      document.body.removeChild(link);
    };
  }, [url, rel]);
};

export default useLink;
