import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from './components/Sidebar'
import Hero from './components/Hero'
import { StatCard, Panel } from './components/Cards'
import { Plus } from 'lucide-react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function EmptyState({ title, subtitle, onCreate }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16">
      <p className="text-xl font-medium text-gray-800">{title}</p>
      <p className="text-sm text-gray-500 mt-2 max-w-sm">{subtitle}</p>
      {onCreate && (
        <button
          onClick={onCreate}
          className="mt-6 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-600 text-white text-sm hover:bg-violet-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> Create new
        </button>
      )}
    </div>
  )
}

function DataTable({ columns, rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-3 font-medium">{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className="border-t border-gray-100/70">
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-3 text-gray-800">{row[c.key] ?? '-'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [loading, setLoading] = useState(false)
  const [ingredients, setIngredients] = useState([])
  const [solvents, setSolvents] = useState([])
  const [formulas, setFormulas] = useState([])
  const [batches, setBatches] = useState([])

  const fetcher = async (path) => {
    const res = await fetch(`${API_BASE}${path}`)
    if (!res.ok) throw new Error('Failed')
    return await res.json()
  }

  const loadAll = async () => {
    setLoading(true)
    try {
      const [ing, sol, frm, bat] = await Promise.all([
        fetcher('/api/ingredient'),
        fetcher('/api/solvent'),
        fetcher('/api/formula'),
        fetcher('/api/batch'),
      ])
      setIngredients(ing)
      setSolvents(sol)
      setFormulas(frm)
      setBatches(bat)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  const stats = useMemo(() => [
    { title: 'Ingredients', value: ingredients.length },
    { title: 'Formulas', value: formulas.length },
    { title: 'Batches', value: batches.length },
    { title: 'Solvents', value: solvents.length },
  ], [ingredients, formulas, batches, solvents])

  const sections = {
    dashboard: (
      <div className="space-y-6">
        <Hero />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <StatCard key={s.title} title={s.title} value={s.value} />
          ))}
        </div>
        <Panel className="p-4">
          <p className="text-sm text-gray-600">Quick glance at your lab inventory and creations. Use the sidebar to manage each area.</p>
        </Panel>
      </div>
    ),
    ingredients: (
      <Panel className="p-4">
        {ingredients.length === 0 ? (
          <EmptyState
            title="No ingredients yet"
            subtitle="Add raw materials like essential oils, aroma chemicals, and absolutes."
          />
        ) : (
          <DataTable
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'category', label: 'Category' },
              { key: 'supplier', label: 'Supplier' },
              { key: 'cas', label: 'CAS' },
              { key: 'stock_g', label: 'Stock (g)' },
            ]}
            rows={ingredients}
          />
        )}
      </Panel>
    ),
    solvents: (
      <Panel className="p-4">
        {solvents.length === 0 ? (
          <EmptyState
            title="No solvents yet"
            subtitle="Track ethanol, DPG, IPM and other solvents used for compounding."
          />
        ) : (
          <DataTable
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'type', label: 'Type' },
              { key: 'purity_percent', label: 'Purity %' },
              { key: 'stock_ml', label: 'Stock (mL)' },
            ]}
            rows={solvents}
          />
        )}
      </Panel>
    ),
    formulas: (
      <Panel className="p-4">
        {formulas.length === 0 ? (
          <EmptyState
            title="No formulas yet"
            subtitle="Design your perfume concentrate formulas and their components."
          />
        ) : (
          <DataTable
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'description', label: 'Description' },
              { key: 'components', label: 'Components (count)' },
            ]}
            rows={formulas.map(f => ({ ...f, components: f.components?.length }))}
          />
        )}
      </Panel>
    ),
    batches: (
      <Panel className="p-4">
        {batches.length === 0 ? (
          <EmptyState
            title="No batches yet"
            subtitle="Record produced batches, their size and notes."
          />
        ) : (
          <DataTable
            columns={[
              { key: 'code', label: 'Code' },
              { key: 'formula_id', label: 'Formula' },
              { key: 'size_ml', label: 'Size (mL)' },
              { key: 'notes', label: 'Notes' },
            ]}
            rows={batches}
          />
        )}
      </Panel>
    ),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50">
      <div className="flex">
        <Sidebar current={page} onNavigate={setPage} />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {loading ? (
                  <div className="py-20 text-center text-gray-500">Loading...</div>
                ) : (
                  sections[page]
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}
