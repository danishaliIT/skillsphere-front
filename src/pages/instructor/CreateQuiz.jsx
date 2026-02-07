import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, Plus, Trash2, CheckCircle, 
  ChevronDown, AlertCircle, Layers, FileText 
} from 'lucide-react';
import API from '../../api/axios';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);

  // --- SELECTION STATE ---
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const [selectedWeekId, setSelectedWeekId] = useState('');
  const [selectedLessonId, setSelectedLessonId] = useState('');

  // --- QUIZ DATA STATE ---
  const [quizSettings, setQuizSettings] = useState({
    total_marks: 100,
    passing_marks: 50,
  });

  const [questions, setQuestions] = useState([
    {
      text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_option: 'option_a'
    }
  ]);

  // --- FETCH COURSES ON MOUNT ---
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Hum "my-workspace" call kar rahe hain jo puri hierarchy return karta hai
        // (Modules -> Weeks -> Lessons) based on your serializers
        const res = await API.get('courses/my-workspace/');
        setCourses(res.data);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      }
    };
    fetchCourses();
  }, []);

  // --- HELPER: Get Current Selection Options ---
  const selectedCourse = courses.find(c => c.id === parseInt(selectedCourseId));
  const modules = selectedCourse?.modules || [];
  
  const selectedModule = modules.find(m => m.id === parseInt(selectedModuleId));
  const weeks = selectedModule?.weeks || [];

  const selectedWeek = weeks.find(w => w.id === parseInt(selectedWeekId));
  const lessons = selectedWeek?.lessons || [];

  // --- HANDLERS ---
  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions, 
      { text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'option_a' }
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length === 1) return;
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleSubmit = async () => {
    if (!selectedLessonId) return alert("Please select a lesson first.");
    
    setLoading(true);
    try {
      const payload = {
        lesson_id: selectedLessonId,
        total_marks: quizSettings.total_marks,
        passing_marks: quizSettings.passing_marks,
        questions: questions
      };

      // Backend endpoint adjust karein
      await API.post('instructor/quizzes/create/', payload);
      navigate('/instructor/quizzes');
    } catch (err) {
      console.error("Quiz creation failed", err);
      alert("Failed to create quiz. Ensure this lesson doesn't already have a quiz.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 font-bold italic pb-40">
      
      {/* HEADER */}
      <header className="border-b border-slate-100 pb-8">
        <p className="text-blue-600 text-[10px] uppercase tracking-[0.4em]">Instructor Panel</p>
        <h1 className="text-5xl font-black text-slate-900 uppercase italic tracking-tighter">Create New Quiz</h1>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        
        {/* --- LEFT COLUMN: CONTEXT SELECTION --- */}
        <div className="xl:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
                <h3 className="text-xl font-black uppercase italic text-slate-800 mb-6 flex items-center gap-2">
                    <Layers size={20} className="text-blue-600"/> Target Lesson
                </h3>

                <div className="space-y-4">
                    {/* Course Select */}
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-slate-400">Select Course</label>
                        <div className="relative">
                            <select 
                                className="w-full p-4 bg-slate-50 rounded-xl border-none outline-none appearance-none font-bold text-slate-700 text-sm"
                                value={selectedCourseId}
                                onChange={(e) => {
                                    setSelectedCourseId(e.target.value);
                                    setSelectedModuleId(''); 
                                    setSelectedWeekId(''); 
                                    setSelectedLessonId('');
                                }}
                            >
                                <option value="">-- Choose Course --</option>
                                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                            </select>
                            <ChevronDown className="absolute right-4 top-4 text-slate-400 pointer-events-none" size={16}/>
                        </div>
                    </div>

                    {/* Module Select */}
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-slate-400">Select Module</label>
                        <div className="relative">
                            <select 
                                className="w-full p-4 bg-slate-50 rounded-xl border-none outline-none appearance-none font-bold text-slate-700 text-sm disabled:opacity-50"
                                value={selectedModuleId}
                                onChange={(e) => {
                                    setSelectedModuleId(e.target.value);
                                    setSelectedWeekId('');
                                    setSelectedLessonId('');
                                }}
                                disabled={!selectedCourseId}
                            >
                                <option value="">-- Choose Module --</option>
                                {modules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                            </select>
                            <ChevronDown className="absolute right-4 top-4 text-slate-400 pointer-events-none" size={16}/>
                        </div>
                    </div>

                    {/* Week Select */}
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-slate-400">Select Week</label>
                        <div className="relative">
                            <select 
                                className="w-full p-4 bg-slate-50 rounded-xl border-none outline-none appearance-none font-bold text-slate-700 text-sm disabled:opacity-50"
                                value={selectedWeekId}
                                onChange={(e) => {
                                    setSelectedWeekId(e.target.value);
                                    setSelectedLessonId('');
                                }}
                                disabled={!selectedModuleId}
                            >
                                <option value="">-- Choose Week --</option>
                                {weeks.map(w => <option key={w.id} value={w.id}>{w.title}</option>)}
                            </select>
                            <ChevronDown className="absolute right-4 top-4 text-slate-400 pointer-events-none" size={16}/>
                        </div>
                    </div>

                    {/* Lesson Select */}
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-slate-400">Select Lesson</label>
                        <div className="relative">
                            <select 
                                className="w-full p-4 bg-blue-50 text-blue-800 rounded-xl border border-blue-100 outline-none appearance-none font-bold text-sm disabled:opacity-50"
                                value={selectedLessonId}
                                onChange={(e) => setSelectedLessonId(e.target.value)}
                                disabled={!selectedWeekId}
                            >
                                <option value="">-- Choose Lesson --</option>
                                {lessons.map(l => (
                                    <option key={l.id} value={l.id} disabled={!!l.quiz}>
                                        {l.title} {l.quiz ? '(Has Quiz)' : ''}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-4 text-blue-400 pointer-events-none" size={16}/>
                        </div>
                    </div>
                </div>

                {/* Settings */}
                <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
                    <h4 className="text-sm font-black uppercase text-slate-800">Settings</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] uppercase text-slate-400">Total Marks</label>
                            <input 
                                type="number" 
                                className="w-full p-3 bg-slate-50 rounded-lg font-bold text-slate-700 mt-1"
                                value={quizSettings.total_marks}
                                onChange={e => setQuizSettings({...quizSettings, total_marks: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase text-slate-400">Passing Marks</label>
                            <input 
                                type="number" 
                                className="w-full p-3 bg-slate-50 rounded-lg font-bold text-slate-700 mt-1"
                                value={quizSettings.passing_marks}
                                onChange={e => setQuizSettings({...quizSettings, passing_marks: e.target.value})}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- RIGHT COLUMN: QUESTIONS BUILDER --- */}
        <div className="xl:col-span-2 space-y-6">
            
            {questions.map((q, idx) => (
                <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg relative group">
                    <div className="absolute top-6 left-6 bg-slate-900 text-white w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs">
                        {idx + 1}
                    </div>
                    
                    <button 
                        onClick={() => removeQuestion(idx)}
                        className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                        <Trash2 size={18} />
                    </button>

                    <div className="pl-12 space-y-6">
                        {/* Question Text */}
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-slate-400">Question Text</label>
                            <input 
                                type="text" 
                                placeholder="e.g. What is the output of 2 + '2' in JavaScript?"
                                className="w-full p-4 bg-slate-50 rounded-xl border-none font-bold text-slate-800 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                                value={q.text}
                                onChange={(e) => handleQuestionChange(idx, 'text', e.target.value)}
                            />
                        </div>

                        {/* Options Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {['a', 'b', 'c', 'd'].map((opt) => (
                                <div key={opt} className={`relative p-1 rounded-xl transition-all ${q.correct_option === `option_${opt}` ? 'bg-green-100' : 'bg-transparent'}`}>
                                    <div className="relative">
                                        <div className="absolute left-3 top-3 text-[10px] font-black text-slate-400 uppercase">{opt}</div>
                                        <input 
                                            type="text"
                                            placeholder={`Option ${opt.toUpperCase()}`}
                                            className="w-full p-3 pl-8 bg-slate-50 rounded-lg font-medium text-sm outline-none border border-transparent focus:bg-white focus:border-slate-200"
                                            value={q[`option_${opt}`]}
                                            onChange={(e) => handleQuestionChange(idx, `option_${opt}`, e.target.value)}
                                        />
                                    </div>
                                    <button 
                                        onClick={() => handleQuestionChange(idx, 'correct_option', `option_${opt}`)}
                                        className={`absolute right-3 top-3 ${q.correct_option === `option_${opt}` ? 'text-green-600' : 'text-slate-200 hover:text-slate-400'}`}
                                        title="Mark as Correct Answer"
                                    >
                                        <CheckCircle size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}

            {/* ACTION BUTTONS */}
            <div className="flex gap-4 pt-4">
                <button 
                    onClick={addQuestion}
                    className="flex-1 py-4 border-2 border-dashed border-slate-300 rounded-[1.5rem] text-slate-400 font-bold uppercase hover:border-blue-500 hover:text-blue-500 transition-all flex items-center justify-center gap-2"
                >
                    <Plus size={20} /> Add Another Question
                </button>
                
                <button 
                    onClick={handleSubmit}
                    disabled={loading || !selectedLessonId}
                    className="flex-[2] py-4 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-blue-600 shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Publishing...' : <><Save size={20}/> Publish Quiz</>}
                </button>
            </div>

        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;