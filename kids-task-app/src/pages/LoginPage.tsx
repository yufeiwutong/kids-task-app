import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Star, Lock, User, Sparkles } from 'lucide-react'

const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = await login(username, password)
      if (user) {
        if (user.role === 'parent') {
          navigate('/parent')
        } else {
          navigate('/child')
        }
      } else {
        setError('用户名或密码错误')
      }
    } catch (err) {
      setError('登录失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const quickLogin = (role: 'parent' | 'child1' | 'child2') => {
    if (role === 'parent') {
      setUsername('parent')
      setPassword('123456')
    } else if (role === 'child1') {
      setUsername('baobao')
      setPassword('123456')
    } else {
      setUsername('beibei')
      setPassword('123456')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo 和标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary-400 to-kidpink-400 rounded-3xl shadow-lg mb-4 animate-float">
            <Star className="w-12 h-12 text-white" fill="white" />
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2">成长星星</h1>
          <p className="text-gray-500 text-lg">每天进步一点点 ✨</p>
        </div>

        {/* 登录卡片 */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-primary-100">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            <Sparkles className="inline w-6 h-6 text-primary-500 mr-2" />
            欢迎回来
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                用户名
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-400 focus:outline-none transition-colors text-lg"
                  placeholder="请输入用户名"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-400 focus:outline-none transition-colors text-lg"
                  placeholder="请输入密码"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-600 px-4 py-3 rounded-xl text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xl font-bold rounded-xl shadow-lg hover:from-primary-600 hover:to-primary-700 transition-all btn-press disabled:opacity-50"
            >
              {loading ? '登录中...' : '🚀 开始成长'}
            </button>
          </form>

          {/* 快捷登录 */}
          <div className="mt-6 pt-6 border-t-2 border-dashed border-gray-200">
            <p className="text-center text-gray-500 text-sm mb-4">💡 演示账号快速登录</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => quickLogin('parent')}
                className="py-2 px-3 bg-accent-50 text-accent-600 rounded-lg text-sm font-medium hover:bg-accent-100 transition-colors btn-press"
              >
                👨‍👩‍👧‍👦 家长
              </button>
              <button
                onClick={() => quickLogin('child1')}
                className="py-2 px-3 bg-kidblue-50 text-kidblue-600 rounded-lg text-sm font-medium hover:bg-kidblue-100 transition-colors btn-press"
              >
                👦 宝宝
              </button>
              <button
                onClick={() => quickLogin('child2')}
                className="py-2 px-3 bg-kidpink-50 text-kidpink-600 rounded-lg text-sm font-medium hover:bg-kidpink-100 transition-colors btn-press"
              >
                👧 贝贝
              </button>
            </div>
            <p className="text-center text-gray-400 text-xs mt-3">
              默认密码：123456
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
