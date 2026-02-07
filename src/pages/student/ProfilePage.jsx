import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API, { getMediaUrl } from '../../api/axios';
import { 
  User, MapPin, Globe, Github, Linkedin, Twitter,
  Save, CheckCircle, Camera, Loader2, Plus, Trash2, 
  GraduationCap, Calendar, Hash, AlertTriangle
} from 'lucide-react';
import ProfileCompletionTracker from '../../components/ProfileCompletionTracker';
import Toast from '../../components/Toast';


const ProfilePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); 
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null); 

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    profile_picture: null, 
    phone_number: '',
    experience: '',
    public_profile: false,
    address: { street_address: '', city: '', state: '', country: 'Pakistan', zip_code: '' },
    socials: { linkedin: '', github: '', portfolio: '', twitter: '' },
    education_history: []
  });

  const getImageUrl = (path) => getMediaUrl(path);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await API.get('profiles/me/'); 
        const data = res.data;
        
        setFormData(prev => ({
          ...prev,
          ...data,
          address: { ...prev.address, ...data.address },
          socials: { ...prev.socials, ...data.socials },
          education_history: data.education_history || []
        }));

        // Initial image load
        if (data.profile_picture) {
          setImagePreview(getImageUrl(data.profile_picture));
        }
      } catch (err) {
        if (err.response?.status === 401) navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    getProfile();
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profile_picture: file });
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  const handleNestedChange = (category, field, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: { ...prev[category], [field]: value }
    }));
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEdu = [...formData.education_history];
    updatedEdu[index] = { ...updatedEdu[index], [field]: value };
    setFormData(prev => ({ ...prev, education_history: updatedEdu }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education_history: [...prev.education_history, { 
        institution: '', degree: '', start_date: '', end_date: '', grade_or_score: '' 
      }]
    }));
  };

  const removeEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education_history: prev.education_history.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    // FormData logic for file upload
    const data = new FormData();
    data.append('first_name', formData.first_name);
    data.append('last_name', formData.last_name);
    data.append('bio', formData.bio);
    
    if (formData.profile_picture instanceof File) {
      data.append('profile_picture', formData.profile_picture);
    }

    data.append('address', JSON.stringify(formData.address));
    data.append('socials', JSON.stringify(formData.socials));
    data.append('education_history', JSON.stringify(formData.education_history));
    data.append('phone_number', formData.phone_number || '');
    data.append('experience', formData.experience || '');
    data.append('public_profile', formData.public_profile ? 'true' : 'false');

    try {
      const res = await API.patch('profiles/me/', data, {
        headers: { 'Content-Type': 'multipart/form-data' } 
      });
      
      const updatedData = res.data;
      setFormData(prev => ({
        ...prev,
        ...updatedData,
        address: { ...prev.address, ...updatedData.address },
        socials: { ...prev.socials, ...updatedData.socials },
        education_history: updatedData.education_history || prev.education_history
      }));

      // Update preview with new server path
      if (updatedData.profile_picture) {
        setImagePreview(getImageUrl(updatedData.profile_picture));
      }

      setSuccess(true);
      setToastOpen(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Update failed:", err.response?.data);
      alert("Update Failed! Check file size or network.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <Loader2 className="animate-spin text-blue-600" size={60} />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <header className="border-b border-gray-100 pb-8">
        <h1 className="text-6xl font-black text-gray-900 italic uppercase tracking-tighter">Profile Terminal</h1>
        <p className="text-gray-400 font-bold mt-2 uppercase tracking-widest text-[10px]">DragonTech Pro ID: {formData.first_name}</p>

        {/* Profile Completion Tracker */}
        <div className="mt-4">
          <ProfileCompletionTracker data={formData} />
        </div>
        {/* Visible summary: username, phone, public URL */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow flex flex-col">
            <div className="text-xs text-gray-400 uppercase font-black">Username</div>
            <div className="font-bold text-lg">{formData.username || '—'}</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow flex flex-col">
            <div className="text-xs text-gray-400 uppercase font-black">Phone</div>
            <div className="font-bold text-lg">{formData.phone_number || 'Not set'}</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow flex flex-col">
            <div className="text-xs text-gray-400 uppercase font-black">Public Profile</div>
            {formData.public_profile ? (
              <a className="text-blue-600 font-bold" href={`/u/${formData.username}`}>{`/u/${formData.username}`}</a>
            ) : (
              <div className="text-sm text-gray-400">Private</div>
            )}
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* --- LEFT: PHOTO & SOCIALS --- */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-8 rounded-[3.5rem] border border-gray-100 shadow-xl text-center">
            <div className="relative group size-48 mx-auto mb-6">
              <img 
                src={imagePreview || `https://ui-avatars.com/api/?name=${formData.first_name}+${formData.last_name}&background=0D8ABC&color=fff`} 
                className="w-full h-full object-cover rounded-[3rem] border-4 border-white shadow-lg"
                alt="Profile"
              />
              <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
              <button 
                type="button" 
                onClick={() => fileInputRef.current.click()} 
                className="absolute -bottom-2 -right-2 p-4 bg-blue-600 text-white rounded-2xl shadow-xl hover:bg-gray-900 transition-all"
              >
                <Camera size={20} />
              </button>
            </div>
            <h3 className="text-2xl font-black italic text-gray-900 tracking-tight">{formData.first_name || 'Danish'}</h3>
          </div>

          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl space-y-4">
            <h4 className="text-[10px] font-black uppercase text-gray-400 italic mb-4 tracking-widest">Digital Footprint</h4>
            <div className="relative">
              <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
              <input 
                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none font-bold italic text-xs border-2 border-blue-50 focus:border-blue-400 transition"
                placeholder="LinkedIn URL"
                value={formData.socials?.linkedin || ''}
                onChange={(e) => handleNestedChange('socials', 'linkedin', e.target.value)}
              />
            </div>
            <div className="relative">
              <Github className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
              <input 
                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none font-bold italic text-xs border-2 border-blue-50 focus:border-blue-400 transition"
                placeholder="GitHub URL"
                value={formData.socials?.github || ''}
                onChange={(e) => handleNestedChange('socials', 'github', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* --- RIGHT: RECORDS & ADDRESS --- */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-10 rounded-[4rem] border border-gray-100 shadow-xl space-y-10">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-400 uppercase ml-2 tracking-widest">First Name</label>
                <input className="w-full px-8 py-5 bg-gray-50 rounded-[1.5rem] outline-none font-bold italic border-2 border-blue-50 focus:border-blue-400 transition" value={formData.first_name || ''} onChange={(e) => setFormData({...formData, first_name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-400 uppercase ml-2 tracking-widest">Last Name</label>
                <input className="w-full px-8 py-5 bg-gray-50 rounded-[1.5rem] outline-none font-bold italic border-2 border-blue-50 focus:border-blue-400 transition" value={formData.last_name || ''} onChange={(e) => setFormData({...formData, last_name: e.target.value})} />
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-gray-50">
              <label className="text-[10px] font-black uppercase text-gray-400 italic tracking-widest">Phone Number</label>
              <input placeholder="e.g. +92 300 0000000" className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none font-bold italic border-none" value={formData.phone_number || ''} onChange={(e) => setFormData({...formData, phone_number: e.target.value})} />
            </div>

            <div className="space-y-6 pt-6 border-t border-gray-50">
              <label className="text-[10px] font-black uppercase text-gray-400 italic tracking-widest">Experience / Bio</label>
              <textarea placeholder="Short bio or experience summary" className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none font-bold italic border-none" value={formData.experience || formData.bio || ''} onChange={(e) => setFormData({...formData, experience: e.target.value})} rows={4} />
            </div>

            <div className="flex items-center gap-4 pt-4">
              <input type="checkbox" id="public_profile" checked={!!formData.public_profile} onChange={(e) => setFormData({...formData, public_profile: e.target.checked})} />
              <label htmlFor="public_profile" className="text-sm font-bold">Make my profile public (viewable by username)</label>
            </div>

            <div className="space-y-6 pt-6">
              <h4 className="text-[10px] font-black uppercase text-gray-400 italic tracking-widest flex items-center gap-2"><MapPin size={16}/> Geographic Location</h4>
              <div className="p-4 rounded-2xl border-2 border-blue-100 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <input placeholder="City" className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none font-bold italic border-2 border-blue-200 focus:border-blue-500 transition" value={formData.address?.city || ''} onChange={(e) => handleNestedChange('address', 'city', e.target.value)} />
                  <input placeholder="State" className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none font-bold italic border-2 border-blue-200 focus:border-blue-500 transition" value={formData.address?.state || ''} onChange={(e) => handleNestedChange('address', 'state', e.target.value)} />
                  <input placeholder="Zip Code" className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none font-bold italic border-2 border-blue-200 focus:border-blue-500 transition" value={formData.address?.zip_code || ''} onChange={(e) => handleNestedChange('address', 'zip_code', e.target.value)} />
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-gray-50">
              <div className="flex justify-between items-center px-2">
                <h4 className="text-[10px] font-black uppercase text-gray-400 italic tracking-widest flex items-center gap-2"><GraduationCap size={16}/> Educational Timeline</h4>
                <button type="button" onClick={addEducation} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Plus size={18} /></button>
              </div>

              {formData.education_history?.map((edu, index) => (
                <div key={index} className="p-8 bg-gray-50/50 rounded-[3rem] space-y-6 relative border border-gray-100 group">
                  <button type="button" onClick={() => removeEducation(index)} className="absolute top-6 right-6 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18} /></button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input placeholder="Institution (e.g. NADRA)" className="w-full px-6 py-4 bg-white rounded-2xl outline-none font-bold italic text-sm border-none shadow-sm" value={edu.institution || ''} onChange={(e) => handleEducationChange(index, 'institution', e.target.value)} />
                    <input placeholder="Degree" className="w-full px-6 py-4 bg-white rounded-2xl outline-none font-bold italic text-sm border-none shadow-sm" value={edu.degree || ''} onChange={(e) => handleEducationChange(index, 'degree', e.target.value)} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <input type="date" className="w-full px-4 py-4 bg-white rounded-2xl outline-none font-bold italic text-xs border-none shadow-sm" value={edu.start_date || ''} onChange={(e) => handleEducationChange(index, 'start_date', e.target.value)} />
                    <input type="date" className="w-full px-4 py-4 bg-white rounded-2xl outline-none font-bold italic text-xs border-none shadow-sm" value={edu.end_date || ''} onChange={(e) => handleEducationChange(index, 'end_date', e.target.value)} />
                    <input placeholder="Score (e.g. 32.2/60)" className="w-full px-6 py-4 bg-white rounded-2xl outline-none font-bold italic text-sm border-none shadow-sm" value={edu.grade_or_score || ''} onChange={(e) => handleEducationChange(index, 'grade_or_score', e.target.value)} />
                  </div>
                </div>
              ))}
            </div>

            <button 
              type="submit"
              disabled={saving}
              className={`w-full py-6 rounded-[2rem] font-black uppercase italic tracking-widest transition-all shadow-2xl ${
                success ? 'bg-green-500 text-white shadow-green-200' : 'bg-gray-900 text-white hover:bg-blue-600'
              }`}
            >
              {saving ? 'Uploading Assets...' : success ? 'System Updated!' : 'Push Changes to Server'}
            </button>
          </div>
        </div>
      </form>
      <Toast show={toastOpen} message={"Profile updated successfully"} onClose={() => setToastOpen(false)} type="success" />
    </div>
  );
};

export default ProfilePage;