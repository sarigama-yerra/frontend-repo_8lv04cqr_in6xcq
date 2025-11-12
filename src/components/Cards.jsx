import { motion } from 'framer-motion'

export function StatCard({ title, value, subtitle }) {
  return (
    <motion.div
      initial={{ y: 12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-5 rounded-xl bg-white/70 backdrop-blur border border-white/40 shadow-sm"
    >
      <p className="text-xs uppercase tracking-wide text-gray-500">{title}</p>
      <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </motion.div>
  )
}

export function Panel({ children, className = '' }) {
  return (
    <motion.div
      initial={{ y: 12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`p-0 rounded-xl bg-white/70 backdrop-blur border border-white/40 shadow-sm ${className}`}
    >
      {children}
    </motion.div>
  )
}
