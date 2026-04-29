import { User, IdCard, Settings, Shield } from "lucide-react"
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import type { AuthModalOption } from "../../features/auth/types/auth.types";
import { useAuthContext } from '../../features/auth/hooks/useAuth';
import ChangePasswordModal from "../../features/auth/pages/ChangePasswordPage";
import LoginActivityModal from "./LoginActivityModal";

interface NavbarProps {
  setOpenModal: (modal: AuthModalOption | null) => void;
}


function Navbar({ setOpenModal }: NavbarProps) {
  const { user, logout } = useAuthContext();
  const isAdmin = user?.role === 'admin';
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isLoginActivityOpen, setIsLoginActivityOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Handler for Port button click
  const handlePortClick = () => {
    if (!user) {
      setOpenModal('login');
    } else if (isAdmin) {
      navigate('/talent_list');
    } else {
      navigate('/profile_page');
    }
  };

  // Handler for Logout button click
  const handleLogoutClick = async () => {
    await logout();
    navigate('/');
  };

  // Click outside to close settings dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine button label and icon
  let portLabel = 'Port';
  let portIcon = <User className="w-4 h-4" />;
  if (user) {
    if (isAdmin) {
      portLabel = 'Talent Profiles';
      portIcon = <IdCard className="w-4 h-4" />;
    } else {
      portLabel = 'My Profile';
      portIcon = <User className="w-4 h-4" />;
    }
  }

  return (
    <div className="fixed top-0 left-0 w-full z-50 
    flex items-center justify-between px-8 py-4
    bg-black/30 backdrop-blur-md border-b border-white/10">

      {/* Logo */}
      <a href="/" className="flex items-center space-x-2 sm:space-x-3">
        <img
          src="/logotranspaert.webp"
          alt="SWAFRI Logo"
          className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
        />
        <div className="flex flex-col leading-tight">
          <span className="text-base sm:text-lg lg:text-xl font-bold whitespace-nowrap text-green-400">
            SWAFRI
          </span>
          <span className="text-xs text-gray-400 hidden sm:block">
            IT-Outsourcing
          </span>
        </div>
      </a>

      {/* Right Side */}
      <div className="flex items-center gap-3 sm:gap-4">

        {/* Powered by */}
        <div className="hidden sm:flex items-center">
          <div className="flex items-center gap-2 
            px-4 py-1.5 rounded-full
            bg-white/5 border border-white/10
            text-xs text-gray-400
            backdrop-blur-md">
            <span className="opacity-70">Powered by</span>
            <span className="text-green-400 font-semibold tracking-wide">
              PTGR AG
            </span>
          </div>
        </div>

        {/* Port Button (dynamic) */}
        <button
         className="flex items-center gap-2 
  px-5 py-2 rounded-full
  border border-white/15
  bg-white/5
  text-gray-200
  hover:bg-white/10
  hover:border-white/25
  active:scale-95
  transition-all duration-200 backdrop-blur-md"
          onClick={handlePortClick}
        >
          {portIcon}
          <span className="hidden sm:block">{portLabel}</span>
        </button>

        {/* Settings Dropdown (logged in users only) */}
        {user && (
          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
             className="flex items-center justify-center
  w-10 h-10 rounded-full
  border border-white/10
  bg-white/5
  text-gray-300
  hover:bg-white/10
  hover:text-white
  hover:border-white/20
  active:scale-95
  transition-all duration-200 backdrop-blur-md"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Dropdown Menu */}
            {isSettingsOpen && (
              <div className="absolute right-0 mt-2 w-48 
                bg-black/90 backdrop-blur-md border border-white/10 
                rounded-lg shadow-xl overflow-hidden z-50">
                <button
                  onClick={() => {
                    setIsSettingsOpen(false);
                    setIsLoginActivityOpen(true);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-gray-300 
                    hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Login Sessions
                </button>
                <button
                  onClick={() => {
                    setIsSettingsOpen(false);
                    setIsChangePasswordOpen(true);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-gray-300 
                    hover:bg-white/10 hover:text-white transition-colors"
                >
                  Change Password
                </button>
              </div>
            )}
          </div>
        )}

        {/* Join / Logout */}
        {!user ? (
          <button
            onClick={() => setOpenModal("login")}
            className="px-6 py-2.5 
  rounded-full
  bg-gradient-to-r from-green-400 to-emerald-500
  text-black font-semibold
  shadow-md shadow-green-500/20
  hover:shadow-lg hover:shadow-green-500/30
  hover:scale-[1.03]
  active:scale-95
  transition-all duration-200"
          >
            Join Now
          </button>
        ) : (
          <button
            onClick={handleLogoutClick}
            className="px-5 py-2 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-black font-semibold rounded-lg"
          >
            Logout
          </button>
        )}

      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        open={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />

      {/* Login Activity Modal */}
      <LoginActivityModal
        open={isLoginActivityOpen}
        onClose={() => setIsLoginActivityOpen(false)}
      />
    </div>
  )
}

export default Navbar
