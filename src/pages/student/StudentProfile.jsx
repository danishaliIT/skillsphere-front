import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfilePictureUploader, FormInput, FormSelect, FormTextarea, Button, Alert } from '../../components/UIComponents';
import API, { getMediaUrl } from '../../api/axios';
import { Save, AlertCircle, CheckCircle2, Loader2, User, Mail, MapPin, BookOpen } from 'lucide-react';
import THEME from '../../styles/theme';

const StudentProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    phone: '',
    country: '',
    city: '',
    zip_code: '',
  });

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('profiles/me/');
        const data = res.data.student_profile || res.data;
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          bio: data.bio || '',
          phone: data.phone || '',
          country: data.country || '',
          city: data.city || '',
          zip_code: data.zip_code || '',
        });

        // Set profile image
        if (data.profile_picture_url) {
          setProfileImage(getMediaUrl(data.profile_picture_url));
        }
        setLoading(false);
      } catch (err) {
        console.error('Profile fetch failed:', err);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const getInitials = () => {
    const initials = `${formData.first_name[0] || '?'}${formData.last_name[0] || '?'}`.toUpperCase();
    return initials;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage('');
    try {
      const submitData = new FormData();
      submitData.append('first_name', formData.first_name);
      submitData.append('last_name', formData.last_name);
      submitData.append('bio', formData.bio);
      submitData.append('phone', formData.phone);
      submitData.append('country', formData.country);
      submitData.append('city', formData.city);
      submitData.append('zip_code', formData.zip_code);

      if (profileImage instanceof File) {
        submitData.append('profile_picture', profileImage);
      }

      const res = await API.patch('profiles/me/', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const updated = res.data.student_profile || res.data;
      setFormData(prev => ({ ...prev, ...updated }));
      setProfileImage(null);
      setProfileImagePreview(null);
      
      setMessageType('success');
      setMessage('✅ Profile updated successfully!');
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setMessageType('error');
      setMessage(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
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
      {/* HEADER */}
      <header className="border-b border-gray-100 pb-8">
        <div className="flex justify-between items-start gap-8">
          <div>
            <h1 className="text-5xl font-black text-gray-900 italic tracking-tighter">My Profile</h1>
            <p className="text-gray-500 font-bold mt-2">Manage your account and personal details</p>
          </div>
          <Button 
            onClick={handleSaveProfile}
            disabled={saving}
            variant="primary"
            size="lg"
          >
            {saving ? <><Loader2 className="animate-spin" size={18} /> Saving...</> : <><Save size={18} /> Save Changes</>}
          </Button>
        </div>
      </header>

      {/* Messages */}
      {message && (
        <Alert 
          type={messageType}
          message={message}
          onClose={() => setMessage('')}
          icon={messageType === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT: PROFILE PICTURE & STATS */}
        <div className="space-y-8">
          {/* Profile Picture */}
          <ProfilePictureUploader 
            currentImage={profileImage instanceof File ? null : profileImage}
            preview={profileImagePreview}
            onFileChange={handleProfileImageChange}
            size="xl"
            editable={true}
            fallbackInitials={getInitials()}
          />

          {/* Quick Stats */}
          <div className="bg-blue-50 rounded-[2.5rem] p-8 space-y-6 border border-blue-100">
            <h3 className="text-lg font-black italic text-gray-900">Your Achievements</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-blue-200">
                <span className="text-sm font-bold text-gray-600">Courses Enrolled</span>
                <span className="text-2xl font-black text-blue-600 italic">4</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-blue-200">
                <span className="text-sm font-bold text-gray-600">Certificates Earned</span>
                <span className="text-2xl font-black text-green-600 italic">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-600">Learning Hours</span>
                <span className="text-2xl font-black text-purple-600 italic">48</span>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-gray-50 rounded-[2.5rem] p-8 space-y-4 border border-gray-100">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Account Status</h3>
            <div className="flex items-center gap-3">
              <div className="size-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-bold text-gray-900">Active & Verified</span>
            </div>
            <p className="text-xs text-gray-500 font-bold italic">Joined 3 months ago</p>
          </div>
        </div>

        {/* RIGHT: FORM FIELDS */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-xl font-black italic text-gray-900 flex items-center gap-3">
              <User className="text-blue-600" size={24} />
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                placeholder="Enter your first name"
                required
              />
              <FormInput
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                placeholder="Enter your last name"
                required
              />
            </div>

            <FormTextarea
              label="Bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself, your interests, and your career goals..."
              rows="4"
            />

            <FormInput
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+1 (555) 000-0000"
            />
          </div>

          {/* Location Information */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-xl font-black italic text-gray-900 flex items-center gap-3">
              <MapPin className="text-blue-600" size={24} />
              Location
            </h2>

            <FormSelect
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              options={[
                { value: '', label: 'Select Country' },
                { value: 'Pakistan', label: 'Pakistan' },
                { value: 'United States', label: 'United States' },
                { value: 'United Kingdom', label: 'United Kingdom' },
                { value: 'Canada', label: 'Canada' },
                { value: 'Australia', label: 'Australia' },
                { value: 'Other', label: 'Other' },
              ]}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Enter your city"
              />
              <FormInput
                label="Zip Code"
                name="zip_code"
                value={formData.zip_code}
                onChange={handleInputChange}
                placeholder="Enter your zip code"
              />
            </div>
          </div>

          {/* Email (Read-only) */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-xl font-black italic text-gray-900 flex items-center gap-3">
              <Mail className="text-blue-600" size={24} />
              Contact Email
            </h2>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between">
              <span className="font-bold text-gray-900">your.email@example.com</span>
              <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">✓ Verified</span>
            </div>
            <p className="text-xs text-gray-500 font-bold italic">Email verification ensures account security. Contact support to change.</p>
          </div>

          {/* Learning Preferences */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-xl font-black italic text-gray-900 flex items-center gap-3">
              <BookOpen className="text-blue-600" size={24} />
              Learning Preferences
            </h2>

            <FormSelect
              label="Preferred Learning Level"
              name="learning_level"
              options={[
                { value: 'beginner', label: 'Beginner - New to tech' },
                { value: 'intermediate', label: 'Intermediate - Some experience' },
                { value: 'advanced', label: 'Advanced - Expert level' },
              ]}
            />

            <div className="flex items-center gap-4 pt-4">
              <input type="checkbox" id="email_notifications" className="w-5 h-5" defaultChecked />
              <label htmlFor="email_notifications" className="font-bold text-gray-900 text-sm">
                Send me email notifications about new courses and updates
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* DELETE ACCOUNT (Dangerous) */}
      <div className="bg-red-50 border-2 border-red-200 rounded-[2.5rem] p-10 space-y-4">
        <h3 className="text-lg font-black text-red-700 italic">Danger Zone</h3>
        <p className="text-sm text-red-600 font-bold">
          This action cannot be undone. All your data, courses, and certificates will be permanently deleted.
        </p>
        <Button 
          variant="danger" 
          size="md"
          onClick={() => {
            if (window.confirm('Are you absolutely sure? This cannot be undone.')) {
              // Delete logic
            }
          }}
        >
          Delete My Account
        </Button>
      </div>
    </div>
  );
};

export default StudentProfile;
