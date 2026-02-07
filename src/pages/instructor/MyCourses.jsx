import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Library, Edit, Trash2, Users, Plus, 
  AlertCircle, CheckCircle, Clock, Loader2, Search 
} from 'lucide-react';
import API, { getMediaUrl } from '../../api/axios'; // Ensure path is correct

const MyCourses = () => {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // --- FETCH INSTRUCTOR COURSES ---
  useEffect(() => {
    const fetchInstructorCourses = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        // Backend: InstructorWorkspaceView
        const res = await API.get('courses/my-workspace/');
        setCourses(res.data);
      } catch (err) {
        console.error('Courses fetch failed:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchInstructorCourses();
  }, [navigate]);

  // --- DELETE COURSE ---
  const handleDelete = async (slug, id) => {
    if(!window.confirm("Are you sure you want to delete this course? This cannot be undone.")) return;

    try {
      setDeletingId(id);
      // Backend: CourseViewSet (destroy)
      await API.delete(`courses/${slug}/`);
      
      // UI update immediately
      setCourses(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete course.");
    } finally {
      setDeletingId(null);
    }
  };

  // --- SUBMIT FOR REVIEW ---
  const handleSubmitForReview = async (slug, idx) => {
    try {
      await API.post(`courses/my-workspace/submit/${slug}/`, { notes: 'Ready for publish' });
      // Update status locally to show instant feedback
      setCourses(prev => prev.map((c, i) => i === idx ? { ...c, status: 'pending' } : c));
    } catch (err) {
      console.error('Submit failed', err);
      alert('Failed to submit course for review');
    }
  };

  // --- HELPER: Status Badge ---
  const getStatusBadge = (status) => {
    switch(status) {
      case 'published':
        return <span className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"><CheckCircle size={12}/> Published</span>;
      case 'pending':
        return <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"><Clock size={12}/> In Review</span>;
      case 'rejected':
        return <span className="flex items-center gap-1 text-red-600 bg-red-50 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"><AlertCircle size={12}/> Rejected</span>;
      default: // draft
        return <span className="flex items-center gap-1 text-slate-500 bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"><Edit size={12}/> Draft</span>;
    }
  };

  // --- RENDER ---
  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-700 font-bold italic pb-32">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-end border-b border-slate-100 pb-8 gap-6">
        <div className="space-y-2">
          <p className="text-blue-600 text-[10px] uppercase tracking-[0.4em]">Instructor Studio</p>
          <h1 className="text-5xl font-black text-slate-900 uppercase italic tracking-tighter">My Asset Library</h1>
        </div>
        
        <button 
          onClick={() => navigate('/instructor/create-course')} 
          className="px-8 py-4 bg-blue-600 text-white rounded-[1.5rem] text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center gap-2 shadow-xl shadow-blue-100"
        >
          <Plus size={16} /> Deploy New Course
        </button>
      </header>

      {/* EMPTY STATE */}
      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm text-center space-y-6">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
                <Library size={32} className="text-blue-500" />
            </div>
            <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-800 uppercase italic">No Courses Found</h3>
                <p className="text-slate-400 font-medium not-italic max-w-md mx-auto">You haven't deployed any courses yet. Start by creating your first curriculum.</p>
            </div>
            <button 
              onClick={() => navigate('/instructor/create-course')}
              className="px-6 py-3 border-2 border-dashed border-slate-300 rounded-xl text-xs font-black uppercase text-slate-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              Create Course Now
            </button>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {courses.map((course, idx) => (
            <div key={course.id} className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all group flex flex-col sm:flex-row gap-6">
                
                {/* THUMBNAIL */}
                <div className="w-full sm:w-40 h-40 bg-slate-100 rounded-[1.5rem] overflow-hidden flex-shrink-0 relative">
                  {course.thumbnail ? (
                    <img
                      src={getMediaUrl(course.thumbnail)}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt={course.title}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Library size={32} />
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                      <span className="bg-slate-900/80 text-white px-2 py-1 rounded-md text-[8px] uppercase font-black backdrop-blur-sm">
                          {course.category || 'General'}
                      </span>
                  </div>
                </div>

                {/* DETAILS */}
                <div className="flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between items-start">
                            {getStatusBadge(course.status)}
                            <span className="text-blue-600 text-lg font-black italic">{course.price > 0 ? `$${course.price}` : 'FREE'}</span>
                        </div>
                        <h3 className="text-xl font-black uppercase italic text-slate-900 leading-tight line-clamp-2" title={course.title}>
                            {course.title}
                        </h3>
                    </div>

                    <div className="flex items-center gap-4 border-t border-slate-50 pt-4 mt-auto">
                        <div className="flex items-center gap-2 text-slate-400">
                            <Users size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">0 Students</span>
                        </div>
                        
                        <div className="flex-1 flex justify-end gap-2">
                            {/* ACTION BUTTONS */}
                            <button 
                                onClick={() => navigate(`/instructor/courses/edit/${course.slug}`)} 
                                className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                                title="Edit Course"
                            >
                                <Edit size={16}/>
                            </button>
                            
                            <button 
                                onClick={() => handleDelete(course.slug, course.id)}
                                disabled={deletingId === course.id}
                                className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                                title="Delete Course"
                            >
                                {deletingId === course.id ? <Loader2 size={16} className="animate-spin"/> : <Trash2 size={16}/>}
                            </button>

                            {['draft', 'rejected'].includes(course.status) && (
                                <button 
                                    onClick={() => handleSubmitForReview(course.slug, idx)}
                                    className="px-4 py-3 bg-slate-900 text-white rounded-xl text-[10px] uppercase font-black tracking-widest hover:bg-green-600 transition-all flex items-center gap-2"
                                >
                                    Submit <ArrowRight size={12} className="hidden sm:block"/>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper for Submit Button icon
import { ArrowRight } from 'lucide-react';

export default MyCourses;