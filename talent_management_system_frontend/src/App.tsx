
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './features/home/Home'
// import TalentForm from './pages/profile/ProfileForm'
import TalentDetailPage from './features/talent/pages/TalentDetailPage'
import Talents from './features/talent/pages/TalentListPage'
import { useState } from 'react'
import MainLayout from './components/layout/MainLayout'
import UserProfilePage from './features/talent/pages/UserProfilePage'
import ProtectedRoute from './routes/ProtectedRoute'
import SignUpPage from './features/auth/pages/SignupPage'
import LoginPage from './features/auth/pages/LoginPage'
import ForgotPasswordPage from './features/auth/pages/ForgotpasswordPage'
import type { AuthModalOption } from './features/auth/types/auth.types'
import ToastContainer from './components/common/toast/Toast'

function App() {
 const [openModal, setOpenModal] = useState<AuthModalOption | null>(null)
  return (
    <>
      <Routes>
      <Route
        path="/"
        element={
          <MainLayout setOpenModal={setOpenModal}>
            <Home setOpenModal={setOpenModal} />
          </MainLayout>
        }
      />

      <Route
        path="/talents"
        element={
          <ProtectedRoute adminOnly={true}>
            <MainLayout setOpenModal={setOpenModal}>
              <Talents />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/talent_list"
        element={
          <ProtectedRoute adminOnly={true}>
            <MainLayout setOpenModal={setOpenModal}>
              <Talents />
            </MainLayout>
          </ProtectedRoute>
        }
      />
     <Route
        path="/profile/:id"
        element={
          <MainLayout setOpenModal={setOpenModal}>
            <TalentDetailPage />
          </MainLayout>
        }
      />
      <Route
        path="/profile_page"
        element={
          <MainLayout setOpenModal={setOpenModal}>
            <UserProfilePage />
          </MainLayout>
        }
      />
    </Routes>

    {/* Auth Modals */}
    {openModal && (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
        {/* click outside to close */}
        <div
          className="absolute inset-0"
          onClick={() => setOpenModal(null)}
        />
        {/* modal card */}
        <div className="relative z-10 w-full max-w-md">
          {openModal === "login" && (
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6">
              <LoginPage setOpenModal={setOpenModal} />
            </div>
          )}
          {openModal === "signup" && (
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6">
              <SignUpPage setOpenModal={setOpenModal} />
            </div>
          )}
          {openModal === "forgot" && (
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6">
              <ForgotPasswordPage setOpenModal={setOpenModal} />
            </div>
          )}
        </div>
      </div>
    )}
    <ToastContainer />
    </>
  )
}
export default App
