import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { 
  PlayCircle, CheckCircle, ChevronLeft, 
  Lock, BookOpen, Clock, Award 
} from 'lucide-react';

const GoTraining = () => {
  const { id } = useParams(); // Enrollment ID
  const navigate = useNavigate();
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState(0);

  // Dummy lessons data (Kyunki model mein lessons abhi define karne hain)
  const lessons = [
    { id: 1, title: "Introduction to DragonTech Ecosystem", duration: "10:00", status: "completed" },
    { id: 2, title: "Advanced Military Tech Fundamentals", duration: "25:00", status: "active" },
    { id: 3, title: "AI & Drone Integration Strategy", duration: "45:00", status: "locked" },
  ];

  useEffect(() => {
    const fetchEnrollmentDetail = async () => {
      try {
        // Enrollment details with progress
        const res = await API.get(`enrollments/my-courses/`);
        const current = res.data.find(item => item.id === parseInt(id));
        setEnrollment(current);
      } catch (err) {
        console.error("Failed to load training content", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollmentDetail();
  }, [id]);

  if (loading) return <div className="p-20 text-center font-black italic">Loading Content...</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-700 h-full">
      
      {/* --- Left: Main Video Player Area --- */}
      <div className="flex-1 space-y-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-blue-600 font-bold text-xs uppercase tracking-widest transition-all"
        >
          <ChevronLeft size={16} /> Back to Dashboard
        </button>

        {/* Video Placeholder */}
        <div className="aspect-video bg-gray-900 rounded-[3rem] overflow-hidden shadow-2xl relative border-8 border-white">
          <div className="absolute inset-0 flex items-center justify-center">
            <PlayCircle size={80} className="text-white opacity-20 group-hover:opacity-100 cursor-pointer transition-all" />
          </div>
          <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
            <div className="text-white space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 italic">Now Playing</span>
              <h2 className="text-2xl font-black italic tracking-tight">{lessons[activeLesson].title}</h2>
            </div>
          </div>
        </div>

        {/* Progress Update Bar */}
        <div className="bg-white p-8 rounded-[3rem] border border-gray-50 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Your Course Progress</p>
            <h3 className="text-2xl font-black italic text-gray-900">{enrollment?.progress?.percentage || 0}% Completed</h3>
          </div>
          <button className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black italic shadow-lg shadow-blue-100 hover:bg-gray-900 transition-all flex items-center gap-3 uppercase text-xs tracking-widest">
            <CheckCircle size={18} /> Mark as Complete
          </button>
        </div>
      </div>

      {/* --- Right: Lesson Curriculum Sidebar --- */}
      <aside className="lg:w-96 space-y-8">
        <div className="bg-white rounded-[3rem] border border-gray-50 shadow-xl overflow-hidden">
          <div className="p-8 border-b border-gray-50 bg-gray-50/50">
            <h3 className="text-xl font-black italic text-gray-900 uppercase tracking-tight">Curriculum</h3>
            <p className="text-xs font-bold text-gray-400 mt-1 italic">{enrollment?.course_details?.title}</p>
          </div>

          <div className="p-4 space-y-2">
            {lessons.map((lesson, index) => (
              <button 
                key={lesson.id}
                onClick={() => index <= activeLesson && setActiveLesson(index)}
                className={`w-full p-6 rounded-[2rem] flex items-center justify-between transition-all border ${
                  activeLesson === index 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-100' 
                  : 'bg-white text-gray-400 border-transparent hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`size-10 rounded-xl flex items-center justify-center font-black ${
                    activeLesson === index ? 'bg-white/20' : 'bg-gray-100'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="text-left">
                    <p className={`text-[11px] font-black italic leading-tight ${
                      activeLesson === index ? 'text-white' : 'text-gray-900'
                    }`}>
                      {lesson.title}
                    </p>
                    <span className="text-[9px] font-bold opacity-50 flex items-center gap-1 uppercase tracking-widest mt-1">
                      <Clock size={10} /> {lesson.duration}
                    </span>
                  </div>
                </div>
                {lesson.status === 'locked' && <Lock size={14} className="opacity-40" />}
                {lesson.status === 'completed' && <CheckCircle size={14} className={activeLesson === index ? 'text-white' : 'text-green-500'} />}
              </button>
            ))}
          </div>

          <div className="p-8 bg-blue-50/50 flex items-center gap-4">
            <Award className="text-blue-600" size={30} />
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-relaxed">
              Complete all lessons to unlock your DragonTech Certification.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default GoTraining;