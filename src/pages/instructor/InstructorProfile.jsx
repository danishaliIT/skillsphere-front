import React, { useState, useEffect } from 'react';
import { ProfilePictureUploader, FormInput, FormSelect, FormTextarea, Button, Alert, StatsCard } from '../../components/UIComponents';
import API, { getMediaUrl } from '../../api/axios';
import THEME from '../../styles/theme';
import { Save, AlertCircle, CheckCircle2, Loader2, User, Briefcase, Target, Award } from 'lucide-react';

const InstructorProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  
  const [profile, setProfile] = useState({
    full_name: '',
    expertise: '',
    experience_years: 0,
    bio: '',
    rating: 0,
    profile_picture: null
  });
  const [education, setEducation] = useState([]);
  const [employment, setEmployment] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [certificateFiles, setCertificateFiles] = useState({});

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('profiles/me/');
        const profileData = res.data.instructor_profile || res.data;
        setProfile(profileData);
        // populate nested lists if present
        setEducation(profileData.education || []);
        setEmployment(profileData.employment || []);
        setCertificates(profileData.certificates || []);
        setLoading(false);
      } catch (err) {
        console.error("Profile fetch failed:", err);
        setMessage('Failed to load profile');
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setProfilePicturePreview(URL.createObjectURL(file));
    }
  };

  const getInitials = () => {
    const name = profile.full_name || 'User';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getProfilePictureUrl = () => {
    if (profilePicturePreview) return profilePicturePreview;
    if (profile.profile_picture) {
      return getMediaUrl(profile.profile_picture);
    }
    return null;
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('full_name', profile.full_name);
      formData.append('expertise', profile.expertise);
      formData.append('experience_years', profile.experience_years);
      formData.append('bio', profile.bio);
      
      if (profilePicture) {
        formData.append('profile_picture', profilePicture);
      }
      // include nested lists as JSON strings for now
      formData.append('education', JSON.stringify(education || []));
      formData.append('employment', JSON.stringify(employment || []));
      formData.append('certificates', JSON.stringify(certificates.map(c => ({ id: c.id, title: c.title, issuer: c.issuer, issued_date: c.issued_date }))));
      // append certificate files if any
      Object.keys(certificateFiles).forEach((key) => {
        const f = certificateFiles[key];
        if (f) formData.append('certificate_files', f);
      });

      const res = await API.patch('profiles/me/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const updatedProfile = res.data.instructor_profile || res.data;
      setProfile(updatedProfile);
      setProfilePicture(null);
      setProfilePicturePreview(null);
      setMessage('Profile updated successfully! ✅');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error("Profile update failed:", err);
      setMessage(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // Per-item CRUD handlers
  const handleSaveEducation = async (idx) => {
    const item = education[idx];
    try {
      if (item.id) {
        const res = await API.patch(`profiles/instructor/education/${item.id}/`, item);
        setEducation(prev => prev.map((it,i) => i===idx ? res.data : it));
      } else {
        const res = await API.post('profiles/instructor/education/', item);
        setEducation(prev => prev.map((it,i) => i===idx ? res.data : it));
      }
      setMessage('Education saved');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      console.error('Save education failed', err);
      setMessage('Failed to save education');
    }
  };

  const handleDeleteEducation = async (idx) => {
    const item = education[idx];
    try {
      if (item.id) {
        await API.delete(`profiles/instructor/education/${item.id}/`);
      }
      setEducation(prev => prev.filter((_,i) => i!==idx));
      setMessage('Education removed');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      console.error('Delete education failed', err);
      setMessage('Failed to remove education');
    }
  };

  const handleSaveEmployment = async (idx) => {
    const item = employment[idx];
    try {
      if (item.id) {
        const res = await API.patch(`profiles/instructor/employment/${item.id}/`, item);
        setEmployment(prev => prev.map((it,i) => i===idx ? res.data : it));
      } else {
        const res = await API.post('profiles/instructor/employment/', item);
        setEmployment(prev => prev.map((it,i) => i===idx ? res.data : it));
      }
      setMessage('Employment saved');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      console.error('Save employment failed', err);
      setMessage('Failed to save employment');
    }
  };

  const handleDeleteEmployment = async (idx) => {
    const item = employment[idx];
    try {
      if (item.id) {
        await API.delete(`profiles/instructor/employment/${item.id}/`);
      }
      setEmployment(prev => prev.filter((_,i) => i!==idx));
      setMessage('Employment removed');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      console.error('Delete employment failed', err);
      setMessage('Failed to remove employment');
    }
  };

  const handleSaveCertificate = async (idx) => {
    const item = certificates[idx];
    const fd = new FormData();
    fd.append('title', item.title || '');
    fd.append('issuer', item.issuer || '');
    if (item.issued_date) fd.append('issued_date', item.issued_date);
    const f = certificateFiles[idx];
    if (f) fd.append('file', f);

    try {
      if (item.id) {
        const res = await API.patch(`profiles/instructor/certificates/${item.id}/`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        setCertificates(prev => prev.map((it,i) => i===idx ? res.data : it));
      } else {
        const res = await API.post('profiles/instructor/certificates/', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        setCertificates(prev => prev.map((it,i) => i===idx ? res.data : it));
      }
      setMessage('Certificate saved');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      console.error('Save certificate failed', err);
      setMessage('Failed to save certificate');
    }
  };

  const handleDeleteCertificate = async (idx) => {
    const item = certificates[idx];
    try {
      if (item.id) {
        await API.delete(`profiles/instructor/certificates/${item.id}/`);
      }
      setCertificates(prev => prev.filter((_,i) => i!==idx));
      setCertificateFiles(prev => { const copy = { ...prev }; delete copy[idx]; return copy; });
      setMessage('Certificate removed');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      console.error('Delete certificate failed', err);
      setMessage('Failed to remove certificate');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-32">
      <header className="border-b border-gray-100 pb-8 flex justify-between items-start">
        <div>
          <h1 className="text-5xl font-black text-gray-900 italic tracking-tighter">Instructor Profile</h1>
          <p className="text-gray-500 font-bold mt-2">Manage your professional profile and credentials</p>
        </div>
        <Button 
          onClick={handleSaveProfile}
          disabled={saving}
          variant="primary"
          size="lg"
        >
          {saving ? <><Loader2 className="animate-spin" size={18} /> Saving...</> : <><Save size={18} /> Save Changes</>}
        </Button>
      </header>

      {message && (
        <Alert 
          type={message.includes('✅') ? 'success' : 'error'}
          message={message}
          onClose={() => setMessage('')}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT SIDEBAR */}
        <div className="space-y-8">
          <ProfilePictureUploader
            currentImage={getProfilePictureUrl()}
            preview={profilePicturePreview}
            onFileChange={handleProfilePictureChange}
            size="xl"
            editable={true}
            fallbackInitials={getInitials()}
          />

          {/* Stats Grid */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Teaching Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Total Courses', value: '12', color: 'blue' },
                { label: 'Active Students', value: '842', color: 'green' },
                { label: 'Total Earnings', value: '$12.5K', color: 'purple' },
                { label: 'Course Rating', value: '4.8★', color: 'orange' },
              ].map((stat, idx) => (
                <StatsCard 
                  key={idx}
                  label={stat.label}
                  value={stat.value}
                  color={stat.color}
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-xl font-black italic text-gray-900 flex items-center gap-3">
              <User className="text-blue-600" size={24} />
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Full Name"
                name="full_name"
                value={profile.full_name}
                onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                placeholder="Enter your full name"
                required
              />
              <FormInput
                label="Years of Experience"
                name="experience_years"
                type="number"
                min="0"
                value={profile.experience_years}
                onChange={(e) => setProfile({...profile, experience_years: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>

          {/* Expertise & Skills */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-xl font-black italic text-gray-900 flex items-center gap-3">
              <Target className="text-blue-600" size={24} />
              Area of Expertise
            </h2>

            <FormSelect
              label="Select Your Expertise"
              name="expertise"
              value={profile.expertise}
              onChange={(e) => setProfile({...profile, expertise: e.target.value})}
              options={[
                { value: '', label: 'Select expertise...' },
                { value: 'Web Development', label: '💻 Web Development (MERN)' },
                { value: 'AI & Robotics', label: '🤖 AI & Robotics' },
                { value: 'Military Technology', label: '🔐 Military Technology' },
                { value: 'Finance', label: '💰 Finance & Business' },
                { value: 'Data Science', label: '📊 Data Science' },
                { value: 'Mobile Development', label: '📱 Mobile Development' },
                { value: 'Other', label: 'Other' },
              ]}
            />
          </div>

          {/* Education List Editor */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-xl font-black italic text-gray-900 flex items-center gap-3">
              <User className="text-blue-600" size={24} />
              Education
            </h2>
            <div className="space-y-4">
              {education.map((e, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                  <input className="w-full px-4 py-3 bg-gray-50 border-2 border-blue-100 rounded-2xl" placeholder="Institution" value={e.institution || ''} onChange={(ev) => setEducation(prev => prev.map((it,i) => i===idx?{...it,institution:ev.target.value}:it))} />
                  <input className="w-full px-4 py-3 bg-gray-50 border-2 border-blue-100 rounded-2xl" placeholder="Degree" value={e.degree || ''} onChange={(ev) => setEducation(prev => prev.map((it,i) => i===idx?{...it,degree:ev.target.value}:it))} />
                  <div className="flex gap-2">
                    <input type="date" className="w-1/2 px-4 py-3 bg-gray-50 border-2 border-blue-100 rounded-2xl" value={e.start_date || ''} onChange={(ev) => setEducation(prev => prev.map((it,i) => i===idx?{...it,start_date:ev.target.value}:it))} />
                    <input type="date" className="w-1/2 px-4 py-3 bg-gray-50 border-2 border-blue-100 rounded-2xl" value={e.end_date || ''} onChange={(ev) => setEducation(prev => prev.map((it,i) => i===idx?{...it,end_date:ev.target.value}:it))} />
                  </div>
                  <div className="md:col-span-3 flex gap-2">
                    <input className="flex-1 px-4 py-3 bg-gray-50 border-2 border-blue-100 rounded-2xl" placeholder="Grade/Score" value={e.grade || ''} onChange={(ev) => setEducation(prev => prev.map((it,i) => i===idx?{...it,grade:ev.target.value}:it))} />
                    <div className="flex gap-2">
                      <button className="px-4 py-3 bg-green-50 text-green-700 rounded-2xl" onClick={() => handleSaveEducation(idx)}>Save</button>
                      <button className="px-4 py-3 bg-red-50 text-red-600 rounded-2xl" onClick={() => handleDeleteEducation(idx)}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
              <div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-full" onClick={() => setEducation(prev => [...prev, { institution:'', degree:'', start_date:'', end_date:'', grade:'' }])}>Add Education</button>
              </div>
            </div>
          </div>

          {/* Employment List Editor */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-xl font-black italic text-gray-900 flex items-center gap-3">
              <Briefcase className="text-blue-600" size={24} />
              Employment
            </h2>
            <div className="space-y-4">
              {employment.map((ex, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                  <input className="w-full px-4 py-3 bg-gray-50 border-2 border-blue-100 rounded-2xl" placeholder="Company" value={ex.company || ''} onChange={(ev) => setEmployment(prev => prev.map((it,i) => i===idx?{...it,company:ev.target.value}:it))} />
                  <input className="w-full px-4 py-3 bg-gray-50 border-2 border-blue-100 rounded-2xl" placeholder="Title" value={ex.title || ''} onChange={(ev) => setEmployment(prev => prev.map((it,i) => i===idx?{...it,title:ev.target.value}:it))} />
                  <div className="flex gap-2">
                    <input type="date" className="w-1/2 px-4 py-3 bg-gray-50 border-2 border-blue-100 rounded-2xl" value={ex.start_date || ''} onChange={(ev) => setEmployment(prev => prev.map((it,i) => i===idx?{...it,start_date:ev.target.value}:it))} />
                    <input type="date" className="w-1/2 px-4 py-3 bg-gray-50 border-2 border-blue-100 rounded-2xl" value={ex.end_date || ''} onChange={(ev) => setEmployment(prev => prev.map((it,i) => i===idx?{...it,end_date:ev.target.value}:it))} />
                  </div>
                  <div className="md:col-span-3 flex gap-2">
                    <input className="flex-1 px-4 py-3 bg-gray-50 border-2 border-blue-100 rounded-2xl" placeholder="Description" value={ex.description || ''} onChange={(ev) => setEmployment(prev => prev.map((it,i) => i===idx?{...it,description:ev.target.value}:it))} />
                    <div className="flex gap-2">
                      <button className="px-4 py-3 bg-green-50 text-green-700 rounded-2xl" onClick={() => handleSaveEmployment(idx)}>Save</button>
                      <button className="px-4 py-3 bg-red-50 text-red-600 rounded-2xl" onClick={() => handleDeleteEmployment(idx)}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
              <div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-full" onClick={() => setEmployment(prev => [...prev, { company:'', title:'', start_date:'', end_date:'', description:'' }])}>Add Employment</button>
              </div>
            </div>
          </div>

          {/* Certificates List Editor */}
          <div className="bg-blue-50 rounded-[2.5rem] p-10 border border-blue-100 space-y-6">
            <h2 className="text-xl font-black italic text-blue-900 flex items-center gap-3">
              <Award className="text-blue-600" size={24} />
              Certifications & Achievements
            </h2>

            <div className="space-y-3">
              {certificates.map((c, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-blue-100">
                  <div className="flex-1">
                    <input className="w-full px-4 py-3 bg-gray-50 border-2 border-blue-100 rounded-2xl mb-2" placeholder="Title" value={c.title || ''} onChange={(ev) => setCertificates(prev => prev.map((it,i) => i===idx?{...it,title:ev.target.value}:it))} />
                    <input className="w-full px-4 py-3 bg-gray-50 border-2 border-blue-100 rounded-2xl" placeholder="Issuer" value={c.issuer || ''} onChange={(ev) => setCertificates(prev => prev.map((it,i) => i===idx?{...it,issuer:ev.target.value}:it))} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <input type="date" className="px-3 py-2 bg-white border rounded-2xl" value={c.issued_date || ''} onChange={(ev) => setCertificates(prev => prev.map((it,i) => i===idx?{...it,issued_date:ev.target.value}:it))} />
                    <input type="file" onChange={(ev) => setCertificateFiles(prev => ({...prev, [idx]: ev.target.files[0]}))} />
                    <div className="flex flex-col">
                      <div className="flex gap-2">
                        <button className="px-3 py-2 bg-green-50 text-green-700 rounded-2xl" onClick={() => handleSaveCertificate(idx)}>Save</button>
                        <button className="px-3 py-2 bg-red-50 text-red-600 rounded-2xl" onClick={() => handleDeleteCertificate(idx)}>Remove</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="md" className="w-full" onClick={() => setCertificates(prev => [...prev, { title:'', issuer:'', issued_date:'' }])}>
                Add New Certification
              </Button>
            </div>
          </div>

          {/* Professional Bio */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-xl font-black italic text-gray-900 flex items-center gap-3">
              <Briefcase className="text-blue-600" size={24} />
              Professional Bio
            </h2>

            <FormTextarea
              label="Tell Your Story"
              name="bio"
              rows="7"
              placeholder="Write about your background, teaching philosophy, achievements, and what makes you unique as an instructor..."
              value={profile.bio}
              onChange={(e) => setProfile({...profile, bio: e.target.value})}
            />
            <p className="text-xs text-gray-500 font-bold italic">{profile.bio?.length || 0}/500 characters</p>
          </div>

          {/* Achievements */}
          <div className="bg-blue-50 rounded-[2.5rem] p-10 border border-blue-100 space-y-6">
            <h2 className="text-xl font-black italic text-blue-900 flex items-center gap-3">
              <Award className="text-blue-600" size={24} />
              Certifications & Achievements
            </h2>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-blue-100">
                <span className="text-2xl">🏆</span>
                <div>
                  <p className="font-black text-gray-900 italic">Top Rated Instructor Badge</p>
                  <p className="text-xs text-gray-500">Awarded for maintaining 4.8+ rating</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-blue-100">
                <span className="text-2xl">⭐</span>
                <div>
                  <p className="font-black text-gray-900 italic">1000+ Student Milestone</p>
                  <p className="text-xs text-gray-500">Successfully taught 1000+ learners</p>
                </div>
              </div>
            </div>

            <Button variant="outline" size="md" className="w-full">
              Add New Certification
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorProfile;