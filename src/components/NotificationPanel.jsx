import { useState, useEffect } from 'react';
import API from '../api/axios';
import { Bell, X, CheckCircle, Info } from 'lucide-react';

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Notifications fetch karna
  const fetchNotifications = async () => {
    try {
      const res = await API.get('notifications/');
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Har 30 seconds baad auto-check (Polling)
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAllAsRead = async () => {
    try {
      await API.post('notifications/mark-all-read/');
      fetchNotifications();
    } catch (err) {
      console.error('Error marking all read', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAsRead = async (id) => {
    try {
      await API.patch(`notifications/mark-read/${id}/`);
      fetchNotifications();
    } catch (err) {
      console.error("Error marking read");
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-blue-600 transition-all shadow-sm">
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 size-3 bg-red-500 rounded-full border-2 border-white"></span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-4 w-80 bg-white rounded-[2rem] shadow-2xl border border-gray-50 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-black italic text-gray-900">Alerts</h3>
            <div className="flex items-center gap-2">
              <button onClick={markAllAsRead} className="text-xs font-black text-gray-500 hover:underline">Mark all read</button>
              <button onClick={() => setIsOpen(false)}><X size={18} className="text-gray-300" /></button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-10 text-center text-gray-400 text-sm font-bold">No new notifications</div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={`p-5 border-b border-gray-50 flex gap-4 hover:bg-gray-50 transition-colors cursor-pointer ${!n.is_read ? 'bg-blue-50/30' : ''}`}
                  onClick={() => markAsRead(n.id)}
                >
                  <div className={`p-2 rounded-xl h-fit ${n.notification_type === 'Update' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                    {n.notification_type === 'Update' ? <Info size={16} /> : <CheckCircle size={16} />}
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-900 italic">{n.title}</p>
                    <p className="text-[11px] text-gray-500 font-medium mt-1 leading-relaxed">{n.message}</p>
                    <p className="text-[9px] text-gray-300 font-black uppercase mt-2">{new Date(n.created_at).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;