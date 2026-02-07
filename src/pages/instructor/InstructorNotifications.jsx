import React, { useEffect, useState } from 'react';
import { Loader2, Check, UserPlus, DollarSign, MessageSquare, Zap } from 'lucide-react';
import API from '../../api/axios';

const iconForType = (type) => {
  switch ((type || '').toLowerCase()) {
    case 'enrollment': return <UserPlus className="text-blue-600" />;
    case 'payment': return <DollarSign className="text-green-600" />;
    case 'alert': return <Zap className="text-yellow-600" />;
    default: return <MessageSquare className="text-purple-600" />;
  }
};

const InstructorNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await API.get('notifications/');
      setNotifications(res.data || []);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const iv = setInterval(fetchNotifications, 30000);
    return () => clearInterval(iv);
  }, []);

  const markRead = async (id) => {
    try {
      await API.patch(`notifications/mark-read/${id}/`);
      setNotifications((prev) => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  const markAllRead = async () => {
    setMarkingAll(true);
    try {
      await API.post('notifications/mark-all-read/');
      setNotifications((prev) => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error('Failed to mark all read', err);
    } finally {
      setMarkingAll(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin" size={48} /></div>;

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20 font-bold italic">
      <header className="flex items-center justify-between border-b border-slate-100 pb-8">
        <div>
          <p className="text-blue-600 text-[10px] uppercase tracking-[0.4em]">Signal Feed</p>
          <h1 className="text-6xl font-black text-slate-900 uppercase italic tracking-tighter">Notifications</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={markAllRead} className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold">
            {markingAll ? 'Marking...' : 'Mark all read'}
          </button>
        </div>
      </header>

      <div className="max-w-4xl space-y-4">
        {notifications.length === 0 && (
          <div className="p-8 rounded-[2.5rem] border bg-white border-slate-50">No notifications yet.</div>
        )}

        {notifications.map((n) => (
          <div 
            key={n.id}
            className={`p-8 rounded-[2.5rem] border transition-all flex items-center justify-between group ${
              !n.is_read ? 'bg-blue-50/30 border-blue-100 shadow-xl shadow-blue-50' : 'bg-white border-slate-50 opacity-90 hover:opacity-100'
            }`}
          >
            <div className="flex items-center gap-6">
              <div className={`size-14 rounded-2xl flex items-center justify-center bg-white shadow-sm group-hover:scale-110 transition-transform`}>
                {iconForType(n.notification_type)}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-black italic text-slate-900">{n.title}</p>
                <p className="text-sm text-gray-700">{n.message}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(n.created_at).toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {!n.is_read && (
                <button onClick={() => markRead(n.id)} className="px-3 py-2 bg-white border rounded-xl font-bold">Mark read</button>
              )}
              {n.is_read && <span className="text-green-600 font-bold flex items-center gap-2"><Check size={14}/> Read</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstructorNotifications;