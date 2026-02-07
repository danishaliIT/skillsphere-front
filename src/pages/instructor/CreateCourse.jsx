import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API, { getMediaUrl } from '../../api/axios';
import { 
  Plus, Save, Trash2, Video, FileText, HelpCircle, 
  Upload, ChevronDown, Layers, ArrowRight, ArrowLeft, Loader2, X 
} from 'lucide-react';

const CreateCourse = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  
  // --- STATE ---
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  
  const [courseData, setCourseData] = useState({
    title: '',
    category: 'Web Dev',
    price: '',
    description: '',
    thumbnail: null,
    thumbnailPreview: null,
    modules: [
      { 
        title: 'Module 1: Foundation', 
        order: 1, 
        weeks: [
          { title: 'Week 1: Getting Started', order: 1, lessons: [] }
        ]
      }
    ]
  });

  const [filesMap, setFilesMap] = useState({});

  // --- INITIAL LOAD ---
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if(!token) {
      alert('Authentication required.');
      navigate('/login');
      return;
    }

    if (slug) {
      const fetchCourse = async () => {
        setLoading(true);
        try {
          const res = await API.get(`courses/${slug}/`);
          setCourseData({
            title: res.data.title || '',
            category: res.data.category || 'Web Dev',
            price: res.data.price || '',
            description: res.data.description || '',
            thumbnail: null,
            thumbnailPreview: getMediaUrl(res.data.thumbnail),
            modules: res.data.modules || []
          });
          setIsEditMode(true);
        } catch (err) {
          console.error('Failed to load course:', err);
          navigate('/instructor/courses');
        } finally {
          setLoading(false);
        }
      };
      fetchCourse();
    }
  }, [slug, navigate]);

  // --- HANDLERS ---
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourseData({
        ...courseData,
        thumbnail: file,
        thumbnailPreview: URL.createObjectURL(file)
      });
    }
  };

  const handleFileSelection = (key, file) => {
    setFilesMap(prev => ({ ...prev, [key]: file }));
  };

  const removeFileSelection = (key) => {
    const newFiles = { ...filesMap };
    delete newFiles[key];
    setFilesMap(newFiles);
  };

  const addModule = () => {
    setCourseData(prev => ({
      ...prev,
      modules: [...prev.modules, { 
        title: `Module ${prev.modules.length + 1}`, order: prev.modules.length + 1, weeks: [] 
      }]
    }));
  };

  const addWeek = (mIdx) => {
    const newModules = [...courseData.modules];
    newModules[mIdx].weeks.push({
      title: `Week ${newModules[mIdx].weeks.length + 1}`, order: newModules[mIdx].weeks.length + 1, lessons: []
    });
    setCourseData({ ...courseData, modules: newModules });
  };

  const addLesson = (mIdx, wIdx) => {
    const newModules = [...courseData.modules];
    const currentLessons = newModules[mIdx].weeks[wIdx].lessons;
    newModules[mIdx].weeks[wIdx].lessons.push({
      title: 'New Topic', 
      content_type: 'Video', 
      order: currentLessons.length + 1 
    });
    setCourseData({ ...courseData, modules: newModules });
  };

  const updateNested = (mIdx, wIdx, lIdx, field, val) => {
    const newModules = [...courseData.modules];
    if (lIdx !== null) newModules[mIdx].weeks[wIdx].lessons[lIdx][field] = val;
    else if (wIdx !== null) newModules[mIdx].weeks[wIdx][field] = val;
    else newModules[mIdx][field] = val;
    setCourseData({ ...courseData, modules: newModules });
  };

  const removeNested = (mIdx, wIdx, lIdx) => {
    const newModules = [...courseData.modules];
    if (lIdx !== null) newModules[mIdx].weeks[wIdx].lessons.splice(lIdx, 1);
    else if (wIdx !== null) newModules[mIdx].weeks.splice(wIdx, 1);
    else newModules.splice(mIdx, 1);
    setCourseData({ ...courseData, modules: newModules });
  };

  // --- QUICK SAVE MODULE LOGIC ---
  const handleQuickSaveModule = async (mIdx) => {
    const moduleToSave = courseData.modules[mIdx];
    if (!slug) return alert("Pehle basic course info (Step 1) save karein.");

    setLoading(true);
    try {
      // Partial update to specific course via PATCH
      await API.patch(`courses/${slug}/`, {
        modules: [moduleToSave] 
      });
      alert(`Module "${moduleToSave.title}" saved successfully! ✅`);
    } catch (err) {
      console.error("Quick Save Error:", err);
      alert("Failed to save module.");
    } finally {
      setLoading(false);
    }
  };

  // --- FULL DEPLOYMENT ---
  const handleDeployCourse = async () => {
    if (!courseData.title || !courseData.description) return alert("Title and Description are required.");
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', courseData.title);
      formData.append('category', courseData.category);
      formData.append('price', courseData.price);
      formData.append('description', courseData.description);
      
      if (courseData.thumbnail instanceof File) {
        formData.append('thumbnail', courseData.thumbnail);
      }

      const modulesPayload = courseData.modules.map((mod, mIdx) => ({
        ...mod,
        weeks: mod.weeks.map((week, wIdx) => ({
          ...week,
          lessons: week.lessons.map((lesson, lIdx) => {
            const videoKey = `m${mIdx}-w${wIdx}-l${lIdx}-video`;
            return {
              ...lesson,
              temp_video_key: filesMap[videoKey] ? videoKey : null
            };
          })
        }))
      }));

      formData.append('modules', JSON.stringify(modulesPayload));
      Object.keys(filesMap).forEach(key => formData.append(key, filesMap[key]));

      if (isEditMode) {
        await API.put(`courses/${slug}/`, formData);
      } else {
        await API.post('courses/create-full-course/', formData);
      }

      alert("Course Deployed Successfully! 🚀");
      navigate('/instructor/workspace');
    } catch (err) {
      console.error("Deployment Error:", err);
      alert("Deployment Failed.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !courseData.title) return (
    <div className="h-screen flex items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32 font-bold italic text-slate-900">
      <header className="sticky top-0 z-40 bg-[#F8FAFC]/90 backdrop-blur-md border-b border-slate-200 px-8 py-6 flex justify-between items-center">
        <div>
           <p className="text-blue-600 text-[10px] uppercase tracking-[0.4em] mb-1">Instructor Studio</p>
           <h1 className="text-3xl font-black uppercase italic tracking-tighter">
             {isEditMode ? 'Update Mission' : 'New Deployment'}
           </h1>
        </div>
        <div className="flex gap-4">
           {step === 2 && (
             <button onClick={() => setStep(1)} className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs uppercase hover:bg-slate-50">
               <ArrowLeft size={14} className="inline mr-2"/> Info
             </button>
           )}
           <button 
             onClick={() => step === 1 ? setStep(2) : handleDeployCourse()}
             disabled={loading}
             className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg"
           >
             {loading ? <Loader2 className="animate-spin" /> : step === 1 ? 'Next Step' : 'Deploy Course'}
           </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto mt-12 px-6">
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in slide-in-from-bottom-4">
            <div className="lg:col-span-2 space-y-8">
              <div className="group">
                <label className="text-[10px] uppercase tracking-widest text-slate-400 mb-2 block">Operation Name</label>
                <input 
                  value={courseData.title}
                  onChange={(e) => setCourseData({...courseData, title: e.target.value})}
                  className="w-full text-4xl font-black italic bg-transparent border-b-2 border-slate-200 focus:border-blue-600 outline-none py-2"
                  placeholder="Course Title..."
                />
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                   <label className="text-[10px] uppercase tracking-widest text-slate-400 mb-2 block">Sector</label>
                   <select 
                      value={showCustomCategory ? "Other" : courseData.category}
                      onChange={(e) => e.target.value === "Other" ? setShowCustomCategory(true) : (setShowCustomCategory(false), setCourseData({...courseData, category: e.target.value}))}
                      className="w-full p-4 bg-white rounded-2xl border border-slate-200 font-bold text-sm"
                   >
                     <option value="Web Dev">Web Development</option>
                     <option value="AI & Robotics">AI & Robotics</option>
                     <option value="Military Tech">Military Tech</option>
                     <option value="Other">Custom...</option>
                   </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 mb-2 block">Access Cost</label>
                  <input type="number" value={courseData.price} onChange={(e) => setCourseData({...courseData, price: e.target.value})} className="w-full p-4 bg-white rounded-2xl border border-slate-200 font-bold text-sm" placeholder="0.00"/>
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-400 mb-2 block">Briefing</label>
                <textarea rows="6" value={courseData.description} onChange={(e) => setCourseData({...courseData, description: e.target.value})} className="w-full p-6 bg-white rounded-3xl border border-slate-200 text-sm resize-none" placeholder="Learning objectives..."/>
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest text-slate-400 block">Visual Asset</label>
              <label className="block w-full aspect-[4/3] rounded-[2.5rem] border-2 border-dashed border-slate-300 hover:border-blue-500 cursor-pointer overflow-hidden relative bg-white">
                <input type="file" className="hidden" accept="image/*" onChange={handleThumbnailChange} />
                {courseData.thumbnailPreview ? <img src={courseData.thumbnailPreview} className="w-full h-full object-cover" /> : <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300"><Upload size={32} /></div>}
              </label>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-8 pb-20">
            {courseData.modules.map((module, mIdx) => (
              <div key={mIdx} className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-50 relative group">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-6 flex-1">
                    <div className="w-14 h-14 bg-slate-900 rounded-[1.2rem] flex items-center justify-center text-white text-xl font-black italic shadow-lg">{mIdx + 1}</div>
                    <div className="flex-1">
                      <label className="text-[10px] uppercase tracking-[0.3em] text-slate-400 block mb-1">Phase Identifier</label>
                      <input value={module.title} onChange={(e) => updateNested(mIdx, null, null, 'title', e.target.value)} className="w-full text-3xl font-black italic uppercase text-slate-800 bg-transparent outline-none border-b-2 border-transparent focus:border-blue-600" placeholder="MODULE TITLE"/>
                    </div>
                  </div>
                  <button onClick={() => handleQuickSaveModule(mIdx)} className="ml-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2"><Save size={14}/> Save Progress</button>
                  <button onClick={() => removeNested(mIdx, null, null)} className="ml-2 p-2 text-slate-300 hover:text-red-500"><Trash2 size={20} /></button>
                </div>

                <div className="pl-4 md:pl-20 space-y-10">
                  {module.weeks.map((week, wIdx) => (
                    <div key={wIdx} className="bg-slate-50/50 rounded-[2.5rem] p-8 border border-slate-100">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                           <Layers size={18} className="text-blue-500"/>
                           <input value={week.title} onChange={(e) => updateNested(mIdx, wIdx, null, 'title', e.target.value)} className="bg-transparent text-sm font-black uppercase text-slate-500 w-full" placeholder="WEEK LABEL"/>
                        </div>
                        <button onClick={() => removeNested(mIdx, wIdx, null)} className="text-slate-300 hover:text-red-500"><X size={16}/></button>
                      </div>

                      <div className="space-y-4">
                        {week.lessons.map((lesson, lIdx) => {
                          const videoKey = `m${mIdx}-w${wIdx}-l${lIdx}-video`;
                          return (
                            <div key={lIdx} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all">
                              <div className="flex flex-col gap-6">
                                <div className="flex gap-4 items-center">
                                    <div className={`p-3 rounded-xl ${lesson.content_type === 'Video' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                                      {lesson.content_type === 'Video' ? <Video size={18}/> : <FileText size={18}/>}
                                    </div>
                                    <input value={lesson.title} onChange={(e) => updateNested(mIdx, wIdx, lIdx, 'title', e.target.value)} className="flex-1 text-lg font-black italic text-slate-800 bg-transparent outline-none" placeholder="TOPIC HEADLINE"/>
                                    <select value={lesson.content_type} onChange={(e) => updateNested(mIdx, wIdx, lIdx, 'content_type', e.target.value)} className="text-[10px] font-black uppercase bg-slate-100 rounded-xl px-4 py-2 border-none cursor-pointer">
                                      <option value="Video">Video</option>
                                      <option value="Quiz">Quiz</option>
                                      <option value="Text">Text</option>
                                    </select>
                                    <button onClick={() => removeNested(mIdx, wIdx, lIdx)} className="text-slate-200 hover:text-red-500"><Trash2 size={16}/></button>
                                </div>
                                {lesson.content_type === 'Video' && (
                                  <div className="grid gap-4">
                                     <input placeholder="YouTube URL..." className="w-full text-xs p-4 rounded-2xl bg-slate-50 font-bold text-blue-600 outline-none" value={lesson.video_url || ''} onChange={(e) => updateNested(mIdx, wIdx, lIdx, 'video_url', e.target.value)}/>
                                     <div className="flex items-center gap-3">
                                       <label className="cursor-pointer bg-slate-900 text-white px-5 py-3 rounded-2xl text-[10px] uppercase font-black flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg shadow-slate-200">
                                          <Upload size={14} /> {filesMap[videoKey] ? 'Swap Asset' : 'Upload Local MP4'}
                                          <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileSelection(videoKey, e.target.files[0])} />
                                       </label>
                                       {filesMap[videoKey] && <span className="text-[10px] font-black uppercase text-blue-700">{filesMap[videoKey].name}</span>}
                                     </div>
                                  </div>
                                )}
                                {lesson.content_type === 'Text' && (
                                  <textarea rows="8" className="w-full p-6 bg-slate-900 text-blue-100 rounded-[2rem] font-mono text-sm border-l-8 border-blue-500 shadow-2xl outline-none" placeholder="// Write lesson notes..." value={lesson.text_content || ''} onChange={(e) => updateNested(mIdx, wIdx, lIdx, 'text_content', e.target.value)}/>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        <button onClick={() => addLesson(mIdx, wIdx)} className="w-full py-4 text-xs font-black uppercase text-blue-600 hover:bg-blue-600 hover:text-white rounded-[1.5rem] border-2 border-dashed border-blue-200 transition-all">+ New Topic Deployment</button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => addWeek(mIdx)} className="text-xs font-black uppercase text-slate-400 hover:text-slate-900 flex items-center gap-2"><Plus size={14}/> Expand Section</button>
                </div>
              </div>
            ))}
            <button onClick={addModule} className="w-full py-10 bg-white border-4 border-dashed border-slate-100 rounded-[3.5rem] text-slate-300 font-black uppercase hover:border-blue-100 hover:text-blue-400 transition-all flex flex-col items-center gap-4 group">
              <Layers size={32} className="group-hover:rotate-12 transition-transform"/><p>Initialize New Training Module</p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCourse;
