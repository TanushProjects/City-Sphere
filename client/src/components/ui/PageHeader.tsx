import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

interface PageHeaderProps {
  title: string
  subtitle?: string
  gradient?: boolean
  children?: React.ReactNode
  className?: string
}

export function PageHeader({ title, subtitle, gradient = true, children, className }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn('mb-8', className)}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
            {gradient ? (
              <>
                {title.split(' ').slice(0, -1).join(' ')}{' '}
                <span className="text-gradient">{title.split(' ').slice(-1)}</span>
              </>
            ) : (
              title
            )}
          </h1>
          {subtitle && (
            <p className="mt-2 text-muted-foreground text-lg">{subtitle}</p>
          )}
        </div>
        {children && <div className="flex items-center gap-3">{children}</div>}
      </div>
    </motion.div>
  )
}
