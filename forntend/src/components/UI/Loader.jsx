import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ size = 'medium', color = 'primary' }) => {
  const sizeClasses = {
    small: 'loader-small',
    medium: 'loader-medium',
    large: 'loader-large'
  };

  const colorClasses = {
    primary: 'loader-primary',
    secondary: 'loader-secondary',
    white: 'loader-white'
  };

  const loaderClasses = [
    'loader',
    sizeClasses[size],
    colorClasses[color]
  ].join(' ');

  return (
    <motion.div
      className={loaderClasses}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }}
    >
      <div className="loader-spinner"></div>
    </motion.div>
  );
};

export default Loader;
