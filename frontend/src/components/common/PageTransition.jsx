import { motion, useReducedMotion } from "motion/react";
const PageTransition = ({ children, className = "" }) => {
  const shouldReduceMotion = useReducedMotion();
  const variants = {
    initial: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    animate: shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 },
    exit: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }
  };
  return <motion.div
    variants={variants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: shouldReduceMotion ? 0.15 : 0.25, ease: [0.25, 0.1, 0.25, 1] }}
    className={`w-full ${className}`}
  >
      {children}
    </motion.div>;
};
export {
  PageTransition
};
