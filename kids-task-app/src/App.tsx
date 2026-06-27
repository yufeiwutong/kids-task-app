import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { type ReactNode } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'

// 孩子端页面
import ChildHomePage from './pages/child/ChildHomePage'
import ChildCalendarPage from './pages/child/ChildCalendarPage'
import ChildRewardsPage from './pages/child/ChildRewardsPage'
import ChildProfilePage from './pages/child/ChildProfilePage'

// 家长端页面
import ParentHomePage from './pages/parent/ParentHomePage'
import ParentTasksPage from './pages/parent/ParentTasksPage'
import ParentRewardsPage from './pages/parent/ParentRewardsPage'
import ParentKidsPage from './pages/parent/ParentKidsPage'
import ParentProfilePage from './pages/parent/ParentProfilePage'

// 路由守卫组件
const ProtectedRoute = ({ children, requiredRole }: { children: ReactNode; requiredRole?: 'parent' | 'child' }) => {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to={currentUser.role === 'parent' ? '/parent' : '/child'} replace />
  }

  return children
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />

          {/* 孩子端路由 */}
          <Route
            path="/child"
            element={
              <ProtectedRoute requiredRole="child">
                <ChildHomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/child/calendar"
            element={
              <ProtectedRoute requiredRole="child">
                <ChildCalendarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/child/rewards"
            element={
              <ProtectedRoute requiredRole="child">
                <ChildRewardsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/child/profile"
            element={
              <ProtectedRoute requiredRole="child">
                <ChildProfilePage />
              </ProtectedRoute>
            }
          />

          {/* 家长端路由 */}
          <Route
            path="/parent"
            element={
              <ProtectedRoute requiredRole="parent">
                <ParentHomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/tasks"
            element={
              <ProtectedRoute requiredRole="parent">
                <ParentTasksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/rewards"
            element={
              <ProtectedRoute requiredRole="parent">
                <ParentRewardsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/kids"
            element={
              <ProtectedRoute requiredRole="parent">
                <ParentKidsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/profile"
            element={
              <ProtectedRoute requiredRole="parent">
                <ParentProfilePage />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
