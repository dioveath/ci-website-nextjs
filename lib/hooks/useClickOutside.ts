'use client';

import { useEffect, useRef } from "react";

/*
 * Calls `handler` when a mousedown lands outside the returned ref.
 *
 * The null guard is not cosmetic: strict mode surfaced that `current` is null
 * on the first render and whenever the node is unmounted, so the original
 * `domNodeRef.current.contains(...)` could throw. This matches the fix already
 * waiting on the fix/runtime-bugs-and-typos branch.
 */
const useClickOutside = <T extends HTMLElement = HTMLDivElement>(handler: () => void) => {
  const domNodeRef = useRef<T>(null);

  useEffect(() => {
    const mouseHandler = (e: MouseEvent) => {
      if (domNodeRef.current && !domNodeRef.current.contains(e.target as Node)) {
        handler();
      }
    };

    window.addEventListener("mousedown", mouseHandler);
    return () => window.removeEventListener("mousedown", mouseHandler);
  }, [handler]);

  return domNodeRef;
};

export default useClickOutside;
