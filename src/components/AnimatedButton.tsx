import React from 'react'
import { motion } from 'framer-motion'

interface AnimatedButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  onClick?: () => void
  className?: string
  icon?: React.ReactNode
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  icon,
  disabled = false,
  type = 'button'
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-duck-500 to-orange-500 hover:from-duck-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl focus:ring-duck-300 dark:focus:ring-duck-700 hover:scale-105',
    secondary: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-300 dark:focus:ring-blue-700 hover:scale-105',
    outline: 'border-2 border-duck-500 dark:border-duck-400 text-duck-600 dark:text-duck-400 hover:bg-duck-500 dark:hover:bg-duck-400 hover:text-white dark:hover:text-gray-900 focus:ring-duck-300 dark:focus:ring-duck-700 hover:scale-105'
  }
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  }

  return (
    <motion.button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </motion.button>
  )
}

export default AnimatedButton