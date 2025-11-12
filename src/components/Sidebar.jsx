import { motion } from 'framer-motion'
import { FlaskConical, Beaker, Layers, Droplets, Settings, Sparkles } from 'lucide-react'

export default function Sidebar({ current, onNavigate }) {
  const items = [
    { key: 'dashboard', label: 'Overview', icon: Sparkles },
    { key: 'ingredients', label: 'Ingredients', icon: FlaskConical },
    { key: 'formulas', label: 'Formulas', icon: Layers },
    { key: 'batches', label: 'Batches', icon: Beaker },
    { key: 'solvents', label: 'Solvents', icon: Droplets },
  ]

  return (
    <div className="h-full w-64 bg-white/60 backdrop-blur-md border-r border-white/40 shadow-sm flex flex-col">
      <div className="px-6 py-5 border-b border-white/40">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500" />
          <div>
            <p className="text-sm font-semibold text-gray-800">Perfume Lab</p>
            <p className="text-xs text-gray-500">Craft with precision</p>
          </div>
        </div>
      </div>
      <nav className="p-3 space-y-1">
        {items.map(({ key, label, icon: Icon }) => (
          <motion.button
            key={key}
            onClick={() => onNavigate?.(key)}
            whileHover={{ x: 4 }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              current === key ? 'bg-violet-100 text-violet-900' : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </motion.button>
        ))}
      </nav>
      <div className="mt-auto p-3">
        <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-600 hover:text-gray-900 transition-colors">
          <Settings className="h-4 w-4" /> Settings
        </button>
      </div>
    </div>
  )
}
