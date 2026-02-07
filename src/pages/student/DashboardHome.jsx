import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { useProfile } from '../../hooks/useProfile';
import { 
  BookOpen, PlayCircle, Briefcase, 
  ChevronRight, Award, Zap, Clock, Star 
} from 'lucide-react';

const DashboardHome = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [stats, setStats] = useState({ academic: 0, professional: 0 });
  const [recentTrainings, setRecentTrainings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Dono apps se data fetch karna taake overview dikha sakein
        const [courseRes, trainingRes] = await Promise.all([
          API.get('enrollments/my-courses/'),
          API.get('trainings/my-enrollments/')
        ]);

        setStats({
          academic: courseRes.data.length,
          professional: trainingRes.data.length
        });

        // Sirf top 2 active trainings dikhana
        setRecentTrainings(trainingRes.data.slice(0, 2));
      } catch (err) {
        console.error("Dashboard data fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome & Quick Stats */}
      <header className="flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter italic uppercase">
            Dashboard
          </h1>
          <p className="text-gray-400 font-bold text-sm uppercase tracking-[0.2em]">
            Welcome back, {profile?.first_name || 'Danish'}
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white px-8 py-5 rounded-[2rem] shadow-sm border border-gray-50 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Zap size={20} /></div>
            <div>
              <p className="text-2xl font-black italic text-gray-900 leading-none">{stats.academic + stats.professional}</p>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Total Enrolled</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid: Learning Path & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Recent Trainings */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-2xl font-black text-gray-900 italic">Active Programs</h3>
            <button 
              onClick={() => navigate('/dashboard/my-trainings')} 
              className="text-sm font-black text-blue-600 hover:underline flex items-center gap-1 italic"
            >
              Explore More <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {recentTrainings.map((item) => (
              <div key={item.id} className="bg-white rounded-[3rem] border border-gray-50 shadow-xl shadow-gray-100/30 overflow-hidden group hover:-translate-y-2 transition-all duration-500">
                <div className="h-40 bg-gray-900 relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/10 transition-colors"></div>
                  <span className="text-4xl font-black text-white italic opacity-20 uppercase select-none">
                    {item.program_details?.program_name?.[0]}
                  </span>
                </div>
                <div className="p-8">
                  <h4 className="text-xl font-black text-gray-900 leading-tight italic line-clamp-1 mb-4">
                    {item.program_details?.program_name}
                  </h4>
                  <button 
                    onClick={() => navigate(`/dashboard/active-trainings`)}
                    className="w-full py-4 bg-gray-50 text-gray-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <PlayCircle size={16} /> Resume Learning
                  </button>
                </div>
              </div>
            ))}

            {recentTrainings.length === 0 && (
              <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-bold italic">No active enrollments found.</p>
                <button onClick={() => navigate('/catalog')} className="mt-4 text-blue-600 font-black text-xs uppercase underline">Browse Catalog</button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Achievements & Status */}
        <div className="space-y-8">
          <h3 className="text-2xl font-black text-gray-900 italic px-2">Skill Status</h3>
          <div className="bg-gray-900 p-10 rounded-[3rem] text-white shadow-2xl space-y-8 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10 rotate-12">
              <Star size={120} fill="white" />
            </div>
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="size-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                  <Award className="text-blue-400" size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Career Level</p>
                  <p className="text-lg font-black italic tracking-tight">Rising Tech Star</p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-50">
                  <span>Overall Progress</span>
                  <span>75%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-3/4 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                </div>
              </div>

              <button 
                onClick={() => navigate('/dashboard/certificates')}
                className="w-full py-4 bg-white text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-400 hover:text-white transition-all"
              >
                View Achievements
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;