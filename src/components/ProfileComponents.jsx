import React from 'react';
import THEME from '../styles/theme';
import { Edit2, Mail, MapPin, Briefcase } from 'lucide-react';

/**
 * ProfileCard Component
 * Displays user profile in a compact card format
 * Used in dashboards and user lists
 */
export const ProfileCard = ({
  name = 'User Name',
  role = 'Student',
  image = null,
  email = 'user@example.com',
  expertise = 'Web Development',
  location = 'Pakistan',
  bio = 'Passionate learner',
  onEdit = null,
  compact = false,
}) => {
  const getInitials = (fullName) => {
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (compact) {
    // COMPACT VERSION (for lists/tables)
    return (
      <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all group">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-black">
            {image ? (
              <img src={image} alt={name} className="w-full h-full object-cover rounded-lg" />
            ) : (
              getInitials(name)
            )}
          </div>
          <div>
            <h4 className="font-black text-gray-900 text-sm italic">{name}</h4>
            <p className="text-xs text-gray-500">{role}</p>
          </div>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all"
          >
            <Edit2 size={16} />
          </button>
        )}
      </div>
    );
  }

  // FULL VERSION
  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all group">
      {/* Header Background */}
      <div style={{ background: THEME.gradients.primary }} className="h-20"></div>

      {/* Content */}
      <div className="px-8 pb-8 relative">
        {/* Profile Image - Overlapped */}
        <div className="flex justify-between items-start -mt-12 relative z-10">
          <div className="flex items-end gap-4">
            <div className="size-32 rounded-[1.5rem] bg-gradient-to-br from-blue-500 to-blue-700 border-4 border-white flex items-center justify-center text-white text-4xl font-black shadow-lg">
              {image ? (
                <img src={image} alt={name} className="w-full h-full object-cover rounded-[1.2rem]" />
              ) : (
                getInitials(name)
              )}
            </div>
            <div className="mb-4">
              <h3 className="text-2xl font-black italic text-gray-900">{name}</h3>
              <p className="text-sm font-black text-blue-600 uppercase tracking-tight">{role}</p>
            </div>
          </div>

          {onEdit && (
            <button
              onClick={onEdit}
              className="p-3 rounded-xl bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100"
            >
              <Edit2 size={18} />
            </button>
          )}
        </div>

        {/* Bio */}
        <p className="text-sm text-gray-600 font-bold italic mt-6">{bio}</p>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-6 mt-8 pt-8 border-t border-gray-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-400">
              <Mail size={14} />
              <p className="text-[10px] font-black uppercase tracking-tight">Email</p>
            </div>
            <p className="font-bold text-gray-900 text-sm truncate">{email}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-400">
              <Briefcase size={14} />
              <p className="text-[10px] font-black uppercase tracking-tight">Expertise</p>
            </div>
            <p className="font-bold text-gray-900 text-sm">{expertise}</p>
          </div>

          <div className="col-span-2 space-y-2">
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin size={14} />
              <p className="text-[10px] font-black uppercase tracking-tight">Location</p>
            </div>
            <p className="font-bold text-gray-900 text-sm">{location}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * ProfileGrid Component
 * Display multiple profile cards in a grid
 */
export const ProfileGrid = ({ profiles, onEdit = null, columns = 3 }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-8`}>
      {profiles.map((profile, idx) => (
        <ProfileCard
          key={idx}
          {...profile}
          onEdit={() => onEdit?.(profile)}
        />
      ))}
    </div>
  );
};

/**
 * ProfileHeader Component
 * Large header for profile pages
 */
export const ProfileHeader = ({
  name = 'User Name',
  role = 'Student',
  image = null,
  rating = 4.8,
  verified = true,
  onEditClick = null,
}) => {
  const getInitials = (fullName) => {
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative">
      {/* Background */}
      <div style={{ background: THEME.gradients.primary }} className="h-32 rounded-t-[3rem]"></div>

      {/* Content */}
      <div className="bg-white rounded-b-[3rem] px-12 pb-12 shadow-sm relative">
        {/* Profile Info - Overlapped */}
        <div className="flex items-end gap-8 -mt-20 relative z-10">
          <div className="size-48 rounded-[2rem] bg-gradient-to-br from-blue-500 to-blue-700 border-4 border-white flex items-center justify-center text-white text-6xl font-black shadow-xl">
            {image ? (
              <img src={image} alt={name} className="w-full h-full object-cover rounded-[1.8rem]" />
            ) : (
              getInitials(name)
            )}
          </div>

          <div className="pb-8 flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-black italic text-gray-900">{name}</h1>
              {verified && <span className="text-2xl">✅</span>}
            </div>
            <p className="text-lg font-black text-blue-600 uppercase tracking-tight mb-4">{role}</p>

            {rating && (
              <div className="flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                <span className="font-black text-gray-900">{rating} rating</span>
              </div>
            )}
          </div>

          {onEditClick && (
            <button
              onClick={onEditClick}
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * AvatarGroup Component
 * Display multiple avatars (useful for showing students in a course)
 */
export const AvatarGroup = ({
  users = [],
  max = 5,
  size = 'md',
}) => {
  const sizeMap = {
    sm: 'size-8 text-xs',
    md: 'size-10 text-sm',
    lg: 'size-12 text-base',
  };

  const displayUsers = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-3">
        {displayUsers.map((user, idx) => (
          <div
            key={idx}
            className={`${sizeMap[size]} rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-black border-2 border-white`}
            title={user.name}
          >
            {user.image ? (
              <img src={user.image} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              user.name[0]?.toUpperCase()
            )}
          </div>
        ))}

        {remaining > 0 && (
          <div className={`${sizeMap[size]} rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-black border-2 border-white text-[10px]`}>
            +{remaining}
          </div>
        )}
      </div>

      <p className="text-sm font-bold text-gray-700">{users.length} students</p>
    </div>
  );
};

export default {
  ProfileCard,
  ProfileGrid,
  ProfileHeader,
  AvatarGroup,
};
