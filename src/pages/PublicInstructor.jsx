import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API, { getMediaUrl } from '../api/axios';
import { Loader2, MapPin, Linkedin, Github, Award } from 'lucide-react';

const PublicInstructor = () => {
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get(`profiles/instructor/username/${username}/`);
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
    <div className="p-12 text-center bg-white rounded-2xl shadow">Instructor profile not found or not public.</div>
  );

  const img = profile.profile_picture ? getMediaUrl(profile.profile_picture) : `https://ui-avatars.com/api/?name=${profile.full_name || profile.username}`;

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="flex items-center gap-6 bg-white p-6 rounded-2xl shadow">
        <img src={img} alt="avatar" className="w-28 h-28 object-cover rounded-2xl" />
        <div>
          <h2 className="text-2xl font-black">{profile.full_name} <span className="text-sm text-gray-400">@{profile.username}</span></h2>
          <p className="text-gray-600 mt-2">{profile.expertise} • {profile.experience_years} yrs • Rating {profile.rating}</p>
          <p className="text-gray-600 mt-2">{profile.bio}</p>
          <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
            {profile.phone_number && <div className="flex items-center gap-2"><MapPin size={14} /> {profile.phone_number}</div>}
            {profile.email && <div className="ml-2">{profile.email}</div>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <h4 className="text-sm font-black text-gray-400 uppercase">Education</h4>
          {profile.education && profile.education.length > 0 ? (
            profile.education.map((e, i) => (
              <div key={i} className="p-3 border rounded">
                <div className="font-bold">{e.institution} — {e.degree}</div>
                <div className="text-xs text-gray-500">{e.start_date || ''} — {e.end_date || ''} · {e.grade || ''}</div>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-400">No education details provided.</div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <h4 className="text-sm font-black text-gray-400 uppercase">Employment & Certificates</h4>
          <div className="space-y-3">
            <h5 className="text-sm font-bold">Employment</h5>
            {profile.employment && profile.employment.length > 0 ? (
              profile.employment.map((ex, i) => (
                <div key={i} className="p-3 border rounded">
                  <div className="font-bold">{ex.title} @ {ex.company}</div>
                  <div className="text-xs text-gray-500">{ex.start_date || ''} — {ex.end_date || ''}</div>
                  <div className="text-sm text-gray-700">{ex.description}</div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-400">No employment history provided.</div>
            )}

            <h5 className="text-sm font-bold mt-4">Certificates</h5>
            {profile.certificates && profile.certificates.length > 0 ? (
              profile.certificates.map((c, i) => (
                <div key={i} className="p-3 border rounded flex items-center justify-between">
                  <div>
                    <div className="font-bold">{c.title}</div>
                    <div className="text-xs text-gray-500">{c.issuer} · {c.issued_date || ''}</div>
                  </div>
                  {c.file && <a className="text-blue-600" href={getMediaUrl(c.file)} target="_blank" rel="noreferrer">Download</a>}
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-400">No certificates listed.</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <h4 className="text-sm font-black text-gray-400 uppercase">Socials & Contact</h4>
          <div className="flex flex-col gap-2">
            {profile.socials?.linkedin && <a href={profile.socials.linkedin} className="text-sm text-blue-600" target="_blank" rel="noreferrer"><Linkedin size={14} /> LinkedIn</a>}
            {profile.socials?.github && <a href={profile.socials.github} className="text-sm text-gray-800" target="_blank" rel="noreferrer"><Github size={14} /> GitHub</a>}
            {profile.website && <a href={profile.website} className="text-sm text-gray-700" target="_blank" rel="noreferrer">Website</a>}
            {profile.address && (
              <div className="text-sm text-gray-600">{profile.address.street_address} {profile.address.city} {profile.address.state} {profile.address.country}</div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <h4 className="text-sm font-black text-gray-400 uppercase">Bank Details</h4>
          <div className="text-sm text-gray-700">
            <div>Bank: {profile.bank_name || '—'}</div>
            <div>Account: {profile.bank_account_number || '—'}</div>
            <div>IBAN: {profile.bank_iban || '—'}</div>
            <div>SWIFT: {profile.bank_swift || '—'}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <h4 className="text-sm font-black text-gray-400 uppercase">Skills</h4>
          {profile.skills ? (
            <div className="flex flex-wrap gap-2">
              {profile.skills.split(',').map((s, i) => (
                <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">{s.trim()}</span>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-400">No skills listed.</div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <h4 className="text-sm font-black text-gray-400 uppercase">Certificates & Achievements</h4>
          <div className="flex flex-col gap-2">
            <Link to="/dashboard/certificates" className="text-sm text-gray-700"><Award size={14} /> View certificates (if any)</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicInstructor;
