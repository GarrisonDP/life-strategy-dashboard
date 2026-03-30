'use client'

import { useState } from 'react'
import { Modal } from './Modal'
import { NetWorthDataPoint } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { projectWithGrowthRate } from '@/lib/projectionMath'
import { AGE_START, AGE_END } from '@/lib/constants'

interface NetWorthModalProps {
  open: boolean
  onClose: () => void
  data: NetWorthDataPoint[]
  onSave: (points: NetWorthDataPoint[]) => Promise<void>
}

export function NetWorthModal({ open, onClose, data, onSave }: NetWorthModalProps) {
  const [rows, setRows] = useState<NetWorthDataPoint[]>(() =>
    data.length > 0 ? [...data] : []
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [growthRate, setGrowthRate] = useState(8)

  // Sync when data changes and modal opens
  const handleOpen = () => {
    setRows([...data])
    setError(null)
  }

  const updateRow = (age: number, field: 'net_worth' | 'retirement_savings', value: number) => {
    setRows((prev) =>
      prev.map((r) => (r.age === age ? { ...r, [field]: value } : r))
    )
  }

  const fillFromGrowthRate = () => {
    const startRow = rows.find((r) => r.age === AGE_START)
    const startValue = startRow?.net_worth ?? 1500000
    const projected = projectWithGrowthRate(AGE_START, startValue, growthRate / 100, AGE_END)
    setRows(projected)
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      await onSave(rows)
      onClose()
    } catch {
      setError('Failed to save projection data.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Net Worth Projections"
      width="max-w-2xl"
    >
      <div onFocus={handleOpen}>
        {/* Growth rate calculator */}
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-3">
          <span className="text-sm text-slate-400">Fill from growth rate:</span>
          <input
            type="number"
            value={growthRate}
            onChange={(e) => setGrowthRate(parseFloat(e.target.value))}
            min={0}
            max={30}
            step={0.5}
            className="w-20 rounded-md border border-slate-600 bg-slate-800 px-2 py-1 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
          />
          <span className="text-sm text-slate-400">% / yr</span>
          <button
            type="button"
            onClick={fillFromGrowthRate}
            className="ml-auto rounded-lg bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-600 transition-colors"
          >
            Apply
          </button>
        </div>

        {/* Data table */}
        <div className="max-h-[50vh] overflow-y-auto rounded-lg border border-slate-700">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-slate-800 border-b border-slate-700">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wide">Age</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wide">Net Worth</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wide">Retirement Savings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {rows.map((row) => (
                <tr key={row.age} className="hover:bg-slate-700/20">
                  <td className="px-4 py-2 font-medium text-slate-200">
                    Age {row.age}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={row.net_worth}
                        onChange={(e) => updateRow(row.age, 'net_worth', parseInt(e.target.value) || 0)}
                        step={10000}
                        className="w-32 rounded border border-slate-600 bg-slate-900 px-2 py-1 text-slate-100 focus:border-indigo-500 focus:outline-none text-sm"
                      />
                      <span className="text-slate-500 text-xs">{formatCurrency(row.net_worth)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={row.retirement_savings}
                        onChange={(e) => updateRow(row.age, 'retirement_savings', parseInt(e.target.value) || 0)}
                        step={10000}
                        className="w-32 rounded border border-slate-600 bg-slate-900 px-2 py-1 text-slate-100 focus:border-indigo-500 focus:outline-none text-sm"
                      />
                      <span className="text-slate-500 text-xs">{formatCurrency(row.retirement_savings)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-400 bg-red-900/20 border border-red-800/50 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-slate-400 hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
