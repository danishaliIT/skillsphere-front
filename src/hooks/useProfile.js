// src/hooks/useProfile.js
import { useState, useEffect } from 'react';
import API from '../api/axios';

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      // URL ko plural 'profiles' kar dein aur trailing slash check karein
      const res = await API.get('profiles/me/'); 
      setProfile(res.data);
    } catch (err) {
      console.error("Profile fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { profile, loading, refreshProfile: fetchProfile };
};