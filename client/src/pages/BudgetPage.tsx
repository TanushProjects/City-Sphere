import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingDown,
  TrendingUp,
  PiggyBank,
  Lightbulb,
  IndianRupee,
} from 'lucide-react'
import { GlassCard, PageHeader, StatWidget } from '../components/ui'
import { formatCurrency } from '../lib/utils'

// Chart.js with lazy import
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

interface BudgetSlider {
  key: string
  label: string
  emoji: string
  value: number
  max: number
  color: string
}

const defaultSliders: BudgetSlider[] = [
  { key: 'rent', label: 'Rent', emoji: '🏠', value: 15000, max: 40000, color: '#3b82f6' },
  { key: 'food', label: 'Food & Dining', emoji: '🍕', value: 8000, max: 25000, color: '#f97316' },
  { key: 'commute', label: 'Commute', emoji: '🚇', value: 3000, max: 15000, color: '#a855f7' },
  { key: 'utilities', label: 'Utilities', emoji: '⚡', value: 2000, max: 10000, color: '#22c55e' },
  { key: 'entertainment', label: 'Entertainment', emoji: '🎬', value: 5000, max: 20000, color: '#ec4899' },
  { key: 'shopping', label: 'Shopping', emoji: '🛍️', value: 3000, max: 15000, color: '#eab308' },
  { key: 'health', label: 'Health', emoji: '💊', value: 1500, max: 10000, color: '#ef4444' },
  { key: 'savings', label: 'Savings', emoji: '🏦', value: 5000, max: 30000, color: '#06b6d4' },
]

export default function BudgetPage() {
  const [income, setIncome] = useState(50000)
  const [sliders, setSliders] = useState(defaultSliders)

  const totalExpense = sliders.reduce((sum, s) => sum + s.value, 0)
  const remaining = income - totalExpense
  const savingsRate = income > 0 ? Math.round(((sliders.find(s => s.key === 'savings')?.value || 0) / income) * 100) : 0

  const updateSlider = (key: string, newValue: number) => {
    setSliders((prev) => prev.map((s) => (s.key === key ? { ...s, value: newValue } : s)))
  }

  // Chart data
  const doughnutData = {
    labels: sliders.map((s) => s.label),
    datasets: [
      {
        data: sliders.map((s) => s.value),
        backgroundColor: sliders.map((s) => s.color + '80'),
        borderColor: sliders.map((s) => s.color),
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  }

  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Income',
        data: [48000, 50000, 50000, 52000, 50000, income],
        backgroundColor: '#3b82f680',
        borderColor: '#3b82f6',
        borderWidth: 1,
        borderRadius: 6,
      },
      {
        label: 'Expense',
        data: [42000, 38000, 44000, 40000, 43000, totalExpense],
        backgroundColor: '#ef444480',
        borderColor: '#ef4444',
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 16,
          font: { family: 'Inter', size: 12 },
          color: '#94a3b8',
        },
      },
    },
  }

  const barOptions = {
    ...chartOptions,
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { family: 'Inter' } },
      },
      y: {
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: {
          color: '#94a3b8',
          font: { family: 'Inter' },
          callback: (value: any) => `₹${(value / 1000).toFixed(0)}k`,
        },
      },
    },
  }

  const tips = [
    { tip: 'Switch to metro for daily commute — save ₹1,500/month vs cab', icon: '🚇' },
    { tip: 'Cook at home 4 days/week — reduce food spending by 30%', icon: '🍳' },
    { tip: 'Use student discounts for entertainment — save up to 40%', icon: '🎟️' },
    { tip: 'Increase SIP to ₹5,000/month for better returns', icon: '📈' },
  ]

  return (
    <div className="page-transition space-y-8">
      <PageHeader
        title="Budget Planner"
        subtitle="Track expenses and optimize your monthly budget"
      />

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatWidget
          label="Monthly Income"
          value={income}
          icon={<IndianRupee className="w-6 h-6 text-green-500" />}
          color="#22c55e"
        />
        <StatWidget
          label="Total Expenses"
          value={totalExpense}
          icon={<TrendingDown className="w-6 h-6 text-red-500" />}
          color="#ef4444"
        />
        <StatWidget
          label="Remaining"
          value={remaining}
          icon={remaining >= 0 ? <TrendingUp className="w-6 h-6 text-blue-500" /> : <TrendingDown className="w-6 h-6 text-red-500" />}
          color={remaining >= 0 ? '#3b82f6' : '#ef4444'}
        />
        <StatWidget
          label="Savings Rate"
          value={`${savingsRate}%`}
          icon={<PiggyBank className="w-6 h-6 text-cyan-500" />}
          color="#06b6d4"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sliders */}
        <div className="lg:col-span-2 space-y-6">
          {/* Income Input */}
          <GlassCard hover={false} glow>
            <label className="text-sm font-medium mb-3 block">Monthly Income</label>
            <div className="flex items-center gap-4">
              <span className="text-lg">💰</span>
              <input
                type="range"
                min={10000}
                max={200000}
                step={1000}
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="flex-1 accent-primary h-2 rounded-full appearance-none bg-accent cursor-pointer"
              />
              <span className="font-display font-bold text-lg min-w-[100px] text-right text-primary">
                {formatCurrency(income)}
              </span>
            </div>
          </GlassCard>

          {/* Expense Sliders */}
          <GlassCard hover={false} glow padding="lg">
            <h3 className="text-lg font-display font-bold mb-6">Monthly Expenses</h3>
            <div className="space-y-5">
              {sliders.map((slider) => (
                <div key={slider.key}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <span>{slider.emoji}</span>
                      {slider.label}
                    </label>
                    <span
                      className="font-semibold text-sm"
                      style={{ color: slider.color }}
                    >
                      {formatCurrency(slider.value)}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min={0}
                      max={slider.max}
                      step={500}
                      value={slider.value}
                      onChange={(e) => updateSlider(slider.key, Number(e.target.value))}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, ${slider.color} ${(slider.value / slider.max) * 100}%, hsl(var(--accent)) ${(slider.value / slider.max) * 100}%)`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Over budget warning */}
            {remaining < 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
              >
                <p className="text-sm font-medium text-red-500">
                  ⚠️ You're over budget by {formatCurrency(Math.abs(remaining))}!
                </p>
              </motion.div>
            )}
          </GlassCard>
        </div>

        {/* Charts & Tips */}
        <div className="space-y-6">
          {/* Doughnut Chart */}
          <GlassCard hover={false} glow>
            <h3 className="text-lg font-display font-bold mb-4">Expense Breakdown</h3>
            <div className="h-64">
              <Doughnut data={doughnutData} options={{ ...chartOptions, cutout: '65%' }} />
            </div>
          </GlassCard>

          {/* AI Tips */}
          <GlassCard glow>
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-display font-bold">AI Savings Tips</h3>
            </div>
            <div className="space-y-3">
              {tips.map((tip, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-accent/50"
                >
                  <span className="text-lg flex-shrink-0">{tip.icon}</span>
                  <p className="text-sm text-muted-foreground">{tip.tip}</p>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Monthly Trend */}
      <GlassCard hover={false} glow>
        <h3 className="text-lg font-display font-bold mb-4">Monthly Trend</h3>
        <div className="h-72">
          <Bar data={barData} options={barOptions} />
        </div>
      </GlassCard>
    </div>
  )
}
