import { useEffect, useState } from 'react';
import API from '../../api/axios';
import { Award, Download, ShieldCheck, Star, ExternalLink, Briefcase } from 'lucide-react';

const CertificatesPage = () => {
  const [completedItems, setCompletedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await API.get('certificates/my-certificates/');
        // API returns CertificateSerializer: id, certificate_number, issue_date, file_url, student_name, course_title
        const items = res.data.map(c => ({
          id: c.id,
          title: c.course_title || `Certificate ${c.certificate_number}`,
          provider: c.student_name || 'DragonTech',
          issued: c.issue_date,
          file_url: c.file_url
        }));

        setCompletedItems(items);
      } catch (err) {
        console.error('Failed to fetch certificates', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-5xl font-black text-gray-900 italic tracking-tighter uppercase">Academic Awards</h1>
        <p className="text-gray-400 font-bold mt-2 uppercase tracking-widest text-[10px]">Verified certifications for your skills and career</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {completedItems.map((item) => (
          <div key={item.id} className="bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden group hover:-translate-y-2 transition-all duration-500">
            {/* Certificate Preview Branch */}
            <div className="h-48 bg-gray-900 flex items-center justify-center p-10 relative">
              <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/10 transition-all"></div>
              <div className="size-20 border-2 border-white/20 rounded-full flex items-center justify-center relative">
                 <Award className="text-blue-500" size={40} />
                 <Star className="text-white absolute -top-2 -right-2 fill-white" size={16} />
              </div>
              <div className="absolute bottom-4 left-6 flex items-center gap-2">
                 <ShieldCheck className="text-green-500" size={14} />
                 <span className="text-[8px] font-black text-white/50 uppercase tracking-[0.2em]">Verified by DragonTech</span>
              </div>
            </div>

            {/* Certificate Details */}
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <span className="text-blue-600 font-black text-[9px] uppercase tracking-widest italic">{item.type} Course</span>
                <h4 className="text-xl font-black text-gray-900 italic leading-tight">{item.title}</h4>
                <p className="text-gray-400 text-[10px] font-bold italic tracking-tight">Provider: {item.provider}</p>
              </div>

              <div className="pt-6 border-t border-gray-50 flex gap-3">
                <a href={item.file_url || '#'} target="_blank" rel="noreferrer" className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 transition-all">
                  <Download size={14} /> Download PDF
                </a>
                <a href={item.file_url || '#'} target="_blank" rel="noreferrer" className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 transition-all">
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        ))}

        {completedItems.length === 0 && (
          <div className="col-span-full py-32 text-center bg-white rounded-[4rem] border-2 border-dashed border-gray-100">
            <Award size={60} className="mx-auto text-gray-100 mb-6" />
            <h3 className="text-2xl font-black italic text-gray-900 tracking-tight">No Certificates Earned Yet</h3>
            <p className="text-gray-400 font-bold mt-2 italic">Complete your active trainings to unlock your awards.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificatesPage;