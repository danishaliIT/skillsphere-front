import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API, { getMediaUrl } from '../../api/axios';
import { PlayCircle, Loader2, BookOpen, Clock, User } from 'lucide-react';


const EnrolledCourses = () => {
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        // Backend endpoint: /api/enrollments/my-courses/
        const res = await API.get('enrollments/my-courses/');
        setEnrolledCourses(res.data);
      } catch (err) {
        console.error("Courses load karne mein masla:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCourses();
  }, []);

  const getImageUrl = (thumbnailPath) => {
    const url = getMediaUrl(thumbnailPath);
    return url || 'https://via.placeholder.com/600x400';
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="animate-spin text-blue-600" size={50} />
      <p className="text-gray-400 font-black italic uppercase text-[10px] tracking-widest italic">
        Syncing Your Assets...
      </p>
    </div>
  );

  return (
    <div className="p-8 space-y-12 animate-in fade-in duration-700">
      {/* --- HEADER (As per screenshot) --- */}
      <div className="flex justify-between items-start">
        <header className="space-y-2">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] italic">Student Panel</p>
          <h1 className="text-6xl font-black text-gray-900 italic uppercase tracking-tighter leading-none">Academic Courses</h1>
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest italic mt-2">
            Your Learning Journey and Academic Progress
          </p>
        </header>

        {/* Dynamic Count Badge */}
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 flex items-center gap-6 shadow-2xl">
          <div className="size-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-black italic">
            {enrolledCourses.length}
          </div>
          <div>
            <p className="text-[9px] font-black text-gray-400 uppercase italic leading-none">Total</p>
            <p className="text-[10px] font-black text-gray-900 uppercase italic">Deployments</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {enrolledCourses.length > 0 ? (
          enrolledCourses.map((item) => (
            <div key={item.id} className="bg-white rounded-[4rem] border border-gray-50 shadow-2xl overflow-hidden group hover:shadow-blue-100 transition-all duration-700 flex flex-col">
              {/* Thumbnail Area with Dynamic Fix */}
              <div className="h-72 bg-gray-950 relative overflow-hidden">
                <img 
                  src={getImageUrl(item.course_details.thumbnail)} 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-100 transition-all duration-1000"
                  alt={item.course_details.title}
                />
                <div className="absolute top-10 left-10 bg-[#00D084] text-white text-[9px] font-black px-6 py-2 rounded-2xl uppercase italic shadow-2xl">
                  {item.status || 'Active'}
                </div>
              </div>

              {/* Course Info & Progress */}
              <div className="p-12 space-y-8 flex-1 flex flex-col">
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-gray-400 text-[9px] font-black uppercase italic tracking-widest">
                    <span className="flex items-center gap-1"><Clock size={12} /> Flexible Schedule</span>
                    <span className="flex items-center gap-1 text-blue-600"><User size={12} /> Industry Expert</span>
                  </div>
                  <h2 className="text-4xl font-black text-gray-900 italic leading-[1.1] group-hover:text-blue-600 transition-colors">
                    {item.course_details.title}
                  </h2>
                </div>

                {/* Progress Bar (TrackProgress Logic) */}
                <div className="space-y-5 py-8 px-10 bg-gray-50/50 rounded-[2.5rem] border border-gray-50">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase italic text-gray-400 tracking-widest">
                    <span>Operation Progress</span>
                    <span className="text-blue-600">{item.progress?.percentage || 0}%</span>
                  </div>
                  <div className="h-3 bg-white rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-1000 shadow-[0_0_20px_rgba(37,99,235,0.5)]" 
                      style={{ width: `${item.progress?.percentage || 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Button */}
                <button 
                  onClick={() => navigate(`/dashboard/course-content/${item.course_details.slug}`)} 
                  className="w-full bg-[#111827] text-white py-7 rounded-[2rem] font-black italic uppercase text-sm tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-blue-600 hover:scale-[1.02] transition-all shadow-2xl shadow-gray-200 mt-auto"
                >
                  <PlayCircle size={26} />
                  Start Learning
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-32 text-center border-2 border-dashed border-gray-100 rounded-[4rem] space-y-6">
            <BookOpen className="mx-auto text-gray-200" size={60} />
            <p className="text-gray-300 font-black italic uppercase tracking-widest text-xs">No Intel Found in Your Profile</p>
            <button 
              onClick={() => navigate('/dashboard/browse-courses')}
              className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black italic uppercase text-[10px] tracking-widest hover:bg-gray-900 transition-all shadow-xl shadow-blue-100"
            >
              Access Global Catalog
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrolledCourses;