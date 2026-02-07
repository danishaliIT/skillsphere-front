import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, CheckCircle, Clock, AlertCircle, 
  ChevronRight, Search, Filter, Play, Award 
} from 'lucide-react';
import API from '../../api/axios'; // Apne path ke hisaab se adjust karein

const StudentAssignments = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending'); // pending | completed
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  
  // --- DUMMY DATA FOR UI (Jab tak backend se real data na aaye) ---
  // Real implementation mein hum API se fetch karenge
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Yahan hum API call karenge (e.g., API.get('student/assignments/'))
        // Filhal main dummy data set kar raha hoon taake UI pyara lage
        
        setTimeout(() => {
          setAssignments([
            {
              id: 1,
              title: "React Components & Props Quiz",
              course_name: "Full-Stack Web Development",
              type: "Quiz",
              due_date: "2026-01-25",
              status: "pending",
              total_questions: 10,
              duration: "15 mins"
            },
            {
              id: 2,
              title: "JavaScript ES6 Features",
              course_name: "Modern JavaScript Deep Dive",
              type: "Assignment",
              due_date: "2026-01-20",
              status: "overdue",
              total_questions: 5,
              duration: "30 mins"
            },
            {
              id: 3,
              title: "HTML5 Structure Test",
              course_name: "Web Fundamentals",
              type: "Quiz",
              submitted_at: "2026-01-10",
              status: "completed",
              score: 85,
              total_marks: 100
            }
          ]);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error("Failed to fetch assignments", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter Logic
  const filteredAssignments = assignments.filter(item => {
    if (activeTab === 'pending') return item.status === 'pending' || item.status === 'overdue';
    if (activeTab === 'completed') return item.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-bold italic pb-20">
      
      {/* --- HEADER SECTION --- */}
      <header className="flex flex-col md:flex-row justify-between items-end border-b border-slate-100 pb-6 gap-6">
        <div className="space-y-2">
          <p className="text-blue-600 text-[10px] uppercase tracking-[0.4em]">My Tasks</p>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter">
            Assignments
          </h1>
        </div>

        {/* --- STATS CARDS --- */}
        <div className="flex gap-4">
            <div className="bg-blue-50 px-6 py-4 rounded-2xl border border-blue-100">
                <p className="text-[10px] uppercase tracking-widest text-blue-400 font-black">Pending</p>
                <p className="text-2xl font-black text-blue-600">
                    {assignments.filter(a => a.status === 'pending').length}
                </p>
            </div>
            <div className="bg-green-50 px-6 py-4 rounded-2xl border border-green-100">
                <p className="text-[10px] uppercase tracking-widest text-green-400 font-black">Completed</p>
                <p className="text-2xl font-black text-green-600">
                    {assignments.filter(a => a.status === 'completed').length}
                </p>
            </div>
        </div>
      </header>

      {/* --- TABS & FILTERS --- */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl w-fit border border-slate-100 shadow-sm">
        <button 
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
            activeTab === 'pending' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'
          }`}
        >
          Pending Tasks
        </button>
        <button 
          onClick={() => setActiveTab('completed')}
          className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
            activeTab === 'completed' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'
          }`}
        >
          Completed History
        </button>
      </div>

      {/* --- ASSIGNMENTS LIST --- */}
      <div className="grid gap-4">
        {loading ? (
            <div className="p-10 text-center text-slate-400 italic">Loading tasks...</div>
        ) : filteredAssignments.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-dashed border-slate-200">
                <div className="bg-slate-50 p-4 rounded-full mb-4"><CheckCircle size={32} className="text-slate-300"/></div>
                <p className="text-slate-500 font-medium not-italic">No {activeTab} assignments found.</p>
            </div>
        ) : (
            filteredAssignments.map((task) => (
                <div 
                  key={task.id} 
                  className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all flex flex-col md:flex-row items-center gap-6"
                >
                    {/* Icon Box */}
                    <div className={`size-16 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
                        task.status === 'completed' ? 'bg-green-100 text-green-600' : 
                        task.status === 'overdue' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                        {task.status === 'completed' ? <Award size={28} /> : <FileText size={28} />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-center md:text-left space-y-2">
                        <div className="flex flex-col md:flex-row md:items-center gap-2">
                            <h3 className="text-lg font-black uppercase italic text-slate-800">{task.title}</h3>
                            <span className="text-[10px] px-2 py-1 rounded-md bg-slate-100 text-slate-500 font-bold uppercase tracking-wide w-fit mx-auto md:mx-0">
                                {task.course_name}
                            </span>
                        </div>
                        
                        <div className="flex items-center justify-center md:justify-start gap-4 text-xs text-slate-400 font-medium not-italic">
                            {task.status !== 'completed' && (
                                <span className={`flex items-center gap-1 ${task.status === 'overdue' ? 'text-red-500 font-bold' : ''}`}>
                                    <Clock size={14} /> Due: {task.due_date}
                                </span>
                            )}
                            <span className="flex items-center gap-1">
                                <FileText size={14} /> {task.total_questions} Questions
                            </span>
                            {task.duration && (
                                <span className="flex items-center gap-1">
                                    <Clock size={14} /> {task.duration}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Action Area */}
                    <div className="flex items-center gap-4">
                        {task.status === 'completed' ? (
                            <div className="text-right">
                                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Score</p>
                                <p className="text-2xl font-black text-green-600 italic">{task.score}/{task.total_marks}</p>
                            </div>
                        ) : (
                            task.status === 'overdue' && (
                                <div className="flex items-center gap-1 text-red-500 text-xs font-bold uppercase tracking-widest bg-red-50 px-3 py-2 rounded-lg">
                                    <AlertCircle size={14} /> Overdue
                                </div>
                            )
                        )}

                        <button 
                          onClick={() => navigate(`/course-player/${task.id}`)} // Link to your player
                          className={`size-12 rounded-full flex items-center justify-center transition-all ${
                              task.status === 'completed' 
                              ? 'bg-slate-100 text-slate-400 hover:bg-slate-200' 
                              : 'bg-slate-900 text-white hover:bg-blue-600 hover:scale-110 shadow-lg shadow-slate-200'
                          }`}
                        >
                            {task.status === 'completed' ? <Search size={20} /> : <Play size={20} className="ml-1" />}
                        </button>
                    </div>
                </div>
            ))
        )}
      </div>

    </div>
  );
};

export default StudentAssignments;