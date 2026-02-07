import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import THEME from '../styles/theme';
import { 
  Menu, X, ChevronDown, Search, Bell, User, LogOut,
  Home, BookOpen, Briefcase, Users, Settings, HelpCircle
} from 'lucide-react';
import NotificationPanel from './NotificationPanel';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/', icon: <Home size={16} /> },
    { name: 'Courses', href: '/catalog', icon: <BookOpen size={16} /> },
    { name: 'Trainings', href: '/catalog', icon: <Briefcase size={16} /> },
    { name: 'About', href: '#about', icon: <Users size={16} /> },
  ];

  const userMenuItems = [
    { label: 'Profile', icon: <User size={16} />, action: () => {
      if (user?.role === 'Instructor') navigate('/instructor/profile');
      else if (user?.role === 'Company') navigate('/company/settings');
      else navigate('/dashboard/profile');
      setUserMenuOpen(false);
    }},
    { label: 'Settings', icon: <Settings size={16} />, action: () => {
      if (user?.role === 'Company') navigate('/company/settings');
      else navigate('/dashboard/profile');
      setUserMenuOpen(false);
    }},
    { label: 'Help', icon: <HelpCircle size={16} />, action: () => console.log('Help') },
    { label: 'Logout', icon: <LogOut size={16} />, action: () => {
      logout();
      navigate('/');
      setUserMenuOpen(false);
    }, isDanger: true},
  ];

  const isActive = (href) => location.pathname === href || location.hash === href;

  return (
    <header style={{ backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }} className="fixed top-0 w-full border-b border-gray-100 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <div 
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-all group"
          onClick={() => navigate('/')}
        >
          <div style={{ background: THEME.gradients.primary }} className="size-10 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg group-hover:shadow-xl transition-all">
            S
          </div>
          <div className="hidden sm:block">
            <h1 style={{ color: THEME.primary.main }} className="text-xl font-black tracking-tighter italic">SkillSphere</h1>
            <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Career Growth Platform</p>
          </div>
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href}
              onClick={(e) => {
                if (!link.href.startsWith('#')) {
                  e.preventDefault();
                  navigate(link.href);
                }
              }}
              className={`flex items-center gap-2 text-sm font-bold transition-all duration-300 ${
                isActive(link.href)
                  ? `text-white bg-blue-600 px-4 py-2 rounded-lg shadow-lg`
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {link.icon}
              {link.name}
            </a>
          ))}
        </nav>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-4">
          
          {/* SEARCH BAR (Desktop) */}
          {searchOpen ? (
            <div className="hidden md:flex items-center bg-gray-50 rounded-xl px-4 py-2 border border-gray-200">
              <Search size={18} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Search courses..."
                className="bg-transparent border-none outline-none ml-2 text-sm w-48 font-bold"
                autoFocus
                onBlur={() => setSearchOpen(false)}
              />
            </div>
          ) : (
            <button 
              onClick={() => setSearchOpen(true)}
              className="hidden md:block p-2 hover:bg-gray-50 rounded-lg transition-all text-gray-600"
            >
              <Search size={20} />
            </button>
          )}

          {/* NOTIFICATIONS */}
          {user && (
            <div className="hidden md:block">
              {/* Use the interactive NotificationPanel component for real notifications */}
              <NotificationPanel />
            </div>
          )}

          {/* USER MENU / AUTH BUTTONS */}
          {!user ? (
            <div className="hidden sm:flex items-center gap-3">
              <button 
                onClick={() => navigate('/login')}
                className="text-sm font-black text-gray-900 px-6 py-2 hover:text-blue-600 transition-all"
              >
                Login
              </button>
              <button 
                onClick={() => navigate('/signup')}
                style={{ background: THEME.gradients.primary }}
                className="text-white text-xs font-black uppercase tracking-widest px-8 py-3 rounded-xl hover:shadow-lg transition-all shadow-lg shadow-blue-500/20"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-all"
              >
                <div style={{ background: THEME.gradients.primary }} className="size-8 rounded-full flex items-center justify-center text-white font-black text-sm">
                  {user.first_name?.[0]?.toUpperCase() || 'U'}
                </div>
                <ChevronDown size={16} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* USER DROPDOWN */}
              {userMenuOpen && (
                <div className="absolute top-16 right-0 w-56 bg-white rounded-[1.5rem] shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  {/* USER INFO */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                    <p className="font-black text-gray-900 text-sm">{user.first_name} {user.last_name}</p>
                    <p className="text-xs text-gray-500 font-bold">{user.role} Account</p>
                  </div>

                  {/* MENU ITEMS */}
                  <div className="p-3 space-y-1">
                    {userMenuItems.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={item.action}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-bold ${
                          item.isDanger
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-gray-700 hover:bg-blue-50'
                        }`}
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    ))}
                  </div>

                  {/* DIVIDER */}
                  <div className="h-px bg-gray-100"></div>

                  {/* QUICK ACCESS */}
                  <div className="p-3">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Quick Access</p>
                    <button 
                      onClick={() => {
                        if (user.role === 'Student') navigate('/dashboard/home');
                        else if (user.role === 'Instructor') navigate('/instructor/dashboard');
                        else navigate('/company/dashboard');
                        setUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all"
                    >
                      Go to Dashboard
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MOBILE MENU TOGGLE */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top-2">
          <nav className="space-y-2 p-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  if (!link.href.startsWith('#')) {
                    e.preventDefault();
                    navigate(link.href);
                  }
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive(link.href)
                    ? `bg-blue-600 text-white`
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.icon}
                <span className="font-bold">{link.name}</span>
              </a>
            ))}

            {!user && (
              <div className="space-y-2 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                  className="w-full px-4 py-3 text-gray-900 font-bold text-center hover:bg-gray-50 rounded-lg"
                >
                  Login
                </button>
                <button 
                  onClick={() => { navigate('/signup'); setMobileMenuOpen(false); }}
                  style={{ background: THEME.gradients.primary }}
                  className="w-full px-4 py-3 text-white font-bold text-center rounded-lg"
                >
                  Sign Up
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;