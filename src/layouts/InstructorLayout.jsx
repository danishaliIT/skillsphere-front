import { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import {
  User, BookOpen, PlusSquare, 
  FileQuestion, // <-- New Icon for Quiz
  Award, CreditCard, Bell, LogOut,
  LayoutDashboard, Menu, X
} from 'lucide-react';
import API from '../api/axios';

const BASE_URL = 'http://127.0.0.1:8000';

const InstructorLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { profile } = useProfile();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${BASE_URL}${path}`;
  };

  // --- NAV ITEMS UPDATED ---
  const navItems = [
    { name: 'Dashboard', path: '/instructor', icon: LayoutDashboard },
    { name: 'Profile Settings', path: '/instructor/profile', icon: User },
    { name: 'My Courses', path: '/instructor/courses', icon: BookOpen },
    { name: 'Create Course', path: '/instructor/create-course', icon: PlusSquare },
    
    // Yahan Assignments ki jagah Quizzes laga diya hai
    { name: 'Quizzes', path: '/instructor/quizzes', icon: FileQuestion }, 
    
    { name: 'Payments', path: '/instructor/payments', icon: CreditCard },
    { name: 'Notifications', path: '/instructor/notifications', icon: Bell },
  ];

  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnread = async () => {
    try {
      const res = await API.get('notifications/');
      const unread = (res.data || []).filter(n => !n.is_read).length;
      setUnreadCount(unread);
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex">
      <button
        className="lg:hidden fixed top-6 left-6 z-50 p-3 bg-blue-600 text-white rounded-xl shadow-lg"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-100 p-8 transform transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center gap-3 mb-12">
          <div className="size-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black italic shadow-xl shadow-blue-100">S</div>
          <span className="text-2xl font-black tracking-tighter italic text-gray-900 uppercase">SkillSphere</span>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => { navigate(item.path); setSidebarOpen(false); }}
              className={`w-full relative flex items-center gap-4 p-4 rounded-2xl font-bold italic transition-all ${
                location.pathname === item.path
                ? 'bg-blue-50 text-blue-600 shadow-sm'
                : 'text-gray-400 hover:bg-gray-50'
              }`}
            >
              <item.icon size={20} />
              <span className="text-sm tracking-tight">{item.name}</span>
              {item.name === 'Notifications' && unreadCount > 0 && (
                <span className="absolute right-4 top-3 w-2 h-2 bg-red-500 rounded-full shadow" />
              )}
            </button>
          ))}
        </nav>

        <button
          onClick={logout}
          className="w-full flex items-center gap-4 p-4 text-red-500 hover:bg-red-50 rounded-2xl font-bold italic transition-all mt-10"
        >
          <LogOut size={20} /> <span className="text-sm">Logout</span>
        </button>
      </aside>

      <main className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        <header className="h-24 px-8 md:px-12 flex items-center justify-between border-b border-gray-50 bg-white/50 backdrop-blur-md sticky top-0 z-30">
          <div className="hidden md:block">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Instructor Panel</h2>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-gray-900 italic leading-none">
                {profile?.full_name || `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'Instructor'}
              </p>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Instructor</p>
            </div>

            <div className="relative">
              <div className="size-12 rounded-2xl overflow-hidden border-2 border-white shadow-lg shadow-gray-200 bg-gray-50 flex items-center justify-center">
                <img
                  src={getImageUrl(profile?.profile_picture) || `https://ui-avatars.com/api/?name=${(profile?.full_name || profile?.first_name || 'I').replace(/\s+/g, '+')}&background=0D8ABC&color=fff`}
                  alt="profile"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=User'; }}
                />
              </div>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
              )}
            </div>
          </div>
        </header>

        <div className="p-8 md:p-12 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default InstructorLayout;