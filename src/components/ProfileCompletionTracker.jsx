import React from 'react';

const fieldsScore = (data) => {
  let score = 0;
  const checks = [
    !!data.first_name,
    !!data.last_name,
    !!data.profile_picture,
    !!data.phone_number,
    !!data.bio,
    !!(data.address && data.address.city),
    !!(data.education_history && data.education_history.length > 0),
    !!(data.socials && (data.socials.linkedin || data.socials.github)),
  ];
  checks.forEach(c => { if (c) score += 1; });
  return Math.round((score / checks.length) * 100);
};

const ProfileCompletionTracker = ({ data }) => {
  const pct = fieldsScore(data || {});
  return (
    <div className="w-full bg-gray-100 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-black uppercase text-gray-500">Profile Completion</div>
        <div className="text-sm font-bold text-blue-600">{pct}%</div>
      </div>
      <div className="w-full bg-white rounded-full h-3 overflow-hidden border border-gray-200">
        <div style={{ width: `${pct}%` }} className="h-3 bg-blue-600"></div>
      </div>
      {pct < 80 && (
        <p className="text-xs text-gray-500 mt-3">Complete your profile to improve visibility and enable enrollments.</p>
      )}
    </div>
  );
};

export default ProfileCompletionTracker;
