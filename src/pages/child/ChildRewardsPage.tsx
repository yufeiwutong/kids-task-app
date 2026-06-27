import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import * as mockService from '../../services/mockData'
import type { Reward, RewardRedemption } from '../../types'
import { Star, Clock, Check, X } from 'lucide-react'
import ChildBottomNav from '../../components/ChildBottomNav'

const ChildRewardsPage = () => {
  const { currentUser, refreshUser } = useAuth()
  const [rewards, setRewards] = useState<Reward[]>([])
  const [redemptions, setRedemptions] = useState<RewardRedemption[]>([])
  const [activeTab, setActiveTab] = useState<'shop' | 'history'>('shop')
  const [showConfirm, setShowConfirm] = useState<Reward | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const loadData = () => {
    if (!currentUser) return
    setRewards(mockService.getRewards())
    setRedemptions(mockService.getChildRedemptions(currentUser.id))
  }

  useEffect(() => {
    loadData()
  }, [currentUser])

  const handleRequestRedemption = (reward: Reward) => {
    if (!currentUser) return
    if (currentUser.points < reward.points_cost) return
    setShowConfirm(reward)
  }

  const confirmRedemption = () => {
    if (!currentUser || !showConfirm) return

    const result = mockService.requestRedemption(showConfirm.id, currentUser.id)
    if (result) {
      setShowConfirm(null)
      setShowSuccess(true)
      loadData()
      refreshUser()

      setTimeout(() => {
        setShowSuccess(false)
      }, 2000)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center gap-1 text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
            <Clock className="w-3 h-3" /> 待审核
          </span>
        )
      case 'approved':
        return (
          <span className="flex items-center gap-1 text-xs font-bold text-secondary-600 bg-secondary-100 px-2 py-1 rounded-full">
            <Check className="w-3 h-3" /> 已通过
          </span>
        )
      case 'rejected':
        return (
          <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">
            <X className="w-3 h-3" /> 已拒绝
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen pb-24">
      {/* 顶部 */}
      <div className="bg-gradient-to-br from-kidpink-400 via-kidpink-500 to-accent-500 text-white rounded-b-[40px] p-6 pt-12">
        <h1 className="text-2xl font-bold text-center mb-4">🎁 积分乐园</h1>
        <div className="bg-white/20 backdrop-blur rounded-2xl p-4 text-center">
          <p className="text-white/80 text-sm mb-1">我的积分</p>
          <div className="flex items-center justify-center gap-2">
            <Star className="w-8 h-8 text-yellow-300" fill="currentColor" />
            <span className="text-4xl font-bold">{currentUser?.points}</span>
          </div>
        </div>
      </div>

      {/* 标签切换 */}
      <div className="px-4 py-4">
        <div className="flex bg-gray-100 rounded-2xl p-1">
          <button
            onClick={() => setActiveTab('shop')}
            className={`flex-1 py-3 px-2 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'shop'
                ? 'bg-white text-kidpink-600 shadow-md scale-105'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            🛒 兑换商店
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 px-2 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'history'
                ? 'bg-white text-kidpink-600 shadow-md scale-105'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📋 兑换记录
          </button>
        </div>
      </div>

      {/* 内容区 */}
      <div className="px-4">
        {activeTab === 'shop' ? (
          <div className="grid grid-cols-2 gap-3">
            {rewards.map((reward) => {
              const canAfford = (currentUser?.points || 0) >= reward.points_cost

              return (
                <div
                  key={reward.id}
                  className={`bg-white rounded-2xl p-4 shadow-md border-2 transition-all card-hover ${
                    canAfford ? 'border-kidpink-100' : 'border-gray-100 opacity-70'
                  }`}
                >
                  <div className="text-5xl text-center mb-3">{reward.icon}</div>
                  <h3 className="font-bold text-gray-800 text-center mb-1">
                    {reward.title}
                  </h3>
                  <p className="text-xs text-gray-500 text-center mb-3 h-8 overflow-hidden">
                    {reward.description}
                  </p>
                  <div className="flex items-center justify-center gap-1 text-primary-500 font-bold mb-3">
                    <Star className="w-4 h-4" fill="currentColor" />
                    {reward.points_cost}
                  </div>
                  <button
                    onClick={() => handleRequestRedemption(reward)}
                    disabled={!canAfford}
                    className={`w-full py-2 rounded-xl text-sm font-bold transition-all btn-press ${
                      canAfford
                        ? 'bg-gradient-to-r from-kidpink-500 to-accent-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? '立即兑换' : '积分不足'}
                  </button>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {redemptions.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-5xl mb-3">📭</div>
                <p>还没有兑换记录哦</p>
                <p className="text-sm mt-1">快去兑换商店看看吧～</p>
              </div>
            ) : (
              redemptions.map((redemption) => {
                const reward = rewards.find((r) => r.id === redemption.reward_id)
                if (!reward) return null

                return (
                  <div
                    key={redemption.id}
                    className="bg-white rounded-2xl p-4 shadow-md border-2 border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{reward.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-800">{reward.title}</h4>
                        <p className="text-xs text-gray-500">
                          {new Date(redemption.requested_at).toLocaleString('zh-CN')}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-primary-500 font-bold text-sm">
                        <Star className="w-4 h-4" fill="currentColor" />
                        {reward.points_cost}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      {getStatusBadge(redemption.status)}
                      {redemption.reviewer_note && (
                        <p className="text-xs text-gray-500 flex-1 ml-2 truncate">
                          {redemption.reviewer_note}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>

      {/* 确认弹窗 */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full animate-pop">
            <div className="text-center">
              <div className="text-6xl mb-4">{showConfirm.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                确定要兑换吗？
              </h3>
              <p className="text-gray-500 mb-4">{showConfirm.title}</p>
              <div className="flex items-center justify-center gap-2 text-2xl font-bold text-primary-500 mb-6">
                <Star className="w-6 h-6" fill="currentColor" />
                {showConfirm.points_cost} 积分
              </div>
              <p className="text-sm text-gray-400 mb-6">
                兑换后需要家长审核通过才会扣除积分哦
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(null)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl btn-press"
              >
                再想想
              </button>
              <button
                onClick={confirmRedemption}
                className="flex-1 py-3 bg-gradient-to-r from-kidpink-500 to-accent-500 text-white font-bold rounded-xl shadow-md btn-press"
              >
                确认兑换
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 成功提示 */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl animate-pop text-center">
            <div className="text-6xl mb-4 animate-bounce">⏳</div>
            <h2 className="text-2xl font-bold text-primary-600 mb-2">
              申请已提交！
            </h2>
            <p className="text-gray-500">等待家长审核中...</p>
          </div>
        </div>
      )}

      <ChildBottomNav />
    </div>
  )
}

export default ChildRewardsPage
