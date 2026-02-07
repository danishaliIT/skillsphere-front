import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Calendar, Link as LinkIcon, 
  Clock, User, CheckCircle, Loader2, Plus 
} from 'lucide-react';
import API from '../../api/axios'; // Make sure path is correct
import { toast } from 'react-hot-toast'; // Optional: for notifications

const CreateTraining = () => {
  const [loading, setLoading] = useState(false);
  const [trainings, setTrainings] = useState([]);
  
  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    program_name: '',
    description: '',
    category: 'technical', // Default from models.py choices
    live_link: '',
    scheduled_date: '',
    duration_hours: 2,
    instructor_name: '',
    max_participants: 50
  });

  // --- FETCH EXISTING TRAININGS ---
  const fetchTrainings = async () => {
    try {
      // Backend URL: /api/trainings/programs/ (Adjust based on your project urls)
      const res = await API.get('/trainings/programs/');
      setTrainings(res.data);
    } catch (err) {
      console.error("Error fetching trainings", err);
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  // --- HANDLE INPUT CHANGE ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- SUBMIT FORM ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/trainings/programs/', formData);
      toast.success("Training Deployed Successfully!");
      
      // Reset Form
      setFormData({
        program_name: '', description: '', category: 'technical',
        live_link: '', scheduled_date: '', duration_hours: 2,
        instructor_name: '', max_participants: 50
      });
      
      // Refresh List
      fetchTrainings();
      
    } catch (err) {
      console.error(err);
      toast.error("Failed to deploy training.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* --- HEADER --- */}
      <div>
        <h1 className="text-4xl font-black text-slate-900 italic uppercase tracking-tighter">
          Training Deployment
        </h1>
        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-2">
          Launch new skill modules for your team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT: CREATE FORM (2/3 Width) --- */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Briefcase size={100} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              
              {/* Program Name */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-2">Program Title</label>
                <input 
                  type="text" 
                  name="program_name"
                  value={formData.program_name}
                  onChange={handleChange}
                  placeholder="e.g., Advanced React Patterns" 
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-300 transition-all"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-2">Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="What will employees learn?" 
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  required
                />
              </div>

              {/* Grid: Category & Instructor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-500 mb-2">Category</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                  >
                    <option value="technical">Technical Skill</option>
                    <option value="soft_skills">Soft Skills</option>
                    <option value="management">Management</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-500 mb-2">Instructor Name</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-3.5 text-slate-400"/>
                    <input 
                      type="text" 
                      name="instructor_name"
                      value={formData.instructor_name}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-4 py-3 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                </div>
              </div>

              {/* Grid: Date, Time, Link */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-500 mb-2">Schedule Date</label>
                  <div className="relative">
                    <Calendar size={18} className="absolute left-3 top-3.5 text-slate-400"/>
                    <input 
                      type="datetime-local" 
                      name="scheduled_date"
                      value={formData.scheduled_date}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-4 py-3 font-bold text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-500 mb-2">Duration (Hrs)</label>
                  <div className="relative">
                    <Clock size={18} className="absolute left-3 top-3.5 text-slate-400"/>
                    <input 
                      type="number" 
                      name="duration_hours"
                      value={formData.duration_hours}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-4 py-3 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-500 mb-2">Meeting Link</label>
                  <div className="relative">
                    <LinkIcon size={18} className="absolute left-3 top-3.5 text-slate-400"/>
                    <input 
                      type="url" 
                      name="live_link"
                      value={formData.live_link}
                      onChange={handleChange}
                      placeholder="https://zoom.us/..."
                      className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-4 py-3 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Plus size={20} />}
                  Deploy Training Program
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* --- RIGHT: RECENT LIST (1/3 Width) --- */}
        <div className="space-y-6">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xl font-black italic uppercase text-slate-800">Active Deployments</h3>
            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-md text-[10px] font-black">{trainings.length} Total</span>
          </div>

          <div className="space-y-4 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {trainings.length > 0 ? (
              trainings.map((train) => (
                <div key={train.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[9px] px-2 py-1 rounded-full font-black uppercase tracking-wider ${
                      train.category === 'technical' ? 'bg-purple-100 text-purple-600' : 
                      train.category === 'management' ? 'bg-orange-100 text-orange-600' : 
                      'bg-green-100 text-green-600'
                    }`}>
                      {train.category.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {new Date(train.scheduled_date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h4 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-blue-600 transition-colors">
                    {train.program_name}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                    {train.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <User size={14} className="text-blue-500"/>
                      {train.instructor_name || 'TBA'}
                    </div>
                    {train.live_link && (
                      <a href={train.live_link} target="_blank" rel="noreferrer" className="size-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                        <LinkIcon size={14}/>
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 opacity-50">
                 <Briefcase size={40} className="mx-auto mb-2 text-slate-300"/>
                 <p className="text-xs font-bold uppercase text-slate-400">No active trainings</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreateTraining;