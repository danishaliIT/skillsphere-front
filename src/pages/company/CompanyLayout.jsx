import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart3, Users, Briefcase, CreditCard, 
  Bell, Settings, LogOut, ShieldCheck 
} from 'lucide-react';

const CompanyLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'HQ Overview', path: '/company/dashboard', icon: <BarChart3 size={20}/> },
    { name: 'My Team', path: '/company/employees', icon: <Users size={20}/> },
    { name: 'Deploy Training', path: '/company/create-training', icon: <Briefcase size={20}/> },
    { name: 'Subscription', path: '/company/settings', icon: <CreditCard size={20}/> }, // Adjusted path if needed
    { name: 'Intelligence', path: '/company/notifications', icon: <Bell size={20}/> },
    { name: 'HQ Settings', path: '/company/settings', icon: <Settings size={20}/> },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      
      {/* --- SIDEBAR: Clean White Look (Like Instructor Panel) --- */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-slate-100 flex flex-col p-6 z-30 shadow-sm">
        
        {/* Logo Section */}
        <div className="mb-12 flex items-center gap-3 px-2">
          <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 italic tracking-tighter uppercase">SkillSphere</h1>
            <p className="text-[9px] text-blue-600 uppercase tracking-[0.3em] font-bold">Corporate HQ</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.name}
                to={item.path}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                  isActive 
                  ? 'bg-blue-50 text-blue-600 shadow-sm' // Active State (Light Blue)
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900' // Inactive State
                }`}
              >
                {/* Icon with slight animation on active */}
                <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {item.icon}
                </div>
                
                <span className="text-[11px] font-black uppercase tracking-widest italic">
                    {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <button 
          onClick={() => navigate('/logout')}
          className="flex items-center gap-4 px-5 py-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all mt-auto group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[11px] font-black uppercase tracking-widest italic">
            Terminate Session
          </span>
        </button>
      </aside>

      {/* --- MAIN CONTENT WRAPPER --- */}
      {/* ml-72 diya hai taake content sidebar ke peeche na chupe */}
      <main className="flex-1 ml-72 p-10 relative z-10">
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Outlet />
        </div>
      </main>
      
    </div>
  );
};

export default CompanyLayout;