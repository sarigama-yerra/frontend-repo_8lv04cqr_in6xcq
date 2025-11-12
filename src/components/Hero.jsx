import { motion } from 'framer-motion'
import Spline from '@splinetool/react-spline'

export default function Hero() {
  return (
    <div className="relative h-[340px] rounded-2xl overflow-hidden bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 border border-white/40">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/myxXfbNiwnbTpGFp/scene.splinecode" />
      </div>
      <div className="relative z-10 h-full flex items-end">
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="p-6"
        >
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">The Fragrance of Creativity</h1>
          <p className="text-sm text-gray-600 mt-1">Manage ingredients, craft formulas, and track batches — all in one serene workspace.</p>
        </motion.div>
      </div>
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-white/40 to-transparent" />
    </div>
  )
}
