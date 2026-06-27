import { useState, useEffect } from 'react'
import * as mockService from '../../services/mockData'
import type { Task } from '../../types'
import { Plus, Edit2, Trash2, Star } from 'lucide-react'
import ParentBottomNav from '../../components/ParentBottomNav'

const ICON_OPTIONS = [
  '🌅', '🛏️', '🪥', '🍚', '📚', '📖', '🧹', '🧺',
  '🎨', '🎵', '⚽', '🏃', '💪', '🧠', '📝', '🎯',
  '🌱', '🎋', '📕', '🧸', '🎮', '🎬', '🍎', '🥛',
]

const ParentTasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'once'>('daily')
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '⭐',
    points: 5,
    type: 'daily' as 'daily' | 'weekly' | 'once',
  })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  const loadData = () => {
    setTasks(mockService.getTasks())
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredTasks = tasks.filter((t) => t.type === activeTab)

  const openAddModal = () => {
    setEditingTask(null)
    setFormData({
      title: '',
      description: '',
      icon: '⭐',
      points: 5,
      type: activeTab,
    })
    setShowModal(true)
  }

  const openEditModal = (task: Task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description,
      icon: task.icon,
      points: task.points,
      type: task.type,
    })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!formData.title.trim()) return

    if (editingTask) {
      mockService.updateTask(editingTask.id, formData)
    } else {
      mockService.addTask(formData)
    }

    setShowModal(false)
    loadData()
  }

  const handleDelete = (id: string) => {
    mockService.deleteTask(id)
    setShowDeleteConfirm(null)
    loadData()
  }

  const tabConfig = [
    { key: 'daily', label: '每日任务', emoji: '☀️' },
    { key: 'weekly', label: '每周任务', emoji: '📅' },
    { key: 'once', label: '挑战任务', emoji: '🏆' },
  ] as const

  return (
    <div className="min-h-screen pb-24">
      {/* 顶部 */}
      <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 text-white rounded-b-[40px] p-6 pt-12">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">📋 任务管理</h1>
          <button
            onClick={openAddModal}
            className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors btn-press"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
        <p className="text-white/80 text-sm">
          共 {tasks.length} 个任务 · 每日 {tasks.filter(t => t.type === 'daily').length} · 每周 {tasks.filter(t => t.type === 'weekly').length} · 挑战 {tasks.filter(t => t.type === 'once').length}
        </p>
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
                  ? 'bg-white text-secondary-600 shadow-md scale-105'
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
            <button
              onClick={openAddModal}
              className="mt-4 px-6 py-2 bg-secondary-500 text-white rounded-xl font-bold btn-press"
            >
              添加任务
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-2xl p-4 shadow-md border-2 border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">{task.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-800">{task.title}</h3>
                    <div className="flex items-center gap-0.5 text-primary-500 font-bold text-sm">
                      <Star className="w-4 h-4" fill="currentColor" />
                      {task.points}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {task.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(task)}
                    className="p-2 text-kidblue-500 hover:bg-kidblue-50 rounded-xl btn-press"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(task.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl btn-press"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 添加/编辑弹窗 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-pop">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-gray-800">
                {editingTask ? '编辑任务' : '添加任务'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl btn-press"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* 图标选择 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  选择图标
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {ICON_OPTIONS.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`p-2 text-2xl rounded-xl transition-all btn-press ${
                        formData.icon === icon
                          ? 'bg-primary-100 scale-110 ring-2 ring-primary-400'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* 任务名称 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  任务名称
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-secondary-400 focus:outline-none"
                  placeholder="请输入任务名称"
                />
              </div>

              {/* 任务描述 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  任务描述
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-secondary-400 focus:outline-none resize-none"
                  rows={3}
                  placeholder="请输入任务描述"
                />
              </div>

              {/* 积分设置 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  奖励积分
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={formData.points}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        points: parseInt(e.target.value),
                      })
                    }
                    className="flex-1 accent-primary-500"
                  />
                  <div className="flex items-center gap-1 text-primary-500 font-bold text-xl min-w-[80px]">
                    <Star className="w-5 h-5" fill="currentColor" />
                    {formData.points}
                  </div>
                </div>
              </div>

              {/* 任务类型 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  任务类型
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'daily', label: '每日任务', emoji: '☀️' },
                    { key: 'weekly', label: '每周任务', emoji: '📅' },
                    { key: 'once', label: '挑战任务', emoji: '🏆' },
                  ].map((type) => (
                    <button
                      key={type.key}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          type: type.key as 'daily' | 'weekly' | 'once',
                        })
                      }
                      className={`py-3 px-2 rounded-xl font-bold text-sm transition-all ${
                        formData.type === type.key
                          ? 'bg-secondary-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <span className="block text-xl mb-1">{type.emoji}</span>
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 flex gap-3 sticky bottom-0 bg-white">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl btn-press"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.title.trim()}
                className="flex-1 py-3 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white font-bold rounded-xl shadow-md btn-press disabled:opacity-50"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 删除确认弹窗 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full animate-pop">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                确认删除？
              </h3>
              <p className="text-gray-500 mb-6">
                删除后无法恢复，确定要删除这个任务吗？
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl btn-press"
              >
                取消
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl shadow-md btn-press"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}

      <ParentBottomNav />
    </div>
  )
}

export default ParentTasksPage
