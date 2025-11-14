export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
};

export const getAnimationDuration = (duration: number): number => {
  return prefersReducedMotion() ? 0 : duration;
};

export const getMotionConfig = () => {
  const shouldReduce = prefersReducedMotion();

  return {
    initial: shouldReduce ? {} : undefined,
    animate: shouldReduce ? {} : undefined,
    exit: shouldReduce ? {} : undefined,
    transition: shouldReduce ? { duration: 0 } : undefined,
  };
};
