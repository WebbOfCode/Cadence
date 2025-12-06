'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface StepWrapperProps {
  children: ReactNode;
  direction?: 'forward' | 'backward';
}

export function StepWrapper({ children, direction = 'forward' }: StepWrapperProps) {
  const variants = {
    enter: {
      x: direction === 'forward' ? 20 : -20,
      opacity: 0,
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: direction === 'forward' ? -20 : 20,
      opacity: 0,
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
