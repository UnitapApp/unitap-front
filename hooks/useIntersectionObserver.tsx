import { useEffect, useRef, useState } from "react";

export const useIntersectionObserver = (
  initialState: boolean,
  options?: IntersectionObserverInit,
  runOnce: boolean = false
) => {
  const ref = useRef(null);
  const [isIntersecting, setIntersecting] = useState(initialState);
  const [intersectionRatio, setIntersectionRatio] = useState(0);
  const [boundingClientRect, setBoundingClientRect] = useState<DOMRectReadOnly | null>(null);

  useEffect(() => {
    let refCurrent: Element;
    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting);
      setIntersectionRatio(entry.intersectionRatio);
      setBoundingClientRect(entry.boundingClientRect);
      if (runOnce && entry.isIntersecting && refCurrent)
        observer.unobserve(refCurrent);
    }, options);
    if (ref.current) {
      observer.observe(ref.current);
      refCurrent = ref.current;
    }
    return () => {
      if (refCurrent) {
        observer.unobserve(refCurrent);
      }
    };
  }, []);
  return { ref, isIntersecting, intersectionRatio, boundingClientRect };
};