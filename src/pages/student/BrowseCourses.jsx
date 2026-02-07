import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API, { getMediaUrl } from '../../api/axios';
import { 
  Search, Star, Clock, ChevronRight, Loader2, 
  Shield, Brain, Code, CircleDollarSign, UserPlus, CheckCircle 
} from 'lucide-react';


const BrowseCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null); 
  const [searchQuery, setSearchQuery] = useState("");

  const categoryIcons = {
    'Military Tech': <Shield size={16} className="text-blue-400" />,
    'AI & Robotics': <Brain size={16} className="text-purple-400" />,
    'Web Dev': <Code size={16} className="text-green-400" />,
    'Finance': <CircleDollarSign size={16} className="text-yellow-400" />,
    'NLP': <Brain size={16} className="text-orange-400" />
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await API.get('courses/');
        setCourses(res.data);
      } catch (err) {
        console.error("LMS Catalog load karne mein masla:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // --- ENROLLMENT HANDLER ---
  const handleEnroll = async (courseId) => {
    setEnrollingId(courseId);
    try {
      // Logic for both Free and Paid enrollment
      const res = await API.post(`enrollments/enroll/${courseId}/`);
      
      if (res.data.action === 'payment_required') {
        // Redirection to Payment Tab for $50+ courses
        alert(res.data.message);
        navigate(`/dashboard/payment/${res.data.enrollment_id}`); 
      } else {
        // Direct redirection for Free courses
        alert("Enrolled Successfully!");
        navigate('/dashboard/enrolled-courses');
      }
    } catch (err) {
      alert(err.response?.data?.error || "Enrollment failed. Please ensure you are logged in as a Student.");
    } finally {
      setEnrollingId(null);
    }
  };

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="animate-spin text-blue-600" size={50} />
      <p className="text-gray-400 font-black italic uppercase text-[10px] tracking-widest text-center">
        Scanning Global Database...
      </p>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 p-4 md:p-8">
      {/* --- HEADER SECTION --- */}
      <header className="space-y-3">
        <h1 className="text-5xl md:text-6xl font-black text-gray-900 italic uppercase tracking-tighter text-center md:text-left">
          Browse Catalog
        </h1>
        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.4em] italic text-center md:text-left">
          Advanced Intelligence & Specialized Training
        </p>
      </header>

      {/* --- SEARCH BAR --- */}
      <div className="relative max-w-2xl group mx-auto md:mx-0">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={22} />
        <input 
          type="text" 
          placeholder="Search Military Tech, AI, or MERN..." 
          className="w-full pl-16 pr-8 py-6 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm outline-none focus:ring-4 focus:ring-blue-50 font-bold italic transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* --- COURSES GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-[3.5rem] border border-gray-50 shadow-xl overflow-hidden group hover:-translate-y-3 transition-all duration-500 flex flex-col">
              {/* Thumbnail Area */}
              <div className="h-56 bg-gray-900 relative overflow-hidden">
                <img 
  src={course.thumbnail ? getMediaUrl(course.thumbnail) : 'https://via.placeholder.com/400x300'} 
  className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
  alt={course.title}
/>
                <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl text-[9px] font-black text-gray-900 uppercase italic flex items-center gap-2 shadow-lg">
                  {categoryIcons[course.category] || <Star size={12} />}
                  {course.category}
                </div>
              </div>

              {/* Content Area */}
              <div className="p-8 space-y-5 flex-1 flex flex-col">
                <h3 className="text-2xl font-black text-gray-900 italic leading-tight group-hover:text-blue-600 transition-colors">
                  {course.title}
                </h3>
                
                <p className="text-gray-400 text-xs font-medium italic line-clamp-2 leading-relaxed">
                  {course.description || "Explore specialized curriculum and advanced research modules."}
                </p>

                <div className="pt-6 border-t border-gray-50 flex flex-col space-y-4 mt-auto">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase italic">Training Fee</p>
                      <p className="text-2xl font-black text-gray-900 italic tracking-tighter">${course.price}</p>
                    </div>
                    {/* Course Detail Button */}
                    <button 
                      onClick={() => navigate(`/dashboard/course/${course.slug}`)} 
                      className="size-12 bg-gray-100 text-gray-900 rounded-[1.2rem] flex items-center justify-center hover:bg-blue-50 transition-all"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>

                  {/* ENROLLMENT BUTTON */}
                  <button 
                    onClick={() => handleEnroll(course.id)}
                    disabled={enrollingId === course.id}
                    className={`w-full py-4 rounded-[1.5rem] font-black italic uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl ${
                      enrollingId === course.id 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-gray-900 shadow-blue-100 hover:shadow-gray-200 shadow-blue-50'
                    }`}
                  >
                    {enrollingId === course.id ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <><UserPlus size={16} /> {course.price > 0 ? 'Buy Training' : 'Enroll in Training'}</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-4">
            <p className="text-gray-300 font-black italic uppercase tracking-widest">No Intel Found Matching Your Request</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseCourses;