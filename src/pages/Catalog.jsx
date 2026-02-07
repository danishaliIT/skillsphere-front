import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API, { getMediaUrl } from '../api/axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import THEME from '../styles/theme';
import { 
  Search, Filter, ChevronRight, 
  Loader2, Star, Users, Clock, Award, 
  BookOpen, Code, TrendingUp, Heart
} from 'lucide-react';

const Catalog = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Fetch all courses from backend
        const res = await API.get('courses/');
        setCourses(res.data);
      } catch (err) {
        console.error("Failed to load courses", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      const res = await API.post(`courses/enroll/`, { course_id: courseId });
      alert(res.data.message || 'Successfully enrolled!');
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || "Enrollment failed.");
    }
  };

  const toggleFavorite = (courseId) => {
    setFavorites(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || c.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: 'all', label: 'All Courses', icon: <BookOpen size={14} /> },
    { value: 'web_development', label: 'Web Dev', icon: <Code size={14} /> },
    { value: 'mobile_development', label: 'Mobile Dev', icon: <Code size={14} /> },
    { value: 'data_science', label: 'Data Science', icon: <TrendingUp size={14} /> },
    { value: 'machine_learning', label: 'AI/ML', icon: <TrendingUp size={14} /> },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          
          {/* HERO SECTION */}
          <div className="relative -mx-6 px-6 py-16 rounded-3xl overflow-hidden" style={{ background: THEME.gradients.primary }}>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 right-10 size-40 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 left-10 size-40 bg-white rounded-full blur-3xl"></div>
            </div>
            <div className="relative space-y-6 text-center">
              <h1 className="text-5xl md:text-6xl font-black text-white italic tracking-tighter">
                Browse All Courses
              </h1>
              <p className="text-blue-100 font-bold text-lg max-w-2xl mx-auto">
                Explore our comprehensive collection of courses taught by industry experts. Find the perfect course to advance your career.
              </p>
              <div className="flex justify-center gap-8 pt-4">
                <div className="text-white">
                  <p className="text-3xl font-black">{courses.length}+</p>
                  <p className="text-xs font-bold uppercase tracking-widest">Total Courses</p>
                </div>
                <div className="w-px bg-white/30"></div>
                <div className="text-white">
                  <p className="text-3xl font-black">50K+</p>
                  <p className="text-xs font-bold uppercase tracking-widest">Active Learners</p>
                </div>
                <div className="w-px bg-white/30"></div>
                <div className="text-white">
                  <p className="text-3xl font-black">4.9★</p>
                  <p className="text-xs font-bold uppercase tracking-widest">Average Rating</p>
                </div>
              </div>
            </div>
          </div>

          {/* SEARCH & FILTERS */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-stretch">
              {/* SEARCH BAR */}
              <div className="relative flex-1">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-400" size={20} />
                <input 
                  type="text"
                  placeholder="Search courses by name or skill..."
                  className="w-full pl-16 pr-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-bold text-gray-900 placeholder-gray-400 transition-all shadow-sm"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  value={searchTerm}
                />
              </div>

              {/* FILTER BUTTON */}
              <button className="px-6 py-4 bg-gray-100 hover:bg-gray-200 rounded-2xl font-black text-gray-700 flex items-center gap-2 transition-all">
                <Filter size={20} />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>

            {/* CATEGORY TABS */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
                    activeCategory === cat.value 
                      ? `text-white shadow-lg` 
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                  style={activeCategory === cat.value ? { background: THEME.gradients.primary } : {}}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* RESULTS INFO */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-gray-500">
              Showing <span className="text-gray-900 font-black">{filteredCourses.length}</span> of <span className="text-gray-900 font-black">{courses.length}</span> courses
            </p>
            <select className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm font-bold text-gray-700 cursor-pointer">
              <option>Most Popular</option>
              <option>Highest Rated</option>
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>

          {/* COURSES GRID */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="animate-spin text-blue-600" size={48} />
              <p className="text-gray-400 font-bold">Loading amazing courses...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="py-32 text-center">
              <div className="inline-block p-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <Search className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-500 font-bold text-lg mb-2">No courses found</p>
                <p className="text-gray-400 text-sm font-medium">Try adjusting your search or filters</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <div 
                  key={course.id} 
                  className="group cursor-pointer transition-all duration-300 hover:shadow-2xl"
                  onClick={() => navigate(`/course/${course.slug || course.id}`)}
                >
                  {/* LARGE TITLE CARD WITH BACKGROUND IMAGE */}
                  <div 
                    className="h-56 rounded-3xl overflow-hidden flex flex-col items-start justify-between p-6 text-white relative group-hover:scale-105 transition-transform bg-cover bg-center"
                    style={{
                      backgroundImage: course.thumbnail 
                        ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${getMediaUrl(course.thumbnail)}')`
                        : 'linear-gradient(135deg, rgb(37, 99, 235), rgb(59, 130, 246))',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {/* CATEGORY & PRICE */}
                    <div className="flex items-center justify-between w-full relative z-10">
                      <span className="text-xs font-black bg-white/20 backdrop-blur text-white px-3 py-1 rounded-full uppercase tracking-tight">
                        {course.category || 'Course'}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(course.id);
                        }}
                        className="p-2 hover:bg-white/20 rounded-lg transition-all"
                      >
                        <Heart 
                          size={20} 
                          className={favorites.includes(course.id) ? 'fill-red-400 text-red-400' : 'text-white'}
                        />
                      </button>
                    </div>

                    {/* LARGE TITLE */}
                    <div className="relative z-10">
                      <p className="text-xs font-bold text-blue-100 mb-2">Course</p>
                      <h3 className="text-3xl font-black italic leading-tight line-clamp-3">
                        {course.title}
                      </h3>
                    </div>

                    {/* PRICE */}
                    {course.price && (
                      <p className="text-2xl font-black text-white mt-4 relative z-10">${course.price}</p>
                    )}
                  </div>

                  {/* CONTENT CARD */}
                  <div className="bg-white border border-gray-200 rounded-3xl rounded-t-none p-6 space-y-4">
                    <p className="text-sm text-gray-600 font-bold line-clamp-3 leading-relaxed">
                      {course.description || 'Master new skills with this comprehensive course'}
                    </p>

                    {/* STATS */}
                    <div className="grid grid-cols-3 gap-3 py-4 border-t border-b border-gray-100">
                      <div className="text-center">
                        <p className="text-lg font-black text-gray-900">4.9</p>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Rating</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-black text-gray-900">20h</p>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Duration</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-black text-gray-900">500+</p>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Students</p>
                      </div>
                    </div>

                    {/* FEATURES */}
                    <div className="space-y-2 text-xs text-gray-600 font-medium">
                      <div className="flex items-center gap-2">
                        <Award size={14} className="text-green-600 flex-shrink-0" />
                        <span>Certificate Included</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-blue-600 flex-shrink-0" />
                        <span>Lifetime Access</span>
                      </div>
                    </div>

                    {/* BUTTON */}
                    <button 
                      onClick={() => handleEnroll(course.id)}
                      className="w-full h-12 font-black uppercase tracking-wider rounded-2xl text-white transition-all hover:shadow-lg"
                      style={{ background: THEME.gradients.primary }}
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* BOTTOM CTA */}
          {filteredCourses.length > 0 && (
            <div className="mt-20 p-12 rounded-2xl border border-blue-200" style={{ background: THEME.primary.light + '10' }}>
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 italic mb-2">Still exploring?</h2>
                  <p className="text-gray-600 font-medium">Check out instructor-led trainings for live interactive sessions</p>
                </div>
                <button 
                  onClick={() => navigate('/trainings')}
                  className="px-8 py-4 rounded-xl font-black text-white uppercase tracking-widest whitespace-nowrap shadow-lg hover:shadow-xl transition-all"
                  style={{ background: THEME.gradients.primary }}
                >
                  View Trainings
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Catalog;