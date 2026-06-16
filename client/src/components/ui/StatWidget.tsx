import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '../../lib/utils'
import { GlassCard } from './GlassCard'

interface StatWidgetProps {
  label: string
  value: string | number
  icon: React.ReactNode
  trend?: { value: number; label: string }
  color?: string
  className?: string
}

export function StatWidget({ label, value, icon, trend, color, className }: StatWidgetProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const [displayValue, setDisplayValue] = useState<string | number>(typeof value === 'number' ? 0 : value)

  useEffect(() => {
    if (isInView && typeof value === 'number') {
      const duration = 1500
      const start = 0
      const startTime = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplayValue(Math.floor(start + (value - start) * eased))

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      requestAnimationFrame(animate)
    }
  }, [isInView, value])

  return (
    <GlassCard ref={ref} glow className={cn('relative overflow-hidden', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="stat-value mt-1"
          >
            {typeof value === 'number' ? displayValue.toLocaleString('en-IN') : value}
          </motion.div>
          {trend && (
            <div className={cn(
              'flex items-center gap-1 mt-2 text-xs font-medium',
              trend.value >= 0 ? 'text-green-500' : 'text-red-500'
            )}>
              <span>{trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
              <span className="text-muted-foreground">{trend.label}</span>
            </div>
          )}
        </div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
          style={{
            background: color
              ? `${color}15`
              : 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(168,85,247,0.1))',
          }}
        >
          {icon}
        </div>
      </div>

      {/* Decorative gradient accent */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 opacity-60"
        style={{
          background: color
            ? `linear-gradient(90deg, ${color}, transparent)`
            : 'linear-gradient(90deg, var(--gradient-start), var(--gradient-end), transparent)',
        }}
      />
    </GlassCard>
  )
}
