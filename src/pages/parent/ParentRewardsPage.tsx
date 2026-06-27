import { useState, useEffect } from 'react'
import * as mockService from '../../services/mockData'
import type { Reward, RewardRedemption, User } from '../../types'
import { Plus, Star, Check, X } from 'lucide-react'
import ParentBottomNav from '../../components/ParentBottomNav'

const ICON_OPTIONS = [
  '📺', '🍭', '🎡', '🧸', '🎢', '🎮', '📱', '🎂',
  '🍦', '🎁', '🏆', '🎨', '📚', '🎵', '⚽', '🚲',
  '🎪', '🎠', '🎯', '💎', '🌈', '🦄', '🐶', '🐱',
]

const ParentRewardsPage = () => {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [redemptions, setRedemptions] = useState<RewardRedemption[]>([])
  const [children, setChildren] = useState<User[]>([])
  const [activeTab, setActiveTab] = useState<'rewards' | 'pending' | 'history'>('rewards')
  const [showModal, setShowModal] = useState(false)
  const [editingReward, setEditingReward] = useState<Reward | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '🎁',
    points_cost: 20,
    stock: -1,
  })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [reviewNote, setReviewNote] = useState('')
  const [reviewingRedemption, setReviewingRedemption] = useState<RewardRedemption | null>(null)

  const loadData = () => {
    setRewards(mockService.getRewards())
    setRedemptions(mockService.getRedemptions())
    setChildren(mockService.getChildren())
  }

  useEffect(() => {
    loadData()
  }, [])

  const pendingCount = redemptions.filter((r) => r.status === 'pending').length

  const openAddModal = () => {
    setEditingReward(null)
    setFormData({
      title: '',
      description: '',
      icon: '🎁',
      points_cost: 20,
      stock: -1,
    })
    setShowModal(true)
  }

  const openEditModal = (reward: Reward) => {
    setEditingReward(reward)
    setFormData({
      title: reward.title,
      description: reward.description,
      icon: reward.icon,
      points_cost: reward.points_cost,
      stock: reward.stock,
    })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!formData.title.trim()) return

    if (editingReward) {
      mockService.updateReward(editingReward.id, formData)
    } else {
      mockService.addReward(formData)
    }

    setShowModal(false)
    loadData()
  }

  const handleDelete = (id: string) => {
    mockService.deleteReward(id)
    setShowDeleteConfirm(null)
    loadData()
  }

  const handleReview = (approved: boolean) => {
    if (!reviewingRedemption) return
    mockService.reviewRedemption(reviewingRedemption.id, approved, reviewNote || undefined)
    setReviewingRedemption(null)
    setReviewNote('')
    loadData()
  }

  const getChild = (id: string) => children.find((c) => c.id === id)
  const getReward = (id: string) => rewards.find((r) => r.id === id)

  return (
    <div className="min-h-screen pb-24">
      {/* 顶部 */}
      <div className="bg-gradient-to-br from-kidpink-500 via-kidpink-600 to-accent-600 text-white rounded-b-[40px] p-6 pt-12">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">🎁 奖励管理</h1>
          <button
            onClick={openAddModal}
            className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors btn-press"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
        <p className="text-white/80 text-sm">
          共 {rewards.length} 个奖励 · {pendingCount} 个待审核
        </p>
      </div>

      {/* 标签切换 */}
      <div className="px-4 py-4">
        <div className="flex bg-gray-100 rounded-2xl p-1">
          <button
            onClick={() => setActiveTab('rewards')}
            className={`flex-1 py-3 px-2 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'rewards'
                ? 'bg-white text-kidpink-600 shadow-md scale-105'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            🏪 奖励商店
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-3 px-2 rounded-xl font-bold text-sm transition-all relative ${
              activeTab === 'pending'
                ? 'bg-white text-kidpink-600 shadow-md scale-105'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            ⏳ 待审核
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs font-bold flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 px-2 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'history'
                ? 'bg-white text-kidpink-600 shadow-md scale-105'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📋 记录
          </button>
        </div>
      </div>

      {/* 内容区 */}
      <div className="px-4">
        {activeTab === 'rewards' && (
          <div className="grid grid-cols-2 gap-3">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className="bg-white rounded-2xl p-4 shadow-md border-2 border-gray-100"
              >
                <div className="text-4xl text-center mb-2">{reward.icon}</div>
                <h3 className="font-bold text-gray-800 text-center text-sm mb-1">
                  {reward.title}
                </h3>
                <div className="flex items-center justify-center gap-1 text-primary-500 font-bold text-sm mb-3">
                  <Star className="w-4 h-4" fill="currentColor" />
                  {reward.points_cost}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(reward)}
                    className="flex-1 py-1.5 bg-kidblue-50 text-kidblue-600 text-xs font-bold rounded-lg btn-press"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(reward.id)}
                    className="flex-1 py-1.5 bg-red-50 text-red-500 text-xs font-bold rounded-lg btn-press"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'pending' && (
          <div className="space-y-3">
            {redemptions.filter((r) => r.status === 'pending').length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-5xl mb-3">🎉</div>
                <p>暂无待审核的兑换</p>
              </div>
            ) : (
              redemptions
                .filter((r) => r.status === 'pending')
                .map((redemption) => {
                  const reward = getReward(redemption.reward_id)
                  const child = getChild(redemption.child_id)
                  if (!reward || !child) return null

                  return (
                    <div
                      key={redemption.id}
                      className="bg-white rounded-2xl p-4 shadow-md border-2 border-yellow-100"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-4xl">{reward.icon}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-800">
                            {reward.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {child.avatar} {child.name} 申请兑换
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(redemption.requested_at).toLocaleString(
                              'zh-CN'
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-primary-500 font-bold">
                          <Star className="w-4 h-4" fill="currentColor" />
                          {reward.points_cost}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setReviewingRedemption(redemption)
                            setReviewNote('')
                          }}
                          className="flex-1 py-2 bg-red-50 text-red-500 font-bold rounded-xl btn-press"
                        >
                          <X className="inline w-4 h-4 mr-1" />
                          拒绝
                        </button>
                        <button
                          onClick={() => handleReview(true)}
                          className="flex-1 py-2 bg-secondary-500 text-white font-bold rounded-xl shadow-md btn-press"
                        >
                          <Check className="inline w-4 h-4 mr-1" />
                          通过
                        </button>
                      </div>
                    </div>
                  )
                })
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            {redemptions.filter((r) => r.status !== 'pending').length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-5xl mb-3">📭</div>
                <p>暂无兑换记录</p>
              </div>
            ) : (
              redemptions
                .filter((r) => r.status !== 'pending')
                .map((redemption) => {
                  const reward = getReward(redemption.reward_id)
                  const child = getChild(redemption.child_id)
                  if (!reward || !child) return null

                  return (
                    <div
                      key={redemption.id}
                      className="bg-white rounded-2xl p-4 shadow-md border-2 border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{reward.icon}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-800">
                            {reward.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {child.avatar} {child.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(
                              redemption.requested_at
                            ).toLocaleDateString('zh-CN')}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-primary-500 font-bold text-sm">
                            <Star className="w-4 h-4" fill="currentColor" />
                            {reward.points_cost}
                          </div>
                          {redemption.status === 'approved' ? (
                            <span className="text-xs text-secondary-500 font-medium">
                              ✓ 已通过
                            </span>
                          ) : (
                            <span className="text-xs text-red-500 font-medium">
                              ✕ 已拒绝
                            </span>
                          )}
                        </div>
                      </div>
                      {redemption.reviewer_note && (
                        <div className="mt-2 pt-2 border-t border-gray-100 text-sm text-gray-500">
                          备注：{redemption.reviewer_note}
                        </div>
                      )}
                    </div>
                  )
                })
            )}
          </div>
        )}
      </div>

      {/* 添加/编辑奖励弹窗 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-pop">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-gray-800">
                {editingReward ? '编辑奖励' : '添加奖励'}
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
                          ? 'bg-kidpink-100 scale-110 ring-2 ring-kidpink-400'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* 奖励名称 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  奖励名称
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-kidpink-400 focus:outline-none"
                  placeholder="请输入奖励名称"
                />
              </div>

              {/* 奖励描述 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  奖励描述
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-kidpink-400 focus:outline-none resize-none"
                  rows={2}
                  placeholder="请输入奖励描述"
                />
              </div>

              {/* 积分设置 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  所需积分
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="5"
                    max="500"
                    step="5"
                    value={formData.points_cost}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        points_cost: parseInt(e.target.value),
                      })
                    }
                    className="flex-1 accent-kidpink-500"
                  />
                  <div className="flex items-center gap-1 text-primary-500 font-bold text-xl min-w-[80px]">
                    <Star className="w-5 h-5" fill="currentColor" />
                    {formData.points_cost}
                  </div>
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
                className="flex-1 py-3 bg-gradient-to-r from-kidpink-500 to-accent-500 text-white font-bold rounded-xl shadow-md btn-press disabled:opacity-50"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 拒绝原因弹窗 */}
      {reviewingRedemption && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full animate-pop">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              拒绝兑换
            </h3>
            <textarea
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-400 focus:outline-none resize-none mb-4"
              rows={3}
              placeholder="请输入拒绝原因（选填）"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setReviewingRedemption(null)
                  setReviewNote('')
                }}
                className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl btn-press"
              >
                取消
              </button>
              <button
                onClick={() => handleReview(false)}
                className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl shadow-md btn-press"
              >
                确认拒绝
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
                删除后无法恢复，确定要删除这个奖励吗？
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

export default ParentRewardsPage
