// Supabase 客户端配置
// 注意：实际部署时需要替换为真实的 Supabase 项目配置
// 这里我们使用 mock 数据模式，方便本地开发演示
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// 从环境变量读取配置（如果有）
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// 是否使用 mock 模式（没有配置 Supabase 时启用）
export const USE_MOCK = !supabaseUrl || !supabaseAnonKey

// 创建 Supabase 客户端（如果配置了的话）
export const supabase: SupabaseClient | null = USE_MOCK
  ? null
  : createClient(supabaseUrl, supabaseAnonKey)

// 数据库类型定义
export interface User {
  id: string
  username: string
  password: string
  role: 'parent' | 'child'
  name: string
  avatar: string
  points: number
  created_at: string
}

export interface Task {
  id: string
  title: string
  description: string
  icon: string
  points: number
  type: 'daily' | 'weekly' | 'once'
  target_child_id?: string // null 表示所有孩子
  created_at: string
  sort_order: number
}

export interface TaskCompletion {
  id: string
  task_id: string
  child_id: string
  completed_at: string
  date: string // YYYY-MM-DD
  week: number // 年份+周数
  points_earned: number
}

export interface Reward {
  id: string
  title: string
  description: string
  icon: string
  points_cost: number
  stock: number // -1 表示无限
  created_at: string
}

export interface RewardRedemption {
  id: string
  reward_id: string
  child_id: string
  status: 'pending' | 'approved' | 'rejected'
  requested_at: string
  reviewed_at?: string
  reviewer_note?: string
}

export interface Message {
  id: string
  from_id: string
  to_id: string
  content: string
  type: 'encouragement' | 'notification'
  read: boolean
  created_at: string
}

export interface PointsTransaction {
  id: string
  child_id: string
  amount: number
  reason: string
  type: 'earn' | 'spend' | 'manual_add' | 'manual_subtract'
  reference_id?: string
  created_at: string
}
