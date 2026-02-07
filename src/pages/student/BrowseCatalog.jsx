import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API, { getMediaUrl } from '../../api/axios';
import { Search, Star, Clock, ChevronRight, Loader2, Shield, Brain, Code, CircleDollarSign } from 'lucide-react';


const BrowseCatalog = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Category icons mapping based on your interests
  const categoryIcons = {
    'Military Tech': <Shield size={14} />,
    'AI & Robotics': <Brain size={14} />,
    'Web Dev': <Code size={14} />,
    'Finance': <CircleDollarSign size={14} />
  };

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await API.get('courses/catalog/'); // ViewSet list endpoint
        setCourses(res.data);
      } catch (err) {
        console.error("Failed to load catalog");
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={50} /></div>;

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <header className="space-y-3">
        <h1 className="text-6xl font-black text-gray-900 italic uppercase tracking-tighter">Browse Catalog</h1>
        <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.3em] italic">DragonTech Specialized Skills</p>
      </header>

      {/* Search Input */}
      <div className="relative max-w-2xl">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={22} />
        <input 
          type="text" 
          placeholder="Search for Military Tech, AI, or MERN..." 
          className="w-full pl-16 pr-8 py-6 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm outline-none focus:ring-4 focus:ring-blue-50 font-bold italic"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-[3.5rem] border border-gray-50 shadow-xl overflow-hidden group hover:-translate-y-2 transition-all duration-500">
            <div className="h-56 bg-gray-900 relative">
              <img 
                src={course.thumbnail ? getMediaUrl(course.thumbnail) : 'https://via.placeholder.com/400x300'} 
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                alt={course.title}
              />
              <div className="absolute top-6 left-6 px-4 py-2 bg-blue-600 rounded-2xl text-[10px] font-black text-white uppercase italic flex items-center gap-2">
                {categoryIcons[course.category]} {course.category}
              </div>
            </div>

            <div className="p-8 space-y-5">
              <h3 className="text-2xl font-black text-gray-900 italic leading-tight">{course.title}</h3>
              <p className="text-gray-400 text-xs font-bold line-clamp-2 italic">{course.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase italic">Investment</p>
                  <p className="text-2xl font-black text-gray-900 italic">${course.price}</p>
                </div>
                <button 
                  onClick={() => navigate(`/dashboard/course/${course.slug}`)} // Slug based navigation
                  className="size-14 bg-gray-900 text-white rounded-[1.5rem] flex items-center justify-center hover:bg-blue-600 transition-all shadow-xl"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowseCatalog;