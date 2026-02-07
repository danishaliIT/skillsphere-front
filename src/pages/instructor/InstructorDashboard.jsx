import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, BookOpen, DollarSign, Activity, 
  ArrowRight, Plus, MoreHorizontal, Star, Loader2 
} from 'lucide-react';
import API from '../../api/axios'; // Make sure this path is correct

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // --- STATE FOR DYNAMIC DATA ---
  const [dashboardData, setDashboardData] = useState({
    stats: {
      total_revenue: 0,
      active_students: 0,
      courses_deployed: 0,
      instructor_rating: 0
    },
    recent_activity: [],
    top_courses: [],
    revenue_chart: [] // Array of percentages [40, 70, ...]
  });

  // --- FETCH REAL DATA ---
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // Backend Endpoint: 'instructor/dashboard/stats/'
        // Yeh endpoint aapko banana padega views.py mein
        const res = await API.get('instructor/dashboard/stats/');
        setDashboardData(res.data);
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
        // Fallback to 0 if API fails, prevents crash
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // --- STATS CONFIG MAPPING ---
  // API se data aane ke baad hum usay icons aur colors ke sath map karte hain
  const statsConfig = [
    { 
      label: 'Total Revenue', 
      value: `$${dashboardData.stats.total_revenue?.toLocaleString() || '0'}`, 
      icon: <DollarSign className="text-white"/>, 
      bg: 'bg-green-500', 
      trend: '+18%' // Backend can also send trend if needed
    },
    { 
      label: 'Active Students', 
      value: dashboardData.stats.active_students?.toLocaleString() || '0', 
      icon: <Users className="text-white"/>, 
      bg: 'bg-blue-500', 
      trend: '+12%' 
    },
    { 
      label: 'Courses Deployed', 
      value: dashboardData.stats.courses_deployed || '0', 
      icon: <BookOpen className="text-white"/>, 
      bg: 'bg-purple-500', 
      trend: 'Stable' 
    },
    { 
      label: 'Instructor Rating', 
      value: dashboardData.stats.instructor_rating || 'N/A', 
      icon: <Star className="text-white"/>, 
      bg: 'bg-yellow-500', 
      trend: 'Top Rated' 
    },
  ];

  if (loading) return (
    <div className="h-full flex items-center justify-center pt-20">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* --- HEADER --- */}
      <header className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <p className="text-blue-600 text-[10px] uppercase tracking-[0.4em] font-black">Performance Overview</p>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Command Center</h1>
        </div>
        <div className="text-right hidden md:block">
           <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Last Updated</p>
           <p className="text-xl font-black italic text-slate-800">Just Now</p>
        </div>
      </header>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statsConfig.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-100 border border-slate-50 flex flex-col justify-between h-48 group hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start">
                <div className={`size-12 ${stat.bg} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform`}>
                    {React.cloneElement(stat.icon, { size: 20 })}
                </div>
                <span className="bg-slate-50 text-slate-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">{stat.trend}</span>
            </div>
            <div>
              <p className="text-4xl font-black italic text-slate-900 tracking-tighter">{stat.value}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Revenue Chart & Top Courses */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* Revenue Analysis Chart */}
            <div className="bg-[#0F172A] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-end mb-8 relative z-10">
                    <div>
                        <h3 className="text-2xl font-black italic uppercase">Revenue Analysis</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Last 7 Days Performance</p>
                    </div>
                    <button className="bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-colors"><MoreHorizontal size={20}/></button>
                </div>

                {/* Dynamic Bar Chart */}
                <div className="h-40 flex items-end justify-between gap-4 relative z-10">
                    {/* Default chart data agar API null bhejey */}
                    {(dashboardData.revenue_chart?.length > 0 ? dashboardData.revenue_chart : [20, 40, 60, 30, 70, 50, 80]).map((height, i) => (
                        <div key={i} className="w-full bg-blue-900/30 rounded-t-xl relative group">
                             <div 
                                style={{ height: `${height}%` }} 
                                className="absolute bottom-0 left-0 w-full bg-blue-500 rounded-t-xl transition-all duration-1000 group-hover:bg-blue-400"
                             ></div>
                             <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-blue-900 text-[10px] font-black px-2 py-1 rounded-md transition-opacity">
                                {height}%
                             </div>
                        </div>
                    ))}
                </div>
                <div className="absolute top-0 right-0 size-64 bg-blue-600/20 blur-[100px] rounded-full pointer-events-none"></div>
            </div>

            {/* Top Performing Courses Table */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black italic uppercase text-slate-800">Top Deployments</h3>
                    <button onClick={() => navigate('/instructor/courses')} className="text-blue-600 text-xs font-black uppercase tracking-widest hover:underline">View All</button>
                </div>
                
                {dashboardData.top_courses?.length > 0 ? (
                  <div className="space-y-4">
                      {dashboardData.top_courses.map((course, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-blue-50 transition-colors cursor-pointer group">
                              <div className="flex items-center gap-4">
                                  <div className="text-slate-300 font-black text-lg group-hover:text-blue-500">0{i+1}</div>
                                  <div>
                                      <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{course.title}</h4>
                                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">{course.students} Students Enrolled</p>
                                  </div>
                              </div>
                              <div className="text-right">
                                  <p className="font-black text-slate-900">${course.revenue}</p>
                                  <span className="text-[9px] uppercase font-bold text-green-500">{course.status || 'Active'}</span>
                              </div>
                          </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-slate-400 text-xs font-bold uppercase">No courses data available</div>
                )}
            </div>
        </div>

        {/* Right Column: Recent Activity & Quick Actions */}
        <div className="space-y-8">
            
            {/* Recent Activity Feed */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg h-full">
                <h3 className="text-xl font-black italic uppercase text-slate-800 mb-6 flex items-center gap-2">
                    <Activity size={20} className="text-blue-500"/> Live Feed
                </h3>
                <div className="space-y-6 relative">
                    <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-100"></div>
                    
                    {dashboardData.recent_activity?.length > 0 ? (
                      dashboardData.recent_activity.map((act, i) => (
                          <div key={i} className="relative flex items-start gap-4 pl-2">
                              <div className="absolute left-[3px] top-1 size-3 bg-white border-2 border-blue-500 rounded-full z-10"></div>
                              <img 
                                src={act.img || `https://ui-avatars.com/api/?name=${act.user}&background=random`} 
                                alt="User" 
                                className="size-10 rounded-xl bg-slate-200 object-cover shadow-sm" 
                              />
                              <div>
                                  <p className="text-xs text-slate-600">
                                      <span className="font-black text-slate-900">{act.user}</span> {act.action} <span className="text-blue-600 font-bold">{act.target}</span>
                                  </p>
                                  <p className="text-[10px] font-bold text-slate-300 uppercase mt-1">{act.time}</p>
                              </div>
                          </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-slate-400 text-xs">No recent activity</div>
                    )}
                </div>
            </div>

            {/* Quick Create CTA */}
            <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-200 relative overflow-hidden group cursor-pointer" onClick={() => navigate('/instructor/create-course')}>
                <div className="relative z-10">
                    <div className="size-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm group-hover:scale-110 transition-transform">
                        <Plus size={24} className="text-white"/>
                    </div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter">New Course</h3>
                    <p className="text-blue-100 text-xs font-bold mt-2 mb-6">Deploy a new learning module.</p>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                        Start Building <ArrowRight size={12}/>
                    </div>
                </div>
                <div className="absolute -bottom-10 -right-10 size-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>
            </div>

        </div>

      </div>
    </div>
  );
};

export default InstructorDashboard;