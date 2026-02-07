import { useState, useEffect } from 'react';
import API from '../api/axios';
import { X, User, Briefcase, Award, Globe, BookOpen } from 'lucide-react';

const EditProfileModal = ({ profile, role, isOpen, onClose, onRefresh }) => {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    // Profile prop change hone par state ko sync karein
    useEffect(() => {
        if (profile) {
            setFormData({
                first_name: profile.first_name || '',
                last_name: profile.last_name || '',
                bio: profile.bio || profile.description || '',
                education: profile.education || '',
                expertise: profile.expertise || '',
                experience_years: profile.experience_years || 0,
                company_name: profile.company_name || '',
                website_url: profile.website_url || '',
            });
        }
    }, [profile, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Check karein ke backend path 'profiles/me/' hai ya 'profile/me/'
            await API.patch('profiles/me/', formData);
            onRefresh(); 
            onClose();   
        } catch (err) {
            console.error("Update failed:", err.response?.data);
            alert("Update failed! Please check your fields.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-100">
                
                {/* Header */}
                <div className="flex justify-between items-center p-8 border-b border-gray-50">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 italic">Edit {role} Profile</h2>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Update your professional info</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-gray-50 rounded-2xl transition-all text-gray-400 hover:text-black">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    
                    {/* Common Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase ml-2">First Name</label>
                            <input name="first_name" value={formData.first_name} onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-600 font-bold" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Last Name</label>
                            <input name="last_name" value={formData.last_name} onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-600 font-bold" />
                        </div>
                    </div>

                    {/* Role-Specific Fields */}
                    {role === 'Student' && (
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 text-blue-600">Educational Qualification</label>
                            <div className="relative">
                                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input name="education" value={formData.education} onChange={handleChange} placeholder="e.g. BS Computer Science" className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-600 font-bold" />
                            </div>
                        </div>
                    )}

                    {role === 'Instructor' && (
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase ml-2 text-blue-600">Primary Expertise</label>
                                <div className="relative">
                                    <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input name="expertise" value={formData.expertise} onChange={handleChange} placeholder="e.g. Finance or Web Dev" className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-600 font-bold" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Years of Experience</label>
                                <input type="number" name="experience_years" value={formData.experience_years} onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-600 font-bold" />
                            </div>
                        </div>
                    )}

                    {role === 'Company' && (
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase ml-2 text-blue-600">Organization Name</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input name="company_name" value={formData.company_name} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-600 font-bold" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Official Website</label>
                                <div className="relative">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input name="website_url" value={formData.website_url} onChange={handleChange} placeholder="https://..." className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-600 font-bold" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Common Field: Bio */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Bio / Experience Description</label>
                        <textarea name="bio" rows="4" value={formData.bio} onChange={handleChange} placeholder="Tell us about yourself..." className="w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-600 font-medium text-sm leading-relaxed" />
                    </div>

                    <button 
                        type="submit"
                        disabled={loading} 
                        className="w-full py-5 bg-gray-900 text-white rounded-[1.5rem] font-black text-lg hover:bg-black transition-all shadow-xl shadow-gray-200 disabled:opacity-50 mt-4"
                    >
                        {loading ? "Saving Changes..." : "Update Profile"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;