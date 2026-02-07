import { useEffect, useState } from 'react';
import API from '../../api/axios';
import { Bell, CheckCircle, Info, Trash2, Clock } from 'lucide-react';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await API.get('notifications/');
      setNotifications(res.data);
    } catch (err) {
      console.error("Notifications fetch failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await API.patch(`notifications/mark-read/${id}/`);
      fetchNotifications();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="max-w-4xl space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-gray-900 italic tracking-tighter uppercase">Alert Center</h1>
          <p className="text-gray-400 font-bold mt-2 uppercase tracking-widest text-[10px]">Real-time updates on your learning journey</p>
        </div>
      </header>

      <div className="bg-white rounded-[3rem] border border-gray-50 shadow-xl overflow-hidden">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div 
              key={n.id} 
              className={`p-10 border-b border-gray-50 flex flex-col md:flex-row gap-8 items-start hover:bg-gray-50/50 transition-all ${!n.is_read ? 'bg-blue-50/20' : ''}`}
            >
              <div className={`p-4 rounded-3xl ${n.notification_type === 'Update' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                {n.notification_type === 'Update' ? <Info size={24} /> : <CheckCircle size={24} />}
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="text-xl font-black italic text-gray-900">{n.title}</h4>
                  <span className="flex items-center gap-1 text-[9px] font-black text-gray-300 uppercase tracking-widest">
                    <Clock size={12} /> {new Date(n.created_at).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-gray-500 font-medium leading-relaxed italic">{n.message}</p>
                
                {!n.is_read && (
                  <button 
                    onClick={() => markAsRead(n.id)}
                    className="mt-4 text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] hover:underline"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-24 text-center text-gray-400 font-black italic">
            <Bell size={48} className="mx-auto mb-4 opacity-10" />
            No Recent Notifications
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;