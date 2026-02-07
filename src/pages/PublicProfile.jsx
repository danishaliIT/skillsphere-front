import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API, { getMediaUrl } from '../api/axios';
import { Loader2, MapPin, Linkedin, Github, Award } from 'lucide-react';

const PublicProfile = () => {
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get(`profiles/student/username/${username}/`);
        setProfile(res.data);
      } catch (err) {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  if (loading) return (
    <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin" size={48} /></div>
  );

  if (!profile) return (
    <div className="p-12 text-center bg-white rounded-2xl shadow">Profile not found or not public.</div>
  );

  const img = profile.profile_picture ? getMediaUrl(profile.profile_picture) : `https://ui-avatars.com/api/?name=${profile.first_name || profile.username}`;

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="flex items-center gap-6 bg-white p-6 rounded-2xl shadow">
        <img src={img} alt="avatar" className="w-28 h-28 object-cover rounded-2xl" />
        <div>
          <h2 className="text-2xl font-black">{profile.first_name} {profile.last_name} <span className="text-sm text-gray-400">@{profile.username}</span></h2>
          <p className="text-gray-600 mt-2">{profile.experience || profile.bio}</p>
          <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
            {profile.phone_number && <div className="flex items-center gap-2"><MapPin size={14} /> {profile.phone_number}</div>}
            {profile.email && <div className="ml-2">{profile.email}</div>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <h4 className="text-sm font-black text-gray-400 uppercase">Education</h4>
          {profile.education_history && profile.education_history.length > 0 ? (
            profile.education_history.map((e, i) => (
              <div key={i} className="p-3 border rounded">
                <div className="font-bold">{e.institution} — {e.degree}</div>
                <div className="text-xs text-gray-500">{e.start_date || ''} — {e.end_date || ''} · {e.grade_or_score || ''}</div>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-400">No education details provided.</div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <h4 className="text-sm font-black text-gray-400 uppercase">Links & Certificates</h4>
          <div className="flex flex-col gap-2">
            {profile.socials?.linkedin && <a href={profile.socials.linkedin} className="text-sm text-blue-600" target="_blank" rel="noreferrer"><Linkedin size={14} /> LinkedIn</a>}
            {profile.socials?.github && <a href={profile.socials.github} className="text-sm text-gray-800" target="_blank" rel="noreferrer"><Github size={14} /> GitHub</a>}
            <Link to="/dashboard/certificates" className="text-sm text-gray-700"><Award size={14} /> View certificates (if any)</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
