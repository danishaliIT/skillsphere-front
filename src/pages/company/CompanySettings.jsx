import React, { useState, useEffect } from 'react';
import { 
  Building2, Globe, FileText, Camera, 
  Save, Mail, Loader2, CheckCircle 
} from 'lucide-react';
import API from '../../api/axios'; // Ensure path is correct
import { toast } from 'react-hot-toast'; // Notification ke liye

const CompanySettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // --- STATE FOR PROFILE DATA ---
  const [profile, setProfile] = useState({
    company_name: '',
    website: '',
    industry: '',
    size: '',
    description: '',
    email: '', // Read-only from User model
    logo: null // For file upload
  });

  const [previewLogo, setPreviewLogo] = useState(null);

  // --- FETCH CURRENT PROFILE ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Backend URL: /api/profiles/me/ (Check urls.py)
        const res = await API.get('/profiles/me/');
        
        // Data populate karna
        setProfile({
          company_name: res.data.company_name || '',
          website: res.data.website || '',
          industry: res.data.industry || '',
          size: res.data.size || '',
          description: res.data.description || '',
          email: res.data.email || '', // Serializer mein email source='user.email' hai
        });

        // Agar purana logo hai toh dikhayein
        if (res.data.logo) {
          setPreviewLogo(res.data.logo);
        }

      } catch (err) {
        console.error("Failed to load profile", err);
        toast.error("Could not load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // --- HANDLE TEXT CHANGE ---
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // --- HANDLE LOGO UPLOAD ---
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, logo: file });
      setPreviewLogo(URL.createObjectURL(file)); // For immediate preview
    }
  };

  // --- SUBMIT / UPDATE PROFILE ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Multipart form data banana padega kyunki Image bhi hai
      const formData = new FormData();
      formData.append('company_name', profile.company_name);
      formData.append('website', profile.website);
      formData.append('industry', profile.industry);
      formData.append('size', profile.size);
      formData.append('description', profile.description);
      
      // Agar naya logo select kiya hai tabhi bhejein
      if (profile.logo instanceof File) {
        formData.append('logo', profile.logo);
      }

      // Backend Call: PATCH request to update
      await API.patch('/profiles/me/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // --- NOTIFICATION ---
      // User ki requirement: "Update profile par notification receive karna"
      toast.success("Company Profile Updated Successfully!", {
        icon: '🏢',
        duration: 4000,
        style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
        },
      });

    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="h-full flex items-center justify-center pt-20">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* --- HEADER --- */}
      <div>
        <h1 className="text-4xl font-black text-slate-900 italic uppercase tracking-tighter">
          HQ Settings
        </h1>
        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-2">
          Manage your corporate identity.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN: MAIN INFO (2/3) --- */}
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl">
                <h3 className="text-xl font-black italic uppercase text-slate-800 mb-6 flex items-center gap-2">
                    <Building2 className="text-blue-600" size={20}/> Company Details
                </h3>

                <div className="space-y-6">
                    {/* Name & Industry */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-black uppercase text-slate-400 mb-2">Company Name</label>
                            <input 
                                type="text" 
                                name="company_name"
                                value={profile.company_name}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase text-slate-400 mb-2">Industry Sector</label>
                            <input 
                                type="text" 
                                name="industry"
                                value={profile.industry}
                                onChange={handleChange}
                                placeholder="e.g. IT, Manufacturing..."
                                className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Website & Size */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-black uppercase text-slate-400 mb-2">Official Website</label>
                            <div className="relative">
                                <Globe size={18} className="absolute left-3 top-3.5 text-slate-400"/>
                                <input 
                                    type="url" 
                                    name="website"
                                    value={profile.website}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-4 py-3 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase text-slate-400 mb-2">Company Size</label>
                            <select 
                                name="size"
                                value={profile.size}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                            >
                                <option value="">Select Size</option>
                                <option value="1-10">1-10 Employees</option>
                                <option value="11-50">11-50 Employees</option>
                                <option value="51-200">51-200 Employees</option>
                                <option value="200+">200+ Employees</option>
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-black uppercase text-slate-400 mb-2">About Company</label>
                        <textarea 
                            name="description"
                            value={profile.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                        ></textarea>
                    </div>
                </div>
            </div>
        </div>

        {/* --- RIGHT COLUMN: LOGO & ACTIONS (1/3) --- */}
        <div className="space-y-8">
            
            {/* Logo Upload Card */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl flex flex-col items-center text-center">
                <div className="relative group cursor-pointer mb-4">
                    <div className="size-32 rounded-2xl bg-slate-100 overflow-hidden border-4 border-white shadow-lg flex items-center justify-center">
                        {previewLogo ? (
                            <img src={previewLogo} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                            <Building2 size={40} className="text-slate-300"/>
                        )}
                    </div>
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => document.getElementById('logoInput').click()}>
                        <Camera className="text-white" size={24}/>
                    </div>
                </div>
                
                <input 
                    type="file" 
                    id="logoInput" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleLogoChange} 
                />
                
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Upload Official Logo</p>
                <p className="text-[10px] text-slate-300 mt-1">PNG, JPG up to 5MB</p>
            </div>

            {/* Read Only Info */}
            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                <div className="flex items-center gap-3 mb-2">
                    <div className="size-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                        <Mail size={16}/>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase text-slate-400">Registered Email</p>
                        <p className="text-xs font-bold text-slate-900">{profile.email}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 mt-4 text-[10px] text-slate-400">
                    <CheckCircle size={12} className="text-green-500"/> Verified Account
                </div>
            </div>

            {/* Save Button */}
            <button 
                type="submit" 
                disabled={saving}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-[1.5rem] font-black uppercase italic tracking-widest shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
                {saving ? (
                    <><Loader2 className="animate-spin" size={20}/> Saving...</>
                ) : (
                    <><Save size={20}/> Update Profile</>
                )}
            </button>

        </div>
      </form>
    </div>
  );
};

export default CompanySettings;