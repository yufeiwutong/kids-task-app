import type {
  User, Task, TaskCompletion, Reward, RewardRedemption, Message, PointsTransaction
} from '../types'

const STORAGE_KEY = 'kids-task-app-data'

interface AppData {
  users: User[]
  tasks: Task[]
  taskCompletions: TaskCompletion[]
  rewards: Reward[]
  rewardRedemptions: RewardRedemption[]
  messages: Message[]
  pointsTransactions: PointsTransaction[]
  currentUserId: string | null
}

const generateId = () => Math.random().toString(36).substring(2, 15)

const getTodayStr = () => {
  const d = new Date()
  return d.toISOString().split('T')[0]
}

const getWeekNumber = (date: Date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return d.getUTCFullYear() * 100 + Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7))
}

// 初始化默认数据
const getDefaultData = (): AppData => ({
  users: [
    {
      id: 'parent-1',
      username: 'parent',
      password: '123456',
      role: 'parent',
      name: '家长',
      avatar: '👨‍👩‍👧‍👦',
      points: 0,
      created_at: new Date().toISOString(),
    },
    {
      id: 'child-1',
      username: 'baobao',
      password: '123456',
      role: 'child',
      name: '宝宝',
      avatar: '👦',
      points: 50,
      created_at: new Date().toISOString(),
    },
    {
      id: 'child-2',
      username: 'beibei',
      password: '123456',
      role: 'child',
      name: '贝贝',
      avatar: '👧',
      points: 30,
      created_at: new Date().toISOString(),
    },
  ],
  tasks: [
    {
      id: 'task-1',
      title: '按时起床',
      description: '每天早上7点前起床',
      icon: '🌅',
      points: 5,
      type: 'daily',
      sort_order: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 'task-2',
      title: '叠被子',
      description: '起床后自己叠好被子',
      icon: '🛏️',
      points: 3,
      type: 'daily',
      sort_order: 2,
      created_at: new Date().toISOString(),
    },
    {
      id: 'task-3',
      title: '认真洗漱',
      description: '刷牙洗脸，干干净净',
      icon: '🪥',
      points: 3,
      type: 'daily',
      sort_order: 3,
      created_at: new Date().toISOString(),
    },
    {
      id: 'task-4',
      title: '按时吃饭',
      description: '三餐按时好好吃饭，不挑食',
      icon: '🍚',
      points: 5,
      type: 'daily',
      sort_order: 4,
      created_at: new Date().toISOString(),
    },
    {
      id: 'task-5',
      title: '完成作业',
      description: '认真完成当天的作业',
      icon: '📚',
      points: 10,
      type: 'daily',
      sort_order: 5,
      created_at: new Date().toISOString(),
    },
    {
      id: 'task-6',
      title: '阅读30分钟',
      description: '每天阅读课外书30分钟',
      icon: '📖',
      points: 8,
      type: 'daily',
      sort_order: 6,
      created_at: new Date().toISOString(),
    },
    {
      id: 'task-7',
      title: '打扫房间',
      description: '每周打扫自己的房间',
      icon: '🧹',
      points: 15,
      type: 'weekly',
      sort_order: 7,
      created_at: new Date().toISOString(),
    },
    {
      id: 'task-8',
      title: '帮妈妈做家务',
      description: '主动帮忙做家务一次',
      icon: '🧺',
      points: 10,
      type: 'weekly',
      sort_order: 8,
      created_at: new Date().toISOString(),
    },
    {
      id: 'task-9',
      title: '看完一本书',
      description: '完整看完一本课外书',
      icon: '📕',
      points: 50,
      type: 'once',
      sort_order: 9,
      created_at: new Date().toISOString(),
    },
    {
      id: 'task-10',
      title: '学会一首古诗',
      description: '背诵并理解一首古诗',
      icon: '🎋',
      points: 20,
      type: 'once',
      sort_order: 10,
      created_at: new Date().toISOString(),
    },
  ],
  taskCompletions: [],
  rewards: [
    {
      id: 'reward-1',
      title: '看动画片30分钟',
      description: '可以多看30分钟动画片',
      icon: '📺',
      points_cost: 20,
      stock: -1,
      created_at: new Date().toISOString(),
    },
    {
      id: 'reward-2',
      title: '吃一次零食',
      description: '可以选一样喜欢的零食',
      icon: '🍭',
      points_cost: 15,
      stock: -1,
      created_at: new Date().toISOString(),
    },
    {
      id: 'reward-3',
      title: '去公园玩',
      description: '周末去公园玩一次',
      icon: '🎡',
      points_cost: 50,
      stock: -1,
      created_at: new Date().toISOString(),
    },
    {
      id: 'reward-4',
      title: '买一个小玩具',
      description: '可以选一个小玩具',
      icon: '🧸',
      points_cost: 100,
      stock: -1,
      created_at: new Date().toISOString(),
    },
    {
      id: 'reward-5',
      title: '游乐园一日游',
      description: '去游乐园玩一整天',
      icon: '🎢',
      points_cost: 300,
      stock: -1,
      created_at: new Date().toISOString(),
    },
  ],
  rewardRedemptions: [],
  messages: [],
  pointsTransactions: [
    {
      id: 'tx-1',
      child_id: 'child-1',
      amount: 50,
      reason: '初始积分',
      type: 'manual_add',
      created_at: new Date().toISOString(),
    },
    {
      id: 'tx-2',
      child_id: 'child-2',
      amount: 30,
      reason: '初始积分',
      type: 'manual_add',
      created_at: new Date().toISOString(),
    },
  ],
  currentUserId: null,
})

// 从 localStorage 读取数据
export const loadData = (): AppData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw)
    }
  } catch (e) {
    console.error('加载数据失败', e)
  }
  const defaultData = getDefaultData()
  saveData(defaultData)
  return defaultData
}

// 保存数据到 localStorage
export const saveData = (data: AppData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('保存数据失败', e)
  }
}

// 重置为默认数据
export const resetData = () => {
  const defaultData = getDefaultData()
  saveData(defaultData)
  return defaultData
}

// ========== 认证相关 ==========

export const login = (username: string, password: string): User | null => {
  const data = loadData()
  const user = data.users.find(
    (u) => u.username === username && u.password === password
  )
  if (user) {
    data.currentUserId = user.id
    saveData(data)
    return user
  }
  return null
}

export const logout = () => {
  const data = loadData()
  data.currentUserId = null
  saveData(data)
}

export const getCurrentUser = (): User | null => {
  const data = loadData()
  if (!data.currentUserId) return null
  return data.users.find((u) => u.id === data.currentUserId) || null
}

// ========== 用户管理 ==========

export const getChildren = (): User[] => {
  const data = loadData()
  return data.users.filter((u) => u.role === 'child')
}

export const getChildById = (id: string): User | undefined => {
  const data = loadData()
  return data.users.find((u) => u.id === id)
}

export const addChild = (name: string, username: string, password: string, avatar: string): User => {
  const data = loadData()
  const newChild: User = {
    id: generateId(),
    username,
    password,
    role: 'child',
    name,
    avatar,
    points: 0,
    created_at: new Date().toISOString(),
  }
  data.users.push(newChild)
  saveData(data)
  return newChild
}

export const updateChildPoints = (childId: string, delta: number, reason: string, type: 'manual_add' | 'manual_subtract') => {
  const data = loadData()
  const child = data.users.find((u) => u.id === childId)
  if (child) {
    child.points += delta
    const tx: PointsTransaction = {
      id: generateId(),
      child_id: childId,
      amount: delta,
      reason,
      type,
      created_at: new Date().toISOString(),
    }
    data.pointsTransactions.push(tx)
    saveData(data)
  }
}

// ========== 任务管理 ==========

export const getTasks = (): Task[] => {
  const data = loadData()
  return [...data.tasks].sort((a, b) => a.sort_order - b.sort_order)
}

export const addTask = (task: Omit<Task, 'id' | 'created_at' | 'sort_order'>): Task => {
  const data = loadData()
  const newTask: Task = {
    ...task,
    id: generateId(),
    created_at: new Date().toISOString(),
    sort_order: data.tasks.length + 1,
  }
  data.tasks.push(newTask)
  saveData(data)
  return newTask
}

export const updateTask = (id: string, updates: Partial<Task>) => {
  const data = loadData()
  const idx = data.tasks.findIndex((t) => t.id === id)
  if (idx !== -1) {
    data.tasks[idx] = { ...data.tasks[idx], ...updates }
    saveData(data)
  }
}

export const deleteTask = (id: string) => {
  const data = loadData()
  data.tasks = data.tasks.filter((t) => t.id !== id)
  saveData(data)
}

// ========== 打卡相关 ==========

export const getTodayCompletions = (childId: string, date: string = getTodayStr()): TaskCompletion[] => {
  const data = loadData()
  return data.taskCompletions.filter(
    (c) => c.child_id === childId && c.date === date
  )
}

export const getWeekCompletions = (childId: string, week: number): TaskCompletion[] => {
  const data = loadData()
  return data.taskCompletions.filter(
    (c) => c.child_id === childId && c.week === week
  )
}

export const isTaskCompleted = (taskId: string, childId: string): boolean => {
  const data = loadData()
  const task = data.tasks.find((t) => t.id === taskId)
  if (!task) return false

  const today = getTodayStr()
  const currentWeek = getWeekNumber(new Date())

  if (task.type === 'daily') {
    return data.taskCompletions.some(
      (c) => c.task_id === taskId && c.child_id === childId && c.date === today
    )
  } else if (task.type === 'weekly') {
    return data.taskCompletions.some(
      (c) => c.task_id === taskId && c.child_id === childId && c.week === currentWeek
    )
  } else {
    // 一次性任务
    return data.taskCompletions.some(
      (c) => c.task_id === taskId && c.child_id === childId
    )
  }
}

export const completeTask = (taskId: string, childId: string): TaskCompletion | null => {
  if (isTaskCompleted(taskId, childId)) return null

  const data = loadData()
  const task = data.tasks.find((t) => t.id === taskId)
  const child = data.users.find((u) => u.id === childId)
  if (!task || !child) return null

  const today = getTodayStr()
  const currentWeek = getWeekNumber(new Date())

  const completion: TaskCompletion = {
    id: generateId(),
    task_id: taskId,
    child_id: childId,
    completed_at: new Date().toISOString(),
    date: today,
    week: currentWeek,
    points_earned: task.points,
  }

  data.taskCompletions.push(completion)
  child.points += task.points

  const tx: PointsTransaction = {
    id: generateId(),
    child_id: childId,
    amount: task.points,
    reason: `完成任务: ${task.title}`,
    type: 'earn',
    reference_id: completion.id,
    created_at: new Date().toISOString(),
  }
  data.pointsTransactions.push(tx)

  saveData(data)
  return completion
}

// 获取某月的打卡记录（日历用）
export const getMonthCompletions = (childId: string, year: number, month: number): TaskCompletion[] => {
  const data = loadData()
  return data.taskCompletions.filter((c) => {
    if (c.child_id !== childId) return false
    const d = new Date(c.date)
    return d.getFullYear() === year && d.getMonth() === month
  })
}

// ========== 奖励管理 ==========

export const getRewards = (): Reward[] => {
  const data = loadData()
  return data.rewards
}

export const addReward = (reward: Omit<Reward, 'id' | 'created_at'>): Reward => {
  const data = loadData()
  const newReward: Reward = {
    ...reward,
    id: generateId(),
    created_at: new Date().toISOString(),
  }
  data.rewards.push(newReward)
  saveData(data)
  return newReward
}

export const updateReward = (id: string, updates: Partial<Reward>) => {
  const data = loadData()
  const idx = data.rewards.findIndex((r) => r.id === id)
  if (idx !== -1) {
    data.rewards[idx] = { ...data.rewards[idx], ...updates }
    saveData(data)
  }
}

export const deleteReward = (id: string) => {
  const data = loadData()
  data.rewards = data.rewards.filter((r) => r.id !== id)
  saveData(data)
}

// ========== 兑换相关 ==========

export const requestRedemption = (rewardId: string, childId: string): RewardRedemption | null => {
  const data = loadData()
  const reward = data.rewards.find((r) => r.id === rewardId)
  const child = data.users.find((u) => u.id === childId)
  if (!reward || !child) return null
  if (child.points < reward.points_cost) return null

  const redemption: RewardRedemption = {
    id: generateId(),
    reward_id: rewardId,
    child_id: childId,
    status: 'pending',
    requested_at: new Date().toISOString(),
  }

  data.rewardRedemptions.push(redemption)
  saveData(data)
  return redemption
}

export const getRedemptions = (status?: string): RewardRedemption[] => {
  const data = loadData()
  let list = [...data.rewardRedemptions]
  if (status) {
    list = list.filter((r) => r.status === status)
  }
  return list.sort((a, b) => new Date(b.requested_at).getTime() - new Date(a.requested_at).getTime())
}

export const getChildRedemptions = (childId: string): RewardRedemption[] => {
  const data = loadData()
  return data.rewardRedemptions
    .filter((r) => r.child_id === childId)
    .sort((a, b) => new Date(b.requested_at).getTime() - new Date(a.requested_at).getTime())
}

export const reviewRedemption = (id: string, approved: boolean, note?: string) => {
  const data = loadData()
  const redemption = data.rewardRedemptions.find((r) => r.id === id)
  if (!redemption || redemption.status !== 'pending') return

  const reward = data.rewards.find((r) => r.id === redemption.reward_id)
  const child = data.users.find((u) => u.id === redemption.child_id)
  if (!reward || !child) return

  redemption.status = approved ? 'approved' : 'rejected'
  redemption.reviewed_at = new Date().toISOString()
  redemption.reviewer_note = note

  if (approved) {
    // 扣除积分
    child.points -= reward.points_cost
    const tx: PointsTransaction = {
      id: generateId(),
      child_id: redemption.child_id,
      amount: -reward.points_cost,
      reason: `兑换奖励: ${reward.title}`,
      type: 'spend',
      reference_id: redemption.id,
      created_at: new Date().toISOString(),
    }
    data.pointsTransactions.push(tx)
  }

  saveData(data)
}

// ========== 消息相关 ==========

export const getMessages = (userId: string): Message[] => {
  const data = loadData()
  return data.messages
    .filter((m) => m.to_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export const sendMessage = (fromId: string, toId: string, content: string, type: 'encouragement' | 'notification' = 'encouragement') => {
  const data = loadData()
  const msg: Message = {
    id: generateId(),
    from_id: fromId,
    to_id: toId,
    content,
    type,
    read: false,
    created_at: new Date().toISOString(),
  }
  data.messages.push(msg)
  saveData(data)
}

export const markMessageRead = (id: string) => {
  const data = loadData()
  const msg = data.messages.find((m) => m.id === id)
  if (msg) {
    msg.read = true
    saveData(data)
  }
}

export const getUnreadCount = (userId: string): number => {
  const data = loadData()
  return data.messages.filter((m) => m.to_id === userId && !m.read).length
}

// ========== 统计相关 ==========

export const getPointsTransactions = (childId: string): PointsTransaction[] => {
  const data = loadData()
  return data.pointsTransactions
    .filter((t) => t.child_id === childId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export const getChildStats = (childId: string) => {
  const data = loadData()
  const child = data.users.find((u) => u.id === childId)
  if (!child) return null

  const today = getTodayStr()
  const currentWeek = getWeekNumber(new Date())

  const todayCompletions = data.taskCompletions.filter(
    (c) => c.child_id === childId && c.date === today
  )
  const weekCompletions = data.taskCompletions.filter(
    (c) => c.child_id === childId && c.week === currentWeek
  )

  const totalTasks = data.tasks.length
  const dailyTasks = data.tasks.filter((t) => t.type === 'daily').length

  return {
    totalPoints: child.points,
    todayCompleted: todayCompletions.length,
    todayTotal: dailyTasks,
    weekCompleted: weekCompletions.length,
    totalTasks,
  }
}

export { getTodayStr, getWeekNumber }
