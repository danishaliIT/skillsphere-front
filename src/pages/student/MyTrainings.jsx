import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { 
  Briefcase, PlayCircle, Clock, 
  ExternalLink, Trophy, Building 
} from 'lucide-react';

const MyTrainings = () => {
  const navigate = useNavigate();
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        // Backend: trainings/my-enrollments/ endpoint
        const res = await API.get('trainings/my-enrollments/');
        setTrainings(res.data); // EnrollmentTrainingSerializer data
      } catch (err) {
        console.error("Failed to fetch training enrollments", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrainings();
  }, []);

  if (loading) return <div className="text-center py-20 font-black italic">Loading Programs...</div>;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-5xl font-black text-gray-900 italic tracking-tighter uppercase">Company Trainings</h1>
        <p className="text-gray-400 font-bold mt-2 uppercase tracking-widest text-[10px]">Recruitment-focused programs by industry partners</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {trainings.map((item) => (
          <div key={item.id} className="bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden flex flex-col md:flex-row group hover:shadow-blue-100 transition-all duration-500">
            
            {/* Company Visual Branch */}
            <div className="md:w-48 bg-gray-900 flex items-center justify-center p-8 relative">
              <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-blue-600/20 transition-all"></div>
              <Building className="text-white/20 absolute -bottom-4 -left-4 rotate-12" size={80} />
              <span className="text-4xl font-black text-white italic z-10 uppercase">
                {item.program_details?.company_name?.[0]}
              </span>
            </div>

            {/* Content Details */}
            <div className="p-10 flex-1 space-y-6">
              <div className="space-y-2">
                <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] italic">
                  {item.program_details?.category}
                </span>
                <h3 className="text-2xl font-black text-gray-900 leading-tight italic tracking-tight">
                  {item.program_details?.program_name}
                </h3>
                <p className="text-gray-400 text-xs font-bold">
                  Hosted by <span className="text-gray-900 underline">{item.program_details?.company_name}</span>
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                  <Clock size={14} className="text-blue-600" /> Joined {new Date(item.enrolled_at).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                  <Trophy size={14} className="text-blue-600" /> {item.completion_status}
                </div>
              </div>

              <button 
                onClick={() => navigate(`/dashboard/training/${item.id}`)}
                className="w-full py-5 bg-gray-900 text-white rounded-[1.5rem] font-black text-sm flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl"
              >
                <PlayCircle size={20} /> Resume Program
              </button>
            </div>
          </div>
        ))}

        {trainings.length === 0 && (
          <div className="col-span-full py-24 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
            <Briefcase size={48} className="mx-auto text-gray-200 mb-4" />
            <h3 className="text-xl font-black italic text-gray-400">No Professional Trainings Joined</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTrainings;