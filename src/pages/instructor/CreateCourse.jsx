import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API, { getMediaUrl } from '../../api/axios'; // Ensure this path is correct
import { 
  Plus, Save, Trash2, Video, FileText, HelpCircle, 
  Upload, ChevronDown, Layers, Edit3, ArrowRight, ArrowLeft, Loader2, X 
} from 'lucide-react';

const CreateCourse = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  
  // --- STATE ---
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  
  // Stores the structure (Text Data)
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

  // Stores Files separately: Key format "m{i}-w{j}-l{k}-video"
  const [filesMap, setFilesMap] = useState({});

  // --- INITIAL LOAD (EDIT MODE) ---
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
          populateCourseForEdit(res.data);
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

  const populateCourseForEdit = (course) => {
    setCourseData({
      title: course.title || '',
      category: course.category || 'Web Dev',
      price: course.price || '',
      description: course.description || '',
      thumbnail: null, // Keep null to not overwrite unless changed
      thumbnailPreview: getMediaUrl(course.thumbnail),
      modules: course.modules || []
    });
  };

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

  // --- SUBMISSION LOGIC (The Complex Part) ---
  const handleDeployCourse = async () => {
    if (!courseData.title || !courseData.description) return alert("Title and Description are required.");
    
    setLoading(true);
    try {
      const formData = new FormData();

      // 1. Basic Info
      formData.append('title', courseData.title);
      formData.append('category', courseData.category);
      formData.append('price', courseData.price);
      formData.append('description', courseData.description);
      if (courseData.thumbnail instanceof File) {
        formData.append('thumbnail', courseData.thumbnail);
      }

      // 2. Prepare Modules JSON with references to files
      // We iterate through data and inject "file_keys" so backend knows where to look
      const modulesPayload = courseData.modules.map((mod, mIdx) => ({
        ...mod,
        weeks: mod.weeks.map((week, wIdx) => ({
          ...week,
          lessons: week.lessons.map((lesson, lIdx) => {
            // Check if we have pending files for this lesson
            const videoKey = `m${mIdx}-w${wIdx}-l${lIdx}-video`;
            const docKey = `m${mIdx}-w${wIdx}-l${lIdx}-doc`;
            
            return {
              ...lesson,
              // Send these keys in JSON so backend can match with request.FILES
              temp_video_key: filesMap[videoKey] ? videoKey : null, 
              temp_doc_key: filesMap[docKey] ? docKey : null
            };
          })
        }))
      }));

      formData.append('modules', JSON.stringify(modulesPayload));

      // 3. Append Actual Files to FormData
      Object.keys(filesMap).forEach(key => {
        formData.append(key, filesMap[key]);
      });

      // 4. Send Request
      if (isEditMode) {
        // Edit logic usually requires different handling for nested files
        // For now, let's assume we use the same endpoint or a specific PUT
        await API.put(`courses/${slug}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await API.post('courses/create-full-course/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      alert("Course Deployed Successfully! 🚀");
      navigate('/instructor/workspace'); // Adjust path to your routes

    } catch (err) {
      console.error("Deployment Error:", err);
      alert(err.response?.data?.error || "Deployment Failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  // --- NESTED CRUD ---
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
    order: currentLessons.length + 1 // Ensure this is always present
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

  // --- RENDER ---
  if (loading && !courseData.title) return (
    <div className="h-screen flex items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32 font-bold italic text-slate-900">
      
      {/* HEADER */}
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
             className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-200"
           >
             {loading ? <Loader2 className="animate-spin" /> : step === 1 ? 'Next Step' : 'Deploy Course'}
           </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto mt-12 px-6">
        
        {/* STEP 1: GENERAL INFORMATION */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in slide-in-from-bottom-4">
            <div className="lg:col-span-2 space-y-8">
              
              <div className="group">
                <label className="text-[10px] uppercase tracking-widest text-slate-400 mb-2 block">Operation Name</label>
                <input 
                  value={courseData.title}
                  onChange={(e) => setCourseData({...courseData, title: e.target.value})}
                  className="w-full text-4xl font-black italic bg-transparent border-b-2 border-slate-200 focus:border-blue-600 outline-none py-2 placeholder:text-slate-300 transition-colors"
                  placeholder="Course Title..."
                />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                   <label className="text-[10px] uppercase tracking-widest text-slate-400 mb-2 block">Sector</label>
                   <select 
                      value={showCustomCategory ? "Other" : courseData.category}
                      onChange={(e) => {
                        const val = e.target.value;
                        if(val === "Other") setShowCustomCategory(true);
                        else { setShowCustomCategory(false); setCourseData({...courseData, category: val}); }
                      }}
                      className="w-full p-4 bg-white rounded-2xl border border-slate-200 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-100"
                   >
                     <option value="Web Dev">Web Development</option>
                     <option value="AI & Robotics">AI & Robotics</option>
                     <option value="Military Tech">Military Tech</option>
                     <option value="Other">Custom...</option>
                   </select>
                   {showCustomCategory && (
                     <input 
                       className="mt-2 w-full p-4 bg-blue-50 rounded-2xl text-xs font-bold text-blue-900 outline-none"
                       placeholder="Enter Category Name"
                       onChange={(e) => setCourseData({...courseData, category: e.target.value})}
                     />
                   )}
                </div>
                
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 mb-2 block">Access Cost</label>
                  <input 
                    type="number"
                    value={courseData.price}
                    onChange={(e) => setCourseData({...courseData, price: e.target.value})}
                    className="w-full p-4 bg-white rounded-2xl border border-slate-200 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-400 mb-2 block">Mission Briefing</label>
                <textarea 
                  rows="6"
                  value={courseData.description}
                  onChange={(e) => setCourseData({...courseData, description: e.target.value})}
                  className="w-full p-6 bg-white rounded-3xl border border-slate-200 font-medium text-slate-600 text-sm outline-none focus:ring-2 focus:ring-blue-100 resize-none"
                  placeholder="Describe the learning objectives..."
                />
              </div>

            </div>

            {/* Thumbnail Upload */}
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest text-slate-400 block">Visual Asset</label>
              <label className="block w-full aspect-[4/3] rounded-[2.5rem] border-2 border-dashed border-slate-300 hover:border-blue-500 cursor-pointer overflow-hidden relative group transition-colors bg-white">
                <input type="file" className="hidden" accept="image/*" onChange={handleThumbnailChange} />
                {courseData.thumbnailPreview ? (
                  <img src={courseData.thumbnailPreview} className="w-full h-full object-cover" alt="Thumb" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 group-hover:text-blue-500">
                    <Upload size={32} className="mb-2" />
                    <span className="text-[10px] uppercase font-black">Upload Thumbnail</span>
                  </div>
                )}
              </label>
            </div>
          </div>
        )}

        {/* STEP 2: CURRICULUM BUILDER */}
{step === 2 && (
  <div className="space-y-12 animate-in fade-in slide-in-from-right-8 pb-20">
    {courseData.modules.map((module, mIdx) => (
      <div key={mIdx} className="bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-100 border border-slate-50 relative group">
        
        {/* Module Delete */}
        <button onClick={() => removeNested(mIdx, null, null)} className="absolute top-10 right-10 text-slate-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-xl">
          <Trash2 size={20} />
        </button>

        {/* Module Header */}
        <div className="flex items-center gap-6 mb-10">
          <div className="w-14 h-14 bg-slate-900 rounded-[1.2rem] flex items-center justify-center text-white text-xl font-black italic shadow-lg shadow-slate-200">
            {mIdx + 1}
          </div>
          <div className="flex-1">
            <label className="text-[10px] uppercase tracking-[0.3em] text-slate-400 block mb-1">Phase Identifier</label>
            <input 
              value={module.title}
              onChange={(e) => updateNested(mIdx, null, null, 'title', e.target.value)}
              className="w-full text-3xl font-black italic uppercase text-slate-800 bg-transparent outline-none placeholder:text-slate-200 border-b-2 border-transparent focus:border-blue-600 transition-all"
              placeholder="e.g., FOUNDATION ELEMENTS"
            />
          </div>
        </div>

        {/* Weeks / Sections */}
        <div className="pl-4 md:pl-20 space-y-10">
          {module.weeks.map((week, wIdx) => (
            <div key={wIdx} className="bg-slate-50/50 rounded-[2.5rem] p-8 border border-slate-100 relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                   <Layers size={18} className="text-blue-500"/>
                   <input 
                    value={week.title}
                    onChange={(e) => updateNested(mIdx, wIdx, null, 'title', e.target.value)}
                    className="bg-transparent text-sm font-black uppercase text-slate-500 outline-none w-full tracking-widest"
                    placeholder="Week / Section Label"
                  />
                </div>
                <button onClick={() => removeNested(mIdx, wIdx, null)} className="text-slate-300 hover:text-red-500 p-2"><X size={16}/></button>
              </div>

              {/* Lessons List */}
              <div className="space-y-4">
                {week.lessons.map((lesson, lIdx) => {
                  const videoKey = `m${mIdx}-w${wIdx}-l${lIdx}-video`;
                  return (
                    <div key={lIdx} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group/lesson">
                      <div className="flex flex-col gap-6">
                        
                        {/* Lesson Header Controls */}
                        <div className="flex gap-4 items-center">
                            <div className={`p-3 rounded-xl shadow-inner ${
                              lesson.content_type === 'Video' ? 'bg-blue-100 text-blue-600' : 
                              lesson.content_type === 'Quiz' ? 'bg-orange-100 text-orange-600' : 
                              'bg-purple-100 text-purple-600'
                            }`}>
                              {lesson.content_type === 'Video' ? <Video size={18}/> : 
                               lesson.content_type === 'Quiz' ? <HelpCircle size={18}/> : <FileText size={18}/>}
                            </div>
                            <input 
                              value={lesson.title}
                              onChange={(e) => updateNested(mIdx, wIdx, lIdx, 'title', e.target.value)}
                              className="flex-1 text-lg font-black italic text-slate-800 bg-transparent outline-none placeholder:text-slate-300" 
                              placeholder="Topic Headline..."
                            />
                            <select 
                              value={lesson.content_type}
                              onChange={(e) => updateNested(mIdx, wIdx, lIdx, 'content_type', e.target.value)}
                              className="text-[10px] font-black uppercase bg-slate-100 rounded-xl px-4 py-2 outline-none border-none cursor-pointer hover:bg-slate-200 transition-colors"
                            >
                              <option value="Video">Video</option>
                              <option value="Quiz">Quiz</option>
                              <option value="Text">Text</option>
                            </select>
                            <button onClick={() => removeNested(mIdx, wIdx, lIdx)} className="text-slate-200 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                        </div>

                        {/* --- CONDITIONAL CONTENT FIELDS --- */}
                        
                        {/* 1. VIDEO CONTENT */}
                        {lesson.content_type === 'Video' && (
                          <div className="grid gap-4 animate-in zoom-in-95 duration-300">
                             <div className="relative">
                               <input 
                                 placeholder="Paste YouTube/Vimeo Secure URL..." 
                                 className="w-full text-xs p-4 pl-10 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-blue-600 outline-none focus:ring-2 focus:ring-blue-100"
                                 value={lesson.video_url || ''}
                                 onChange={(e) => updateNested(mIdx, wIdx, lIdx, 'video_url', e.target.value)}
                               />
                               <Video size={14} className="absolute left-4 top-4 text-slate-400"/>
                             </div>
                             
                             <div className="flex items-center gap-3">
                               <label className="cursor-pointer bg-slate-900 text-white px-5 py-3 rounded-2xl text-[10px] uppercase font-black flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg shadow-slate-200">
                                  <Upload size={14} /> {filesMap[videoKey] ? 'Swap Asset' : 'Upload Local MP4'}
                                  <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileSelection(videoKey, e.target.files[0])} />
                               </label>
                               {filesMap[videoKey] && (
                                  <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-[10px] font-black uppercase">
                                    <span className="truncate max-w-[200px]">{filesMap[videoKey].name}</span>
                                    <button onClick={() => removeFileSelection(videoKey)} className="hover:text-red-500"><X size={14} /></button>
                                  </div>
                               )}
                             </div>
                          </div>
                        )}

                        {/* 2. TEXT CONTENT (Premium Look) */}
                        {lesson.content_type === 'Text' && (
                          <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                            <label className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">Rich Document Content</label>
                            <textarea 
                              rows="8"
                              className="w-full p-6 bg-slate-900 text-blue-100 rounded-[2rem] font-mono text-sm border-l-8 border-blue-500 shadow-2xl focus:ring-4 focus:ring-blue-500/10 outline-none placeholder:text-slate-600"
                              placeholder="// Write your technical documentation or lesson notes here..."
                              value={lesson.text_content || ''}
                              onChange={(e) => updateNested(mIdx, wIdx, lIdx, 'text_content', e.target.value)}
                            />
                            <input 
                               placeholder="External Resource Link (PDF/GitHub)..." 
                               className="w-full p-4 bg-white border border-slate-100 rounded-xl text-xs font-bold italic text-blue-500"
                               value={lesson.resource_link || ''}
                               onChange={(e) => updateNested(mIdx, wIdx, lIdx, 'resource_link', e.target.value)}
                             />
                          </div>
                        )}

                        {/* 3. QUIZ PLACEHOLDER / METRICS */}
                        {lesson.content_type === 'Quiz' && (
                          <div className="p-6 bg-orange-50/50 rounded-2xl border border-orange-100 grid grid-cols-2 gap-4 animate-in fade-in">
                             <div>
                               <label className="text-[10px] uppercase font-black text-orange-400 mb-1 block">Question Count</label>
                               <input 
                                 type="number" 
                                 className="w-full p-3 rounded-xl border-none font-black text-orange-600"
                                 placeholder="e.g. 10"
                                 value={lesson.total_questions || ''}
                                 onChange={(e) => updateNested(mIdx, wIdx, lIdx, 'total_questions', e.target.value)}
                               />
                             </div>
                             <div>
                               <label className="text-[10px] uppercase font-black text-orange-400 mb-1 block">Pass Score %</label>
                               <input 
                                 type="number" 
                                 className="w-full p-3 rounded-xl border-none font-black text-orange-600"
                                 placeholder="80"
                                 value={lesson.passing_score || ''}
                                 onChange={(e) => updateNested(mIdx, wIdx, lIdx, 'passing_score', e.target.value)}
                               />
                             </div>
                             <p className="col-span-2 text-[10px] font-bold italic text-orange-400">
                               *Note: Questions will be configured in the Quiz Manager after deployment.
                             </p>
                          </div>
                        )}

                      </div>
                    </div>
                  );
                })}

                {/* Add Lesson Button */}
                <button 
                  onClick={() => addLesson(mIdx, wIdx)} 
                  className="w-full py-4 text-xs font-black uppercase tracking-widest text-blue-600 hover:text-white hover:bg-blue-600 rounded-[1.5rem] border-2 border-dashed border-blue-200 hover:border-blue-600 transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={16}/> New Topic Deployment
                </button>
              </div>
            </div>
          ))}
          
          {/* Add Week Button */}
          <button 
            onClick={() => addWeek(mIdx)} 
            className="group flex items-center gap-3 text-xs font-black uppercase text-slate-400 hover:text-slate-900 transition-colors"
          >
            <div className="size-8 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:border-slate-900">
              <Plus size={14}/>
            </div>
            Expand Strategic Week Section
          </button>
        </div>
      </div>
    ))}
    
    {/* Add Module Button */}
    <button 
      onClick={addModule} 
      className="w-full py-10 bg-white border-4 border-dashed border-slate-100 rounded-[3.5rem] text-slate-300 font-black uppercase tracking-[0.5em] hover:border-blue-100 hover:text-blue-400 transition-all flex flex-col items-center gap-4 group"
    >
      <div className="size-16 rounded-3xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
        <Layers size={32} className="group-hover:rotate-12 transition-transform"/>
      </div>
      Initialize New Training Module
    </button>
  </div>
)}

      </div>
    </div>
  );
};

export default CreateCourse;
