'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Milestone, SwimLane, NetWorthDataPoint, DashboardState } from '@/types'

const DEFAULT_SETTINGS: DashboardState = {
  owner_name: 'Garrison',
  current_age: 52,
  birth_year: 1974,
  retirement_age: 62,
  timeline_zoom: 'comfortable',
}

export function useDashboard() {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [lanes, setLanes] = useState<SwimLane[]>([])
  const [netWorthData, setNetWorthData] = useState<NetWorthDataPoint[]>([])
  const [settings, setSettings] = useState<DashboardState>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all data
  const fetchAll = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [lanesRes, milestonesRes, netWorthRes, settingsRes] = await Promise.all([
        supabase.from('swim_lanes').select('*').order('sort_order'),
        supabase.from('milestones').select('*').order('age'),
        supabase.from('net_worth_data').select('*').order('age'),
        supabase.from('dashboard_settings').select('*').limit(1).single(),
      ])

      if (lanesRes.error) throw lanesRes.error
      if (milestonesRes.error) throw milestonesRes.error
      if (netWorthRes.error) throw netWorthRes.error

      setLanes(lanesRes.data || [])
      setMilestones(milestonesRes.data || [])
      setNetWorthData(netWorthRes.data || [])

      if (settingsRes.data) {
        setSettings({
          owner_name: settingsRes.data.owner_name,
          current_age: settingsRes.data.current_age,
          birth_year: settingsRes.data.birth_year,
          retirement_age: settingsRes.data.retirement_age,
          target_net_worth: settingsRes.data.target_net_worth,
          timeline_zoom: settingsRes.data.timeline_zoom as DashboardState['timeline_zoom'],
        })
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load data'
      setError(message)
      console.error('Dashboard fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  // Milestone operations
  const addMilestone = useCallback(async (data: Omit<Milestone, 'id' | 'created_at' | 'updated_at'>) => {
    const tempId = `temp-${Date.now()}`
    const optimistic: Milestone = {
      ...data,
      id: tempId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setMilestones((prev) => [...prev, optimistic].sort((a, b) => a.age - b.age))

    try {
      const { data: created, error } = await supabase
        .from('milestones')
        .insert({
          lane_id: data.lane_id,
          age: data.age,
          title: data.title,
          description: data.description,
          category: data.category,
          icon: data.icon,
          color: data.color,
          completed: data.completed,
        })
        .select()
        .single()

      if (error) throw error

      setMilestones((prev) =>
        prev.map((m) => (m.id === tempId ? created : m)).sort((a, b) => a.age - b.age)
      )
    } catch (err) {
      setMilestones((prev) => prev.filter((m) => m.id !== tempId))
      console.error('Add milestone error:', err)
      throw err
    }
  }, [])

  const updateMilestone = useCallback(async (id: string, data: Partial<Milestone>) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...data, updated_at: new Date().toISOString() } : m))
    )

    try {
      const { error } = await supabase
        .from('milestones')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
    } catch (err) {
      console.error('Update milestone error:', err)
      await fetchAll()
      throw err
    }
  }, [fetchAll])

  const deleteMilestone = useCallback(async (id: string) => {
    const prev = milestones.find((m) => m.id === id)
    setMilestones((prev) => prev.filter((m) => m.id !== id))

    try {
      const { error } = await supabase.from('milestones').delete().eq('id', id)
      if (error) throw error
    } catch (err) {
      if (prev) setMilestones((p) => [...p, prev].sort((a, b) => a.age - b.age))
      console.error('Delete milestone error:', err)
      throw err
    }
  }, [milestones])

  // Settings operations
  const updateZoom = useCallback(async (zoom: DashboardState['timeline_zoom']) => {
    setSettings((prev) => ({ ...prev, timeline_zoom: zoom }))
    try {
      await supabase
        .from('dashboard_settings')
        .update({ timeline_zoom: zoom, updated_at: new Date().toISOString() })
        .not('id', 'is', null)
    } catch (err) {
      console.error('Update zoom error:', err)
    }
  }, [])

  const updateSettings = useCallback(async (data: Partial<DashboardState>) => {
    setSettings((prev) => ({ ...prev, ...data }))
    try {
      await supabase
        .from('dashboard_settings')
        .update({ ...data, updated_at: new Date().toISOString() })
        .not('id', 'is', null)
    } catch (err) {
      console.error('Update settings error:', err)
    }
  }, [])

  // Net worth operations
  const updateNetWorthData = useCallback(async (points: NetWorthDataPoint[]) => {
    setNetWorthData(points)
    try {
      for (const point of points) {
        await supabase
          .from('net_worth_data')
          .upsert(
            {
              age: point.age,
              net_worth: point.net_worth,
              retirement_savings: point.retirement_savings,
              note: point.note,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'age' }
          )
      }
    } catch (err) {
      console.error('Update net worth error:', err)
      await fetchAll()
      throw err
    }
  }, [fetchAll])

  return {
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
    updateSettings,
    updateNetWorthData,
    refetch: fetchAll,
  }
}
