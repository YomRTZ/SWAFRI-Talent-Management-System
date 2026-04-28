import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './features/auth/context/authContext'
import { TalentProvider } from './features/talent/context/talentContext'
import { ToastProvider } from './components/common/toast/context/ToastContext.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ToastProvider>
      <AuthProvider>
        <TalentProvider>
          <App />
        </TalentProvider>
      </AuthProvider>
    </ToastProvider>
  </BrowserRouter>
)
