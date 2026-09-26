import { supabase } from '../lib/supabase'
import type { Database } from '../types/database'

type Tables = Database['public']['Tables']
type TableName = keyof Tables

export function createService<T extends TableName>(table: T) {
  return {
    async getAll(userId: string, select = '*') {
      const { data, error } = await supabase.from(table).select(select).eq('user_id', userId).order('created_at', { ascending: false })
      return { data, error }
    },
    async getById(id: string, select = '*') {
      const { data, error } = await supabase.from(table).select(select).eq('id', id).single()
      return { data, error }
    },
    async insert(record: Tables[T]['Insert']) {
      const { data, error } = await supabase.from(table).insert(record).select().single()
      return { data, error }
    },
    async update(id: string, updates: Tables[T]['Update']) {
      const { data, error } = await supabase.from(table).update(updates).eq('id', id).select().single()
      return { data, error }
    },
    async remove(id: string) {
      const { error } = await supabase.from(table).delete().eq('id', id)
      return { error }
    },
  }
}