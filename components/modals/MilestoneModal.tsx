'use client'

import { useState, useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import { Modal } from './Modal'
import { IconPicker } from '@/components/ui/IconPicker'
import { Milestone, MilestoneCategory, MilestoneIcon, LaneId, SwimLane } from '@/types'
import { cn } from '@/lib/utils'

interface MilestoneModalProps {
  open: boolean
  onClose: () => void
  milestone?: Milestone | null
  lanes: SwimLane[]
  defaultLaneId?: LaneId
  onAdd: (data: Omit<Milestone, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  onUpdate: (id: string, data: Partial<Milestone>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

const CATEGORIES: { value: MilestoneCategory; label: string }[] = [
  { value: 'professional', label: 'Professional' },
  { value: 'financial', label: 'Financial' },
  { value: 'life', label: 'Life' },
]

export function MilestoneModal({
  open,
  onClose,
  milestone,
  lanes,
  defaultLaneId,
  onAdd,
  onUpdate,
  onDelete,
}: MilestoneModalProps) {
  const isEdit = !!milestone

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [age, setAge] = useState(52)
  const [laneId, setLaneId] = useState<LaneId>(defaultLaneId || 'career')
  const [category, setCategory] = useState<MilestoneCategory>('professional')
  const [icon, setIcon] = useState<MilestoneIcon>('flag')
  const [completed, setCompleted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (milestone) {
      setTitle(milestone.title)
      setDescription(milestone.description || '')
      setAge(milestone.age)
      setLaneId(milestone.lane_id)
      setCategory(milestone.category)
      setIcon(milestone.icon)
      setCompleted(milestone.completed)
    } else {
      setTitle('')
      setDescription('')
      setAge(52)
      setLaneId(defaultLaneId || 'career')
      setCategory('professional')
      setIcon('flag')
      setCompleted(false)
    }
    setError(null)
  }, [milestone, defaultLaneId, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setSaving(true)
    setError(null)
    try {
      if (isEdit && milestone) {
        await onUpdate(milestone.id, { title, description, age, lane_id: laneId, category, icon, completed })
      } else {
        await onAdd({ title, description, age, lane_id: laneId, category, icon, completed })
      }
      onClose()
    } catch {
      setError('Failed to save milestone. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!milestone) return
    setDeleting(true)
    try {
      await onDelete(milestone.id)
      onClose()
    } catch {
      setError('Failed to delete milestone.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Milestone' : 'Add Milestone'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g. Retire from Accenture"
            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Optional details..."
            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
          />
        </div>

        {/* Age + Lane row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(parseFloat(e.target.value))}
              min={52}
              max={82}
              step={0.5}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Lane</label>
            <select
              value={laneId}
              onChange={(e) => setLaneId(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {lanes.map((lane) => (
                <option key={lane.id} value={lane.id}>{lane.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
          <div className="flex gap-2">
            {CATEGORIES.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setCategory(value)}
                className={cn(
                  'flex-1 py-1.5 rounded-lg text-sm font-medium border transition-all',
                  category === value
                    ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                    : 'border-slate-600 bg-slate-700/50 text-slate-400 hover:border-slate-400'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Icon Picker */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Icon</label>
          <IconPicker value={icon} onChange={setIcon} />
        </div>

        {/* Completed */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="completed"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
            className="w-4 h-4 rounded border-slate-600 bg-slate-900 accent-indigo-500"
          />
          <label htmlFor="completed" className="text-sm text-slate-300">Mark as completed</label>
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-900/20 border border-red-800/50 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          {isEdit ? (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-900/20 transition-colors disabled:opacity-50"
            >
              <Trash2 size={15} />
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm text-slate-400 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !title.trim()}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Milestone'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
