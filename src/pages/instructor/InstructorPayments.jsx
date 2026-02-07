import React from 'react';
import { 
  Wallet, DollarSign, ArrowUpRight, TrendingUp, 
  Download, Filter, ArrowRight, CreditCard 
} from 'lucide-react';

const InstructorPayments = () => {
  // Dummy data representing course earnings like the $50 MERN course
  const transactions = [
    { id: 'TXN-9021', course: 'Complete MERN Masterclass', student: 'Danish Ali', amount: 50.00, date: '17 Jan 2026', status: 'Completed' },
    { id: 'TXN-8842', course: 'AI Robotics Fundamentals', student: 'Zain Ahmed', amount: 75.00, date: '15 Jan 2026', status: 'Completed' },
    { id: 'TXN-7611', course: 'Military Tech Strategy', student: 'Sarah Khan', amount: 120.00, date: '12 Jan 2026', status: 'Processing' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20 font-bold italic">
      {/* --- HEADER --- */}
      <header className="flex justify-between items-end border-b border-slate-100 pb-8">
        <div className="space-y-2">
          <p className="text-blue-600 text-[10px] uppercase tracking-[0.4em]">Financial Terminal</p>
          <h1 className="text-6xl font-black text-slate-900 uppercase italic tracking-tighter">Earnings Intel</h1>
        </div>
        <button className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
          <Download size={16} /> Export Report
        </button>
      </header>

      {/* --- OVERVIEW STATS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Total Revenue', value: '$4,250.00', icon: <DollarSign />, color: 'text-green-500', bg: 'bg-green-50' },
          { label: 'Current Balance', value: '$1,120.40', icon: <Wallet />, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Monthly Growth', value: '+24.5%', icon: <TrendingUp />, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-50 flex flex-col space-y-4 group hover:border-blue-100 transition-all">
            <div className={`size-14 ${stat.bg} rounded-2xl flex items-center justify-center ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className={`text-5xl font-black italic tracking-tighter ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* --- REVENUE DISTRIBUTION CHART PLACEHOLDER --- */}
        <div className="lg:col-span-2 bg-[#0F172A] rounded-[4rem] p-12 text-white shadow-2xl space-y-8 relative overflow-hidden">
          <div className="flex justify-between items-center relative z-10">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">Performance Analytics</h2>
            <select className="bg-white/5 border-none rounded-xl text-[10px] uppercase font-black italic p-2 text-blue-400 outline-none">
              <option>Last 30 Days</option>
              <option>Last 6 Months</option>
            </select>
          </div>
          
          {/* Simple Chart Simulation */}
          <div className="h-64 flex items-end gap-4 relative z-10 px-4">
            {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
              <div key={i} className="flex-1 bg-blue-600/20 rounded-t-xl group relative">
                <div 
                  className="absolute bottom-0 w-full bg-blue-600 rounded-t-xl transition-all duration-1000 group-hover:bg-white" 
                  style={{ height: `${h}%` }}
                ></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-black uppercase italic tracking-widest px-4">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        {/* --- PAYOUT ACCOUNT --- */}
        <div className="bg-white rounded-[4rem] p-12 shadow-2xl border border-slate-50 space-y-8">
          <h2 className="text-xl font-black italic uppercase tracking-tighter text-slate-900">Payout Method</h2>
          <div className="p-8 bg-slate-50 rounded-[2.5rem] space-y-6">
            <div className="flex items-center gap-4">
              <div className="size-12 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                <CreditCard size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">Primary Bank</p>
                <p className="text-sm font-black italic text-slate-900">**** 8821</p>
              </div>
            </div>
            <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] uppercase text-slate-400 hover:bg-white transition-all">
              Update Method
            </button>
          </div>
          <button className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black italic uppercase text-xs tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2">
             Request Payout <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* --- TRANSACTION HISTORY --- */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 ml-4">Recent Deployments</h2>
        <div className="bg-white rounded-[3.5rem] shadow-2xl border border-slate-50 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-8 text-[10px] uppercase text-slate-400 tracking-widest font-black italic">Transaction ID</th>
                <th className="p-8 text-[10px] uppercase text-slate-400 tracking-widest font-black italic">Asset / Course</th>
                <th className="p-8 text-[10px] uppercase text-slate-400 tracking-widest font-black italic">Amount</th>
                <th className="p-8 text-[10px] uppercase text-slate-400 tracking-widest font-black italic">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, idx) => (
                <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-8 font-black italic text-xs text-slate-400 uppercase tracking-tighter">{txn.id}</td>
                  <td className="p-8">
                    <p className="text-sm font-black italic text-slate-900 uppercase">{txn.course}</p>
                    <p className="text-[10px] text-slate-400 italic">Student: {txn.student}</p>
                  </td>
                  <td className="p-8 text-sm font-black italic text-slate-900">${txn.amount.toFixed(2)}</td>
                  <td className="p-8">
                    <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase italic ${
                      txn.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InstructorPayments;