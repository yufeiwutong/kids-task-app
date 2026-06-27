import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import * as mockService from '../../services/mockData'
import type { Task, TaskCompletion } from '../../types'
import { Check, Star, Zap } from 'lucide-react'
import ChildBottomNav from '../../components/ChildBottomNav'

const ChildHomePage = () => {
  const { currentUser, refreshUser } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [completedToday, setCompletedToday] = useState<TaskCompletion[]>([])
  const [animatingTask, setAnimatingTask] = useState<string | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [earnedPoints, setEarnedPoints] = useState(0)
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'once'>('daily')

  const loadData = () => {
    if (!currentUser) return
    setTasks(mockService.getTasks())
    setCompletedToday(mockService.getTodayCompletions(currentUser.id))
  }

  useEffect(() => {
    loadData()
  }, [currentUser])

  const handleComplete = async (taskId: string) => {
    if (!currentUser) return
    if (mockService.isTaskCompleted(taskId, currentUser.id)) return

    setAnimatingTask(taskId)

    // 模拟延迟效果
    await new Promise((resolve) => setTimeout(resolve, 500))

    const result = mockService.completeTask(taskId, currentUser.id)
    if (result) {
      setEarnedPoints(result.points_earned)
      setShowCelebration(true)
      refreshUser()
      loadData()

      setTimeout(() => {
        setShowCelebration(false)
      }, 2000)
    }

    setAnimatingTask(null)
  }

  const filteredTasks = tasks.filter((t) => t.type === activeTab)

  const todayEarnedPoints = completedToday.reduce((sum, c) => sum + c.points_earned, 0)
  const dailyTaskCount = tasks.filter((t) => t.type === 'daily').length
  const todayCompletedCount = completedToday.filter((c) => {
    const task = tasks.find((t) => t.id === c.task_id)
    return task?.type === 'daily'
  }).length

  const tabConfig = [
    { key: 'daily', label: '每日任务', emoji: '☀️' },
    { key: 'weekly', label: '每周任务', emoji: '📅' },
    { key: 'once', label: '挑战任务', emoji: '🏆' },
  ] as const

  return (
    <div className="min-h-screen pb-24">
      {/* 顶部区域 */}
      <div className="bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 text-white rounded-b-[40px] p-6 pt-12">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-5xl animate-bounce-slow">{currentUser?.avatar}</div>
            <div>
              <p className="text-white/80 text-sm">你好呀 👋</p>
              <h1 className="text-2xl font-bold">{currentUser?.name}</h1>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-2xl px-4 py-2">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-300" fill="currentColor" />
              <span className="text-xl font-bold">{currentUser?.points}</span>
            </div>
            <p className="text-xs text-white/70">积分</p>
          </div>
        </div>

        {/* 今日进度 */}
        <div className="bg-white/15 backdrop-blur rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">今日进度</span>
            <span className="text-sm font-bold">
              {todayCompletedCount} / {dailyTaskCount}
            </span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-full transition-all duration-500"
              style={{
                width: dailyTaskCount > 0 ? `${(todayCompletedCount / dailyTaskCount) * 100}%` : '0%',
              }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-sm">
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-yellow-300" fill="currentColor" />
              <span>今日已获得 {todayEarnedPoints} 积分</span>
            </div>
          </div>
        </div>
      </div>

      {/* 标签切换 */}
      <div className="px-4 py-4">
        <div className="flex bg-gray-100 rounded-2xl p-1">
          {tabConfig.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 px-2 rounded-xl font-bold text-sm transition-all ${
                activeTab === tab.key
                  ? 'bg-white text-primary-600 shadow-md scale-105'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="mr-1">{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 任务列表 */}
      <div className="px-4 space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-5xl mb-3">📋</div>
            <p>暂无任务</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = currentUser
              ? mockService.isTaskCompleted(task.id, currentUser.id)
              : false
            const isAnimating = animatingTask === task.id

            return (
              <div
                key={task.id}
                className={`bg-white rounded-2xl p-4 shadow-md border-2 transition-all card-hover ${
                  isCompleted
                    ? 'border-secondary-300 bg-secondary-50'
                    : 'border-gray-100'
                } ${isAnimating ? 'animate-pop scale-105' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`text-4xl ${
                      isCompleted ? '' : 'animate-float'
                    }`}
                  >
                    {task.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-bold text-lg ${
                        isCompleted
                          ? 'text-gray-400 line-through'
                          : 'text-gray-800'
                      }`}
                    >
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {task.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-primary-500 font-bold">
                      <Star className="w-4 h-4" fill="currentColor" />
                      {task.points}
                    </div>
                    <button
                      onClick={() => handleComplete(task.id)}
                      disabled={isCompleted || isAnimating}
                      className={`mt-2 px-4 py-1.5 rounded-xl text-sm font-bold transition-all btn-press ${
                        isCompleted
                          ? 'bg-secondary-100 text-secondary-600 cursor-default'
                          : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md hover:shadow-lg'
                      }`}
                    >
                      {isCompleted ? (
                        <span className="flex items-center gap-1">
                          <Check className="w-4 h-4" /> 已完成
                        </span>
                      ) : isAnimating ? (
                        '打卡中...'
                      ) : (
                        '打卡'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* 庆祝动画 */}
      {showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl animate-pop text-center">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-2xl font-bold text-primary-600 mb-2">太棒了！</h2>
            <div className="flex items-center justify-center gap-2 text-xl font-bold text-primary-500">
              <Star className="w-6 h-6" fill="currentColor" />
              +{earnedPoints} 积分
            </div>
            <p className="text-gray-500 mt-2">继续加油哦～</p>
          </div>
        </div>
      )}

      <ChildBottomNav />
    </div>
  )
}

export default ChildHomePage
