import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileQuestion, Plus, Search, Trash2, Edit, 
  CheckCircle, Clock, MoreVertical, Layers 
} from 'lucide-react';
import API from '../../api/axios';

const InstructorQuizzes = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // --- FETCH INSTRUCTOR QUIZZES ---
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        // Backend endpoint: Maan lo humare paas instructor ke sare quizzes lane ka route hai
        // Agar nahi hai, toh hum lessons fetch karke unke quizzes filter kar sakte hain
        const res = await API.get('instructor/quizzes/'); 
        setQuizzes(res.data);
      } catch (err) {
        console.error("Fetch failed", err);
        // --- DUMMY DATA FOR PREVIEW (Jab tak backend ready na ho) ---
        setQuizzes([
            { id: 1, title: "Python Basics Test", course: "Python Masterclass", lesson: "Variables & Types", total_marks: 50, questions_count: 10, status: 'active' },
            { id: 2, title: "React Hooks Deep Dive", course: "Frontend Bootcamp", lesson: "useEffect Hook", total_marks: 20, questions_count: 5, status: 'draft' },
            { id: 3, title: "Django ORM Challenge", course: "Backend Pro", lesson: "Database Queries", total_marks: 100, questions_count: 20, status: 'active' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  // --- DELETE QUIZ ---
  const handleDelete = async (id) => {
    if(!window.confirm("Delete this quiz permanently?")) return;
    try {
        // await API.delete(`quizzes/${id}/`);
        setQuizzes(prev => prev.filter(q => q.id !== id));
    } catch(err) {
        alert("Could not delete quiz");
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 font-bold italic pb-32">
      
      {/* --- HEADER SECTION --- */}
      <header className="flex flex-col md:flex-row justify-between items-end border-b border-slate-100 pb-8 gap-6">
        <div className="space-y-2">
          <p className="text-blue-600 text-[10px] uppercase tracking-[0.4em]">Evaluation Center</p>
          <h1 className="text-5xl font-black text-slate-900 uppercase italic tracking-tighter">
            Quiz Manager
          </h1>
        </div>
        
        <button 
          onClick={() => navigate('/instructor/quizzes/create')} // Route to Create Page
          className="px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2 shadow-xl shadow-slate-200"
        >
          <Plus size={16} /> Create New Quiz
        </button>
      </header>

      {/* --- SEARCH & STATS --- */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Search Bar */}
        <div className="flex-1 bg-white p-2 pl-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
            <Search size={20} className="text-slate-300"/>
            <input 
                type="text" 
                placeholder="Search quizzes by title..." 
                className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-300 font-medium not-italic"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-4">
            <div className="bg-blue-50 px-8 py-4 rounded-[2rem] text-center">
                <p className="text-[10px] text-blue-400 uppercase tracking-widest">Total</p>
                <p className="text-2xl font-black text-blue-600">{quizzes.length}</p>
            </div>
            <div className="bg-green-50 px-8 py-4 rounded-[2rem] text-center">
                <p className="text-[10px] text-green-400 uppercase tracking-widest">Active</p>
                <p className="text-2xl font-black text-green-600">{quizzes.filter(q => q.status === 'active').length}</p>
            </div>
        </div>
      </div>

      {/* --- QUIZ LIST GRID --- */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {quizzes.filter(q => q.title.toLowerCase().includes(searchTerm.toLowerCase())).map((quiz) => (
            <div key={quiz.id} className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all relative overflow-hidden">
                
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:bg-blue-50 transition-colors"></div>

                <div className="relative z-10 flex flex-col gap-6">
                    {/* Top Row: Icon & Status */}
                    <div className="flex justify-between items-start">
                        <div className="size-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200 group-hover:bg-blue-600 transition-colors">
                            <FileQuestion size={28} />
                        </div>
                        <span className={`px-4 py-2 rounded-full text-[10px] uppercase font-black tracking-widest ${
                            quiz.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                        }`}>
                            {quiz.status}
                        </span>
                    </div>

                    {/* Content Info */}
                    <div className="space-y-1">
                        <h3 className="text-2xl font-black italic uppercase text-slate-900 leading-none">
                            {quiz.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wide">
                            <Layers size={14} /> 
                            <span>{quiz.course}</span> 
                            <span className="text-slate-300">/</span> 
                            <span>{quiz.lesson}</span>
                        </div>
                    </div>

                    {/* Metrics */}
                    <div className="flex items-center gap-6 py-4 border-t border-slate-50 mt-2">
                        <div className="text-center">
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Questions</p>
                            <p className="text-xl font-black text-slate-800">{quiz.questions_count}</p>
                        </div>
                        <div className="w-px h-8 bg-slate-100"></div>
                        <div className="text-center">
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Marks</p>
                            <p className="text-xl font-black text-slate-800">{quiz.total_marks}</p>
                        </div>
                        <div className="w-px h-8 bg-slate-100"></div>
                        <div className="text-center">
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Passing</p>
                            <p className="text-xl font-black text-green-600">50%</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <button 
                            onClick={() => navigate(`/instructor/quizzes/edit/${quiz.id}`)}
                            className="flex-1 bg-slate-50 text-slate-600 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                            <Edit size={14} /> Edit Content
                        </button>
                        <button 
                            onClick={() => handleDelete(quiz.id)}
                            className="px-4 py-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            </div>
        ))}
      </div>

      {quizzes.length === 0 && !loading && (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
              <p className="text-slate-400 font-bold uppercase tracking-widest">No Quizzes Found</p>
              <button onClick={() => navigate('/instructor/quizzes/create')} className="mt-4 text-blue-600 underline">Create your first quiz</button>
          </div>
      )}

    </div>
  );
};

export default InstructorQuizzes;