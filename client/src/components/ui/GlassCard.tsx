import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '../../lib/utils'
import { forwardRef } from 'react'

interface GlassCardProps extends HTMLMotionProps<'div'> {
  glow?: boolean
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, glow = false, hover = true, padding = 'md', children, ...props }, ref) => {
    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          'glass-card',
          glow && 'neon-glow',
          !hover && '!transform-none hover:!transform-none hover:!shadow-[var(--glass-shadow)]',
          paddingClasses[padding],
          className
        )}
        whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

GlassCard.displayName = 'GlassCard'
