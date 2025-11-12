import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'

export default function DataTable({ title, columns, endpoint, createFields }) {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({})
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async () => {
    try {
      const res = await fetch(`${baseUrl}${endpoint}`)
      const data = await res.json()
      setItems(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => { load() }, [endpoint])

  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setForm({})
        setOpen(false)
        load()
      }
    } catch (e) { console.error(e) }
  }

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-xl border border-white/50 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow">
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              {columns.map((c) => (
                <th key={c.key} className="py-2 pr-6 font-medium">{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((row, idx) => (
              <tr key={idx} className="border-t border-gray-200/60">
                {columns.map((c) => (
                  <td key={c.key} className="py-3 pr-6 text-gray-800">{String(row[c.key] ?? '')}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 flex items-center justify-center p-6"
          >
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} className="bg-white rounded-xl p-5 w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Add {title.slice(0, -1)}</h4>
                <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
              </div>
              <form onSubmit={submit} className="space-y-3">
                {createFields.map((f) => (
                  <div key={f.key} className="space-y-1">
                    <label className="block text-xs text-gray-500">{f.label}</label>
                    <input
                      value={form[f.key] ?? ''}
                      onChange={(e) => setForm((s) => ({ ...s, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
                      type={f.type || 'text'}
                      placeholder={f.placeholder}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    />
                  </div>
                ))}
                <div className="pt-2 flex items-center gap-2">
                  <button type="submit" className="px-4 py-2 text-sm rounded-md bg-indigo-600 text-white">Save</button>
                  <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-sm rounded-md bg-gray-100 text-gray-700">Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
