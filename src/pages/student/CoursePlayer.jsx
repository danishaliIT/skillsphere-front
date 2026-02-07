import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { 
  Play, ChevronLeft, Loader2, CheckCircle, 
  Award, BookOpen, Layout, Zap, FileText, Download, ChevronDown, List 
} from 'lucide-react';
import QuizComponent from './QuizComponent'; // Ensure path is correct

const CoursePlayer = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  // --- STATE MANAGEMENT ---
  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [enrollmentId, setEnrollmentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedTopics, setExpandedTopics] = useState({});
  
  // --- NEW QUIZ STATES ---
  const [quizData, setQuizData] = useState(null); // Stores quiz data
  const [viewMode, setViewMode] = useState('video'); // 'video' or 'quiz'

  // --- HELPER: YouTube Embed Fix ---
  const getEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("embed/")) return url;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) 
      ? `https://www.youtube.com/embed/${match[2]}`
      : url;
  };

  // --- INITIAL DATA FETCH ---
  useEffect(() => {
    const initPlayer = async () => {
      try {
        setLoading(true);
        const courseRes = await API.get(`courses/${slug}/`);
        setCourse(courseRes.data);

        const enrollRes = await API.get('enrollments/my-courses/');
        const currentEnrollment = enrollRes.data.find(e => e.course_details.slug === slug);
        
        if (currentEnrollment) {
          setEnrollmentId(currentEnrollment.id);
          // Auto-select first lesson
          if (courseRes.data.modules?.[0]?.weeks?.[0]?.lessons?.[0]) {
            setActiveLesson(courseRes.data.modules[0].weeks[0].lessons[0]);
          }
        } else {
          alert("You are not enrolled in this course.");
          navigate('/courses');
        }
      } catch (err) {
        console.error("System Error: Course retrieval failed", err);
      } finally {
        setLoading(false);
      }
    };
    initPlayer();
  }, [slug, navigate]);

  // --- FETCH QUIZ WHEN LESSON CHANGES ---
  useEffect(() => {
    if (activeLesson) {
      // 1. Reset States
      setQuizData(null);
      // Agar lesson ka main type hi Quiz hai, to direct quiz dikhao, warna video
      setViewMode(activeLesson.content_type === 'Quiz' ? 'quiz' : 'video');

      // 2. Check for attached Quiz (Even if it's a video lesson)
      API.get(`courses/lesson/${activeLesson.id}/quiz/`)
        .then(res => {
          setQuizData(res.data);
        })
        .catch(() => {
          setQuizData(null); // No quiz found
        });
    }
  }, [activeLesson]);

  // --- HANDLERS ---
  const handleLessonClick = async (lesson) => {
      try {
          const res = await API.get(`courses/lessons/${lesson.id}/`);
          setActiveLesson(res.data); 
      } catch (error) {
          setActiveLesson(lesson); 
      }
  };

  const handleMarkAsComplete = async () => {
    if (!enrollmentId) return;
    try {
      const currentPercentage = course.progress?.percentage || 0;
      const nextPercentage = Math.min(currentPercentage + 10, 100); 

      await API.patch(`enrollments/progress/${enrollmentId}/`, { 
        percentage: nextPercentage 
      });

      alert(`Sync Complete: Progress advanced to ${nextPercentage}%`);
    } catch (err) {
      console.error("Data Synchronization Failure:", err);
    }
  };

  const toggleTopic = (topicId) => {
      setExpandedTopics(prev => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#0F172A] space-y-4">
      <Loader2 className="animate-spin text-blue-500" size={50} />
      <p className="text-blue-400 font-black italic uppercase text-[10px] tracking-[0.5em]">Initializing Player...</p>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-bold italic">
      
      {/* ================= SIDEBAR ================= */}
      <div className="w-80 bg-[#0F172A] flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.1)] z-20">
        <div className="p-8 border-b border-white/5">
          <button 
            onClick={() => navigate('/dashboard/enrolled-courses')} 
            className="flex items-center gap-2 text-[9px] text-blue-400 uppercase tracking-[0.3em] mb-6 hover:text-white transition-all group"
          >
            <ChevronLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </button>
          <h2 className="text-xl font-black text-white uppercase italic tracking-tighter leading-tight">
            {course?.title || "Course Player"}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-hide">
          {course?.modules?.map((module) => (
            <div key={module.id} className="space-y-4">
              <h3 className="px-4 text-[10px] text-blue-500 uppercase tracking-[0.2em] font-black italic opacity-80 flex items-center gap-2">
                <Layout size={12} /> {module.title}
              </h3>
              {module.weeks?.map((week) => (
                <div key={week.id} className="space-y-1">
                  <p className="px-4 text-[9px] text-slate-500 uppercase font-black mb-2 tracking-widest">{week.title}</p>
                  {week.lessons?.map((lesson) => (
                    <button 
                      key={lesson.id}
                      onClick={() => handleLessonClick(lesson)}
                      className={`w-full text-left px-5 py-4 rounded-2xl flex items-center gap-3 transition-all duration-300 ${
                        activeLesson?.id === lesson.id 
                        ? 'bg-blue-600 text-white shadow-[0_10px_20px_rgba(37,99,235,0.3)] scale-[1.02]' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {lesson.content_type === 'Video' ? <Play size={14} /> : <Zap size={14} />}
                      <span className="text-[11px] uppercase tracking-tighter leading-none line-clamp-1">{lesson.title}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 overflow-y-auto bg-white p-12 relative z-10">
        <div className="max-w-5xl mx-auto space-y-10">
          
          <header className="flex justify-between items-end border-b border-slate-50 pb-8">
            <div className="space-y-2">
              <p className="text-blue-600 text-[10px] uppercase tracking-[0.4em] font-black italic">
                Active Deployment: {activeLesson?.title}
              </p>
              <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                {activeLesson?.title || "Select a Lesson"}
              </h1>
            </div>
            
            <button 
              onClick={handleMarkAsComplete}
              className="px-8 py-4 bg-slate-900 text-white rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:-translate-y-1 transition-all flex items-center gap-2 shadow-2xl shadow-slate-200"
            >
              <CheckCircle size={16} /> Mark Complete
            </button>
          </header>

          {/* --- VIEW MODE TOGGLE BUTTONS --- */}
          {/* Only show toggle if there is a quiz available */}
          <div className="flex gap-6 border-b border-slate-100">
            <button
                onClick={() => setViewMode('video')}
                className={`pb-4 text-[10px] uppercase tracking-[0.2em] font-black transition-all ${
                    viewMode === 'video' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
            >
                <div className="flex items-center gap-2">
                    <Play size={14} /> Watch Deployment
                </div>
            </button>

            {quizData && (
                <button
                    onClick={() => setViewMode('quiz')}
                    className={`pb-4 text-[10px] uppercase tracking-[0.2em] font-black transition-all ${
                        viewMode === 'quiz' 
                        ? 'text-blue-600 border-b-2 border-blue-600' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <List size={14} /> Tactical Assessment
                    </div>
                </button>
            )}
          </div>

          {/* --- MEDIA PLAYER AREA (DYNAMIC) --- */}
          <div className="aspect-video bg-slate-950 rounded-[3rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(15,23,42,0.3)] relative border-[16px] border-slate-900 shadow-blue-900/10">
            
            {viewMode === 'video' ? (
                // --- VIDEO VIEW ---
                activeLesson?.content_type === 'Video' ? (
                    <iframe 
                        src={getEmbedUrl(activeLesson.video_url)} 
                        className="w-full h-full"
                        allowFullScreen
                        title="Course Player"
                    />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center p-20 text-center space-y-8">
                        <BookOpen size={64} className="text-blue-500 opacity-20" />
                        <p className="text-white text-xl italic font-medium leading-relaxed max-w-2xl opacity-90">
                            {activeLesson?.description || "Select a lesson to start learning."}
                        </p>
                    </div>
                )
            ) : (
                // --- QUIZ VIEW ---
                // Pass activeLesson.id so we can submit the result to backend
                <QuizComponent quizData={quizData} lessonId={activeLesson?.id} />
            )}

          </div>

          {/* --- ADDITIONAL CONTENT (Topics & Assets) --- */}
          {/* Only show notes if in Video Mode or desired */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
              
              {/* Left Column: Description & Topics */}
              <div className="lg:col-span-2 space-y-8">
                  <div className="bg-slate-50 p-8 rounded-3xl">
                      <h3 className="text-lg font-black uppercase italic text-slate-800 mb-4">Lesson Notes</h3>
                      <p className="text-slate-600 leading-relaxed font-normal not-italic text-sm">
                          {activeLesson?.description || "No description available for this lesson."}
                      </p>
                  </div>

                  {/* Topics List (Nested Content) */}
                  {activeLesson?.topics?.length > 0 && (
                      <div className="space-y-4">
                          <h3 className="text-lg font-black uppercase italic text-slate-800">Chapter Topics</h3>
                          {activeLesson.topics.map((topic) => (
                              <div key={topic.id} className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                                  <button 
                                    onClick={() => toggleTopic(topic.id)}
                                    className="w-full flex justify-between items-center p-5 bg-slate-50 hover:bg-slate-100 transition-colors"
                                  >
                                      <span className="font-bold text-slate-700 text-sm">{topic.title}</span>
                                      <ChevronDown size={16} className={`text-slate-400 transition-transform ${expandedTopics[topic.id] ? 'rotate-180' : ''}`} />
                                  </button>
                                  
                                  {expandedTopics[topic.id] && (
                                      <div className="p-5 bg-white space-y-3">
                                          <p className="text-sm text-slate-500 font-normal not-italic">{topic.description}</p>
                                          {topic.subtopics?.map(sub => (
                                              <div key={sub.id} className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                                                  <Play size={14} className="text-blue-500" />
                                                  <span className="text-xs text-blue-900 font-semibold">{sub.title}</span>
                                              </div>
                                          ))}
                                      </div>
                                  )}
                              </div>
                          ))}
                      </div>
                  )}
              </div>

              {/* Right Column: Downloadable Assets */}
              <div className="space-y-6">
                  <h3 className="text-lg font-black uppercase italic text-slate-800">Resources</h3>
                  
                  {activeLesson?.assets?.length > 0 ? (
                      activeLesson.assets.map((asset) => (
                          <a 
                            key={asset.id}
                            href={asset.file} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all group"
                          >
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                  <FileText size={18} />
                              </div>
                              <div className="flex-1">
                                  <p className="text-xs font-bold text-slate-800 uppercase line-clamp-1">{asset.caption || "Download File"}</p>
                                  <p className="text-[10px] text-slate-400 font-normal">Click to open</p>
                              </div>
                              <Download size={16} className="text-slate-300 group-hover:text-blue-600" />
                          </a>
                      ))
                  ) : (
                      <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center">
                          <p className="text-xs text-slate-400 font-normal">No resources attached.</p>
                      </div>
                  )}
              </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;