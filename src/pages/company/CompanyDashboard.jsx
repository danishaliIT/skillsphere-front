import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, GraduationCap, Award, Zap, 
  Loader2, ArrowRight, Briefcase 
} from 'lucide-react';
import API from '../../api/axios'; 

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // --- STATE ---
  const [stats, setStats] = useState({
    total_employees: 0,
    new_this_month: 0,
    avg_completion: 0,
    certificates_issued: 0
  });
  const [recentTrainings, setRecentTrainings] = useState([]);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Stats from Backend
        const statsRes = await API.get('company/dashboard/stats/');
        setStats(statsRes.data);

        // 2. Recent Trainings (Last 3)
        const trainingsRes = await API.get('trainings/programs/');
        // Sort by newest first just in case backend didn't, and take top 3
        const sorted = trainingsRes.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setRecentTrainings(sorted.slice(0, 3)); 

      } catch (err) {
        console.error("Dashboard data fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // --- UI CONFIG ---
  const statCards = [
    { 
      label: 'Unique Participants', 
      value: stats.total_employees, 
      icon: <Users className="text-blue-600"/>, 
      sub: `+${stats.new_this_month} Joined this month` 
    },
    { 
      label: 'Avg. Completion', 
      value: `${stats.avg_completion}%`, 
      icon: <GraduationCap className="text-purple-600"/>, 
      sub: 'Across all programs' 
    },
    { 
      label: 'Certificates Earned', 
      value: stats.certificates_issued, 
      icon: <Award className="text-green-600"/>, 
      sub: 'Verified Skills' 
    },
  ];

  if (loading) return (
    <div className="h-full flex items-center justify-center pt-20">
      <Loader2 className="animate-spin text-blue-600" size={40}/>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* HEADER */}
      <header className="space-y-3">
        <p className="text-blue-600 text-[10px] uppercase tracking-[0.5em] font-black">Command Center</p>
        <h1 className="text-6xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Enterprise Dashboard</h1>
        <p className="text-slate-400 font-bold italic text-xs">Managing Intelligence & Skill Deployment</p>
      </header>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white p-10 rounded-[3.5rem] shadow-xl shadow-slate-100 border border-slate-50 flex flex-col space-y-4 group hover:shadow-2xl hover:shadow-blue-50 transition-all border-b-4 border-b-transparent hover:border-b-blue-600 hover:-translate-y-1">
            <div className="size-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
              {React.cloneElement(stat.icon, { size: 32 })}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-5xl font-black italic tracking-tighter text-slate-900">{stat.value}</p>
              <p className="text-[9px] text-green-500 mt-2 uppercase font-black tracking-tighter">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT: ACTION CARD */}
        <div className="bg-[#0F172A] rounded-[3rem] p-12 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group">
          {/* Animated Background Icon */}
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
              <Zap size={200} />
          </div>
          
          <div className="space-y-4 relative z-10">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">Deploy New Training</h2>
            <p className="text-slate-400 font-bold italic max-w-md text-sm">
              Create specialized training modules (MERN, AI, Management) and assign them to your workforce instantly.
            </p>
          </div>
          
          <div className="mt-8 relative z-10">
            <button 
              onClick={() => navigate('/company/create-training')}
              className="bg-blue-600 hover:bg-white hover:text-blue-600 px-8 py-4 rounded-[1.5rem] font-black uppercase italic tracking-widest transition-all shadow-lg shadow-blue-500/20 flex items-center gap-3 active:scale-95"
            >
              Start Deployment <ArrowRight size={16}/>
            </button>
          </div>
        </div>

        {/* RIGHT: RECENT DEPLOYMENTS LIST */}
        <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-xl">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black italic uppercase text-slate-800">Recent Programs</h3>
                <span className="text-[10px] font-bold uppercase text-blue-600 cursor-pointer hover:underline" onClick={() => navigate('/company/create-training')}>View All</span>
            </div>

            <div className="space-y-4">
                {recentTrainings.length > 0 ? (
                    recentTrainings.map((train, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-blue-50 transition-colors group cursor-pointer" onClick={() => navigate('/company/create-training')}>
                            <div className="size-12 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 shadow-sm transition-colors">
                                <Briefcase size={20} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-900 text-sm">{train.program_name}</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">
                                    {train.scheduled_date ? new Date(train.scheduled_date).toLocaleDateString() : 'Unscheduled'} • {train.category}
                                </p>
                            </div>
                            <div className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-lg tracking-wider ${
                                train.live_status === 'live' ? 'bg-red-100 text-red-600 animate-pulse' : 
                                train.live_status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                            }`}>
                                {train.live_status}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="h-40 flex flex-col items-center justify-center text-center">
                       <Briefcase className="text-slate-200 mb-2" size={40}/>
                       <p className="text-slate-400 text-xs font-bold uppercase">No training programs yet</p>
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default CompanyDashboard;