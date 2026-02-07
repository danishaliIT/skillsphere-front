import React from 'react';
import { Search, Filter, MoreVertical, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const ManageEmployees = () => {
  // Team data reflecting specialized roles
  const employees = [
    { 
      id: 1, name: 'Zain Ahmed', role: 'MERN Developer', 
      training: 'Advanced Next.js Mastery', progress: 85, 
      score: '48.5/60', status: 'On Track' 
    },
    { 
      id: 2, name: 'Danish Ali', role: 'AI Strategist', 
      training: 'NLP & LLM Deployment', progress: 54, 
      score: '32.2/60', status: 'In Progress' // Reflecting specific test metrics
    },
    { 
      id: 3, name: 'Sarah Khan', role: 'Lead Gen Expert', 
      training: 'B2B LinkedIn Automation', progress: 100, 
      score: '58/60', status: 'Certified' 
    },
    { 
      id: 4, name: 'Asad Lodhi', role: 'Drone Technician', 
      training: 'Autonomous Pixhawk Logic', progress: 20, 
      score: '15/60', status: 'At Risk' 
    },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20 font-bold italic">
      {/* --- HEADER --- */}
      <header className="flex flex-col md:flex-row justify-between items-end border-b border-slate-100 pb-8 gap-6">
        <div className="space-y-2">
          <p className="text-blue-600 text-[10px] uppercase tracking-[0.4em]">Workforce Intelligence</p>
          <h1 className="text-6xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Team Deployment</h1>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" placeholder="Search Operative..." 
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold italic focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <button className="p-4 bg-slate-100 text-slate-900 rounded-2xl hover:bg-slate-200 transition-all">
            <Filter size={20} />
          </button>
        </div>
      </header>

      {/* --- EMPLOYEE DATA TABLE --- */}
      <div className="bg-white rounded-[4rem] shadow-3xl border border-slate-50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0F172A] text-white">
              <th className="p-8 text-[10px] uppercase tracking-[0.2em] font-black italic">Operative & Role</th>
              <th className="p-8 text-[10px] uppercase tracking-[0.2em] font-black italic">Active Training</th>
              <th className="p-8 text-[10px] uppercase tracking-[0.2em] font-black italic">Progress</th>
              <th className="p-8 text-[10px] uppercase tracking-[0.2em] font-black italic">Assessment Score</th>
              <th className="p-8 text-[10px] uppercase tracking-[0.2em] font-black italic text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="p-8">
                  <div className="flex items-center gap-4">
                    <div className="size-12 bg-slate-100 rounded-xl flex items-center justify-center font-black text-blue-600 text-lg">
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-black italic text-slate-900 uppercase">{emp.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{emp.role}</p>
                    </div>
                  </div>
                </td>
                <td className="p-8">
                  <p className="text-xs font-black italic text-slate-700 uppercase tracking-tighter">{emp.training}</p>
                </td>
                <td className="p-8 w-64">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[9px] font-black uppercase text-slate-400 italic">
                      <span>Sync Level</span>
                      <span className="text-blue-600">{emp.progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 transition-all duration-1000 shadow-[0_0_10px_rgba(37,99,235,0.4)]" 
                        style={{ width: `${emp.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="p-8">
                  <div className="inline-block px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-sm font-black italic text-slate-900 tracking-tighter">
                      {emp.score} <span className="text-[10px] text-slate-400 uppercase ml-1">pts</span>
                    </p>
                  </div>
                </td>
                <td className="p-8">
                  <div className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase italic ${
                    emp.status === 'Certified' ? 'bg-green-100 text-green-600' : 
                    emp.status === 'At Risk' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {emp.status === 'Certified' ? <CheckCircle size={12}/> : emp.status === 'At Risk' ? <AlertCircle size={12}/> : <Clock size={12}/>}
                    {emp.status}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- FOOTER ACTION --- */}
      <div className="flex justify-between items-center px-12 py-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 italic">
        <p className="text-xs font-bold text-slate-400">Showing 4 active operatives deployed in various training sectors.</p>
        <button className="text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline">Download Performance Intel</button>
      </div>
    </div>
  );
};

export default ManageEmployees;