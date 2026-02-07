import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../api/axios';
import { 
  User, MapPin, Globe, Github, Linkedin, 
  Award, Book, ShieldCheck, Star, ExternalLink 
} from 'lucide-react';

const StudentPortfolio = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await API.get(`profiles/student/${id}/`);
        setData(res.data);
      } catch (err) {
        console.error("Portfolio fetch failed");
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [id]);

  if (loading) return <div className="text-center py-20 font-black italic">Generating Portfolio...</div>;

  return (
    <div className="min-h-screen bg-[#fcfcfd] pb-20">
      {/* Top Banner Branding */}
      <div className="h-64 bg-gray-900 relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-3xl"></div>
        <h1 className="text-[12rem] font-black text-white/5 italic select-none uppercase tracking-tighter">DragonTech</h1>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Sidebar: Profile Identity */}
          <div className="space-y-8">
            <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl shadow-gray-200/50 border border-gray-50 text-center">
              <div className="size-48 rounded-[3rem] overflow-hidden border-8 border-white shadow-xl mx-auto mb-6 bg-gray-50">
                <img src={data?.profile_picture || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" alt="profile" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 italic tracking-tight">{data?.first_name} {data?.last_name}</h2>
              <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] mt-2 italic">Professional Talent</p>
              
              <div className="flex items-center justify-center gap-3 mt-6 text-gray-400">
                <MapPin size={16} />
                <span className="text-xs font-bold italic">{data?.location || 'Lodhran, Pakistan'}</span>
              </div>

              <div className="pt-8 mt-8 border-t border-gray-50 flex justify-center gap-4">
                <button className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-blue-600 transition-all"><Github size={20}/></button>
                <button className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-blue-600 transition-all"><Linkedin size={20}/></button>
                <button className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-blue-600 transition-all"><Globe size={20}/></button>
              </div>
            </div>

            <div className="bg-gray-900 p-10 rounded-[3rem] text-white space-y-6 shadow-xl">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 italic">Quick Bio</h4>
              <p className="text-sm font-medium leading-relaxed italic opacity-80">
                {data?.bio || "Passionate about Military Tech, AI, and MERN stack development. Focused on building impactful solutions."}
              </p>
            </div>
          </div>

          {/* Right Content: Stats & Achievements */}
          <div className="lg:col-span-2 space-y-12">
            {/* Skills & Experience */}
            <section className="space-y-6">
              <h3 className="text-4xl font-black text-gray-900 italic tracking-tighter uppercase">Verified Skills</h3>
              <div className="flex flex-wrap gap-3">
                {['MERN Stack', 'NLP', 'Military Tech', 'AI Drones', 'Lead Generation'].map((skill) => (
                  <span key={skill} className="px-6 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-black italic uppercase tracking-widest shadow-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* Certifications Showroom */}
            <section className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-4xl font-black text-gray-900 italic tracking-tighter uppercase">Certifications</h3>
                <Award className="text-blue-600" size={32} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-lg flex items-start gap-5 group hover:border-blue-200 transition-all">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <ShieldCheck size={24} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-black italic text-gray-900 tracking-tight leading-tight">Corporate Skill Acceleration Program</h4>
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">DragonTech Certified</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Education Timeline */}
            <section className="space-y-6">
               <h3 className="text-4xl font-black text-gray-900 italic tracking-tighter uppercase">Education</h3>
               <div className="bg-white p-10 rounded-[3rem] border border-gray-50 shadow-sm flex items-center gap-6">
                 <div className="size-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                   <Book size={30} />
                 </div>
                 <div>
                   <h4 className="text-xl font-black italic text-gray-900">{data?.education || 'Academic Degree'}</h4>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Verified Institution</p>
                 </div>
               </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentPortfolio;