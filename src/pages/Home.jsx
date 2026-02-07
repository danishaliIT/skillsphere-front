import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button, Card, StatsCard, Skeleton } from '../components/UIComponents';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import API, { getMediaUrl } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import THEME from '../styles/theme';
import { 
  ChevronRight, Zap, Users, Award, Briefcase, 
  PlayCircle, Clock, Target, TrendingUp, CheckCircle2,
  BookOpen, Loader2
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch ALL courses
        const coursesRes = await API.get('courses/');
        setCourses(coursesRes.data); // Show all courses, not just 3
        
        // Fetch trainings - use correct endpoint
        const trainingsRes = await API.get('trainings/programs/');
        setTrainings(trainingsRes.data); // Show all trainings
      } catch (error) {
        console.log('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const joinTraining = async (programId, idx) => {
    try {
      const res = await API.post(`trainings/enroll/${programId}/`);
      // If paid, backend returns action: payment_required
      if (res.data?.action === 'payment_required') {
        alert(res.data.message || 'Payment required to join this training');
      } else {
        // Mark the training locally as joined
        setTrainings(prev => {
          const copy = [...prev];
          if (copy[idx]) copy[idx].joined = true;
          return copy;
        });
        alert(res.data.message || 'Joined training');
      }
    } catch (err) {
      console.error('Error joining training', err);
      alert(err?.response?.data?.error || 'Failed to join training');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* ============= HERO SECTION ============= */}
      <section className="pt-40 pb-24 px-6 bg-gradient-to-br from-blue-50 via-white to-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Headline */}
          <div className="space-y-8 order-2 lg:order-1">
            <div className="space-y-4">
              <span className="inline-block px-6 py-2 bg-blue-100 text-blue-700 text-xs font-black uppercase tracking-[0.4em] rounded-full">
                🚀 Your Career Accelerator
              </span>
              <h1 style={{ fontSize: '3.5rem' }} className="font-black text-gray-900 tracking-tighter italic leading-tight">
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: THEME.gradients.primary }}>
                  MASTER SKILLS.
                </span>
                <br />
                <span className="text-blue-600">GET HIRED.</span>
              </h1>
            </div>

            <p className="text-lg text-gray-600 font-bold leading-relaxed max-w-lg">
              Learn industry-relevant skills through specialized trainings from top companies. Build your portfolio, get certified, and get hired by leading firms.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <Button 
                onClick={() => navigate('/signup')}
                size="lg"
                className="shadow-xl shadow-blue-500/20"
              >
                Start Free Trial
                <ChevronRight size={18} />
              </Button>
              <Button 
                onClick={() => navigate('/catalog')}
                variant="outline"
                size="lg"
              >
                Explore Courses
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-12 flex flex-wrap gap-8">
              <div className="space-y-1">
                <p className="text-3xl font-black text-gray-900 italic">2,000+</p>
                <p className="text-sm text-gray-500 font-bold uppercase tracking-tight">Active Students</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-black text-blue-600 italic">150+</p>
                <p className="text-sm text-gray-500 font-bold uppercase tracking-tight">Course Programs</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-black text-green-600 italic">92%</p>
                <p className="text-sm text-gray-500 font-bold uppercase tracking-tight">Success Rate</p>
              </div>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="order-1 lg:order-2 space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-blue-400/10 rounded-[3rem] blur-3xl"></div>
              <div className="relative bg-white rounded-[3rem] border-2 border-blue-200/30 p-8 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black italic text-gray-900">Featured Course</h3>
                  <span className="px-4 py-2 bg-green-100 text-green-700 text-xs font-black rounded-full">TRENDING</span>
                </div>
                
                <div className="space-y-3">
                  <div className="h-40 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white text-4xl font-black">
                    💻
                  </div>
                  <h4 className="text-xl font-black italic text-gray-900">Complete MERN Stack Masterclass</h4>
                  <p className="text-sm text-gray-600 font-bold">Master modern web development from zero to expert level</p>
                  
                  <div className="flex gap-4 text-sm font-bold text-gray-500 pt-4">
                    <span className="flex items-center gap-1">⏱️ 40 hours</span>
                    <span className="flex items-center gap-1">👥 1,240 students</span>
                    <span className="flex items-center gap-1">⭐ 4.9/5</span>
                  </div>
                </div>

                <Button variant="primary" className="w-full">
                  Enroll Now <PlayCircle size={18} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============= FEATURES SECTION ============= */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-5xl font-black italic text-gray-900 tracking-tighter">Why SkillSphere?</h2>
            <p className="text-gray-600 font-bold max-w-2xl mx-auto">Everything you need to succeed in your career</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Zap className="text-blue-600" />, title: 'Live Training', desc: 'Real-time classes with industry experts' },
              { icon: <Award className="text-green-600" />, title: 'Certifications', desc: 'Recognized credentials on completion' },
              { icon: <Users className="text-purple-600" />, title: 'Community', desc: 'Connect with 2000+ learners globally' },
              { icon: <Briefcase className="text-orange-600" />, title: 'Job Ready', desc: 'Get hired by partner companies' },
            ].map((feature, idx) => (
              <Card key={idx} className="space-y-4 text-center hover:shadow-xl transition-all group hover:-translate-y-2">
                <div className="size-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-black italic text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-600 font-bold">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ============= COURSES SECTION ============= */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-5xl font-black italic text-gray-900 tracking-tighter mb-2">Featured Courses</h2>
              <p className="text-gray-600 font-bold">Learn from industry leaders and experts</p>
            </div>
            <Button onClick={() => navigate('/catalog')} variant="ghost">
              View All {courses.length > 0 && `(${courses.length})`} <ChevronRight size={18} />
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1,2,3].map(i => <Skeleton key={i} height="h-96" />)}
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <div 
                  key={course.id} 
                  className="group cursor-pointer transition-all duration-300 hover:shadow-2xl"
                  onClick={() => navigate(`/course/${course.slug || course.id}`)}
                >
                  {/* LARGE TITLE CARD WITH THUMBNAIL */}
                  <div 
                    className="h-48 rounded-3xl overflow-hidden flex flex-col items-start justify-between p-6 text-white relative group-hover:scale-105 transition-transform bg-cover bg-center"
                    style={{
                      backgroundImage: course.thumbnail 
                        ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${getMediaUrl(course.thumbnail)}')`
                        : 'linear-gradient(135deg, rgb(37, 99, 235), rgb(59, 130, 246))',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {/* TOP RIGHT - CATEGORY & PRICE */}
                    <div className="flex items-center justify-between w-full relative z-10">
                      <span className="text-xs font-black bg-white/20 backdrop-blur text-white px-3 py-1 rounded-full uppercase tracking-tight">
                        {course.category || 'Course'}
                      </span>
                      {course.price && <span className="text-lg font-black text-white">${course.price}</span>}
                    </div>

                    {/* LARGE TITLE */}
                    <h3 className="text-3xl font-black italic leading-tight line-clamp-3 pt-4 relative z-10">
                      {course.title}
                    </h3>
                  </div>

                  {/* CONTENT CARD */}
                  <div className="bg-white border border-gray-200 rounded-3xl rounded-t-none p-6 space-y-4">
                    <p className="text-sm text-gray-600 font-bold line-clamp-3 leading-relaxed">
                      {course.description || 'Master new skills with this comprehensive course'}
                    </p>

                    {/* STATS */}
                    <div className="flex items-center gap-4 text-sm font-bold text-gray-600 border-t border-gray-100 pt-4">
                      <span className="flex items-center gap-1">👥 {Math.floor(Math.random() * 500) + 100} students</span>
                      <span className="flex items-center gap-1">⭐ {(Math.random() * 0.5 + 4.5).toFixed(1)}</span>
                    </div>

                    {/* BUTTON */}
                    <Button 
                      variant="primary" 
                      className="w-full h-12 font-black uppercase tracking-wider rounded-2xl"
                    >
                      Enroll Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-gray-400 font-bold">No courses available yet</p>
            </div>
          )}
        </div>
      </section>

      {/* ============= TRAININGS SECTION ============= */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-5xl font-black italic text-gray-900 tracking-tighter mb-2">Live Training Programs</h2>
              <p className="text-gray-600 font-bold">Interactive sessions conducted by companies</p>
            </div>
            <Button onClick={() => navigate('/catalog')} variant="ghost">
              View All {trainings.length > 0 && `(${trainings.length})`} <ChevronRight size={18} />
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1,2,3].map(i => <Skeleton key={i} height="h-80" />)}
            </div>
          ) : trainings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trainings.map((training, idx) => (
                <Card 
                  key={training.id} 
                  variant="elevated"
                  className="space-y-6 group cursor-pointer hover:border-green-400 transition-all overflow-hidden"
                  onClick={() => navigate('/catalog')}
                >
                  <div className="h-48 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl overflow-hidden flex items-center justify-center text-white text-5xl font-black group-hover:scale-105 transition-transform relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
                      <Briefcase size={48} className="text-white opacity-50" />
                    </div>
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className="text-xs font-black bg-white/90 text-green-700 px-3 py-1 rounded-full uppercase tracking-tight">
                        {training.live_status || 'Upcoming'}
                      </span>
                      <span className="px-2 py-1 bg-white/20 backdrop-blur text-white text-xs font-black rounded-full">Live</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-black italic text-gray-900 leading-tight line-clamp-2">{training.program_name}</h3>
                    <p className="text-xs font-bold text-green-600">By {training.company_name || 'Partner Company'}</p>
                  </div>

                  <p className="text-sm text-gray-600 font-bold line-clamp-3">{training.description || 'Professional training program to enhance your skills'}</p>

                  <div className="space-y-3 border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                      <Clock size={16} className="text-green-600" />
                      <span>{training.duration_hours || 8} hours</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                      <Users size={16} className="text-green-600" />
                      <span>{training.max_participants || 50} slots</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                      <Target size={16} className="text-green-600" />
                      <span>{training.instructor_name || 'Expert Trainer'}</span>
                    </div>
                  </div>

                  {user?.role === 'Student' ? (
                    <Button
                      variant="primary"
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={(e) => { e.stopPropagation(); if (!training.joined) joinTraining(training.id, idx); }}
                    >
                      {training.joined ? 'Joined' : 'Join Training'}
                    </Button>
                  ) : (
                    <Button variant="primary" className="w-full bg-green-600 hover:bg-green-700" onClick={() => navigate('/catalog')}>
                      View
                    </Button>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-gray-400 font-bold">No trainings available yet</p>
            </div>
          )}
        </div>
      </section>

      {/* ============= STATS SECTION ============= */}
      <section className="py-24 px-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
            {[
              { number: '2,000+', label: 'Active Learners' },
              { number: '150+', label: 'Courses & Trainings' },
              { number: '50+', label: 'Company Partners' },
              { number: '92%', label: 'Placement Success' },
            ].map((stat, idx) => (
              <div key={idx} className="space-y-3">
                <p className="text-5xl font-black italic">{stat.number}</p>
                <p className="text-blue-100 font-bold uppercase tracking-tight">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============= CTA SECTION ============= */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-5xl font-black italic text-gray-900 tracking-tighter">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-gray-600 font-bold max-w-2xl mx-auto">
            Join thousands of learners who have successfully upskilled and landed their dream jobs through SkillSphere.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button onClick={() => navigate('/signup')} size="lg" className="shadow-xl shadow-blue-500/20">
              Get Started Today <ChevronRight size={18} />
            </Button>
            <Button onClick={() => navigate('/catalog')} variant="outline" size="lg">
              Explore All Courses
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;