'use client'

import { useState } from 'react'
import { useDashboard } from '@/hooks/useDashboard'
import { Header } from '@/components/layout/Header'
import { ProjectionPanel } from '@/components/projection/ProjectionPanel'
import { TimelineCanvas } from '@/components/timeline/TimelineCanvas'
import { MilestoneModal } from '@/components/modals/MilestoneModal'
import { NetWorthModal } from '@/components/modals/NetWorthModal'
import { Milestone, DashboardState } from '@/types'
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react'

type ModalState =
  | { type: 'closed' }
  | { type: 'add'; laneId?: string }
  | { type: 'edit'; milestone: Milestone }
  | { type: 'networth' }

export default function DashboardPage() {
  const {
    milestones,
    lanes,
    netWorthData,
    settings,
    loading,
    error,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    updateZoom,
    updateNetWorthData,
    refetch,
  } = useDashboard()

  const [modal, setModal] = useState<ModalState>({ type: 'closed' })

  const handleMilestoneClick = (milestone: Milestone) => {
    setModal({ type: 'edit', milestone })
  }

  const handleAddMilestoneInLane = (laneId: string) => {
    setModal({ type: 'add', laneId })
  }

  const handleAddMilestone = () => {
    setModal({ type: 'add' })
  }

  const handleCloseModal = () => {
    setModal({ type: 'closed' })
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 size={32} className="animate-spin text-indigo-400" />
          <p className="text-sm">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-4 text-center max-w-md px-6">
          <AlertCircle size={40} className="text-red-400" />
          <div>
            <p className="text-lg font-semibold text-slate-200">Failed to load dashboard</p>
            <p className="text-sm text-slate-400 mt-1">{error}</p>
          </div>
          <button
            onClick={refetch}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-slate-900 overflow-hidden">
      {/* Header */}
      <Header
        zoom={settings.timeline_zoom}
        onZoomChange={updateZoom}
        onAddMilestone={handleAddMilestone}
        ownerName={settings.owner_name}
      />

      {/* Projection Panel */}
      <ProjectionPanel
        data={netWorthData}
        settings={settings}
        onEditData={() => setModal({ type: 'networth' })}
      />

      {/* Timeline Canvas - fills remaining space */}
      <TimelineCanvas
        lanes={lanes}
        milestones={milestones}
        settings={settings}
        onMilestoneClick={handleMilestoneClick}
        onAddMilestoneInLane={handleAddMilestoneInLane}
      />

      {/* Milestone Modal */}
      <MilestoneModal
        open={modal.type === 'add' || modal.type === 'edit'}
        onClose={handleCloseModal}
        milestone={modal.type === 'edit' ? modal.milestone : null}
        lanes={lanes}
        defaultLaneId={modal.type === 'add' ? modal.laneId : undefined}
        onAdd={addMilestone}
        onUpdate={updateMilestone}
        onDelete={deleteMilestone}
      />

      {/* Net Worth Modal */}
      <NetWorthModal
        open={modal.type === 'networth'}
        onClose={handleCloseModal}
        data={netWorthData}
        onSave={updateNetWorthData}
      />
    </div>
  )
}
