import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API, { getMediaUrl } from '../api/axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import THEME from '../styles/theme';
import {
  Star, Users, Clock, Award, ChevronRight, Heart,
  Share2, Download, MessageCircle, Loader2, BookOpen,
  CheckCircle, Play, FileText
} from 'lucide-react';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // Try fetching by ID first, then by slug
        const res = await API.get(`courses/${courseId}/`);
        setCourse(res.data);
      } catch (err) {
        console.error('Failed to load course:', err);
        // If ID doesn't work, try using it as a slug
        try {
          const slugRes = await API.get(`courses/?slug=${courseId}`);
          if (slugRes.data && slugRes.data.length > 0) {
            setCourse(slugRes.data[0]);
          }
        } catch (slugErr) {
          console.error('Failed to load course by slug:', slugErr);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  const handleEnroll = async () => {
    try {
      const res = await API.post('courses/enroll/', { course_id: courseId });
      alert(res.data.message || 'Successfully enrolled!');
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Enrollment failed.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center py-40">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center py-40">
          <p className="text-gray-400 text-lg font-bold">Course not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-20 pb-20">
        {/* HERO SECTION */}
        <div className="relative h-96 bg-cover bg-center overflow-hidden" style={{
          backgroundImage: course.thumbnail
            ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${getMediaUrl(course.thumbnail)}')`
            : `linear-gradient(135deg, rgb(37, 99, 235), rgb(59, 130, 246))`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-7xl mx-auto w-full px-6 pb-12">
              <div className="flex items-start justify-between">
                <div className="space-y-4 flex-1">
                  <span className="inline-block px-4 py-2 bg-blue-600 text-white text-xs font-black rounded-full uppercase tracking-widest">
                    {course.category || 'Course'}
                  </span>
                  <h1 className="text-5xl font-black italic text-white leading-tight max-w-3xl">
                    {course.title}
                  </h1>
                  <div className="flex items-center gap-6 pt-4 text-white">
                    <div className="flex items-center gap-2">
                      <Star size={20} className="fill-yellow-400 text-yellow-400" />
                      <span className="font-bold">4.9 (250 reviews)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={20} />
                      <span className="font-bold">5,234 students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={20} />
                      <span className="font-bold">40 hours</span>
                    </div>
                  </div>
                </div>

                {/* SIDEBAR - PRICE & BUTTONS */}
                <div className="bg-white rounded-2xl shadow-xl p-8 w-96 ml-8 space-y-6">
                  <div>
                    <p className="text-gray-500 text-sm font-bold">Price</p>
                    <p className="text-4xl font-black text-gray-900">${course.price}</p>
                  </div>

                  <button
                    onClick={handleEnroll}
                    className="w-full py-4 rounded-xl font-black uppercase text-white text-sm tracking-widest shadow-lg hover:shadow-xl transition-all"
                    style={{ background: THEME.gradients.primary }}
                  >
                    Enroll Now
                  </button>

                  <button className="w-full py-3 rounded-xl border-2 border-gray-200 font-black text-gray-700 text-sm uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                    <Heart size={18} />
                    Save Course
                  </button>

                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <button className="flex-1 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center gap-2 text-gray-700 font-bold transition-all">
                      <Share2 size={18} />
                      Share
                    </button>
                    <button className="flex-1 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center gap-2 text-gray-700 font-bold transition-all">
                      <Download size={18} />
                      Save
                    </button>
                  </div>

                  {/* INSTRUCTOR */}
                  <div className="pt-4 border-t border-gray-200 space-y-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Instructor</p>
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-black">
                        {course.lead_instructor_name?.[0] || 'I'}
                      </div>
                      <div>
                        <p className="font-black text-gray-900">{course.lead_instructor_name || 'Instructor'}</p>
                        <p className="text-xs text-gray-500 font-bold">Expert Instructor</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="border-b border-gray-200 sticky top-20 bg-white z-40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex gap-8">
              {[
                { id: 'overview', label: 'Overview', icon: <BookOpen size={18} /> },
                { id: 'curriculum', label: 'Curriculum', icon: <FileText size={18} /> },
                { id: 'reviews', label: 'Reviews', icon: <MessageCircle size={18} /> },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-black text-sm uppercase tracking-widest transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-12">
                {/* ABOUT */}
                <section className="space-y-4">
                  <h2 className="text-3xl font-black italic text-gray-900">About this course</h2>
                  <p className="text-gray-600 font-medium leading-relaxed text-lg">
                    {course.description}
                  </p>
                </section>

                {/* WHAT YOU'LL LEARN */}
                <section className="space-y-6">
                  <h2 className="text-3xl font-black italic text-gray-900">What you'll learn</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      'Master core concepts from scratch',
                      'Build real-world projects',
                      'Industry best practices',
                      'Career-ready skills',
                      'Lifetime access to materials',
                      'Certificate of completion'
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                        <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                        <p className="font-bold text-gray-900">{item}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* REQUIREMENTS */}
                <section className="space-y-4">
                  <h2 className="text-3xl font-black italic text-gray-900">Requirements</h2>
                  <ul className="space-y-2 text-gray-600 font-medium">
                    <li className="flex items-center gap-2">
                      <span className="text-blue-600">•</span>
                      Basic programming knowledge (preferred)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-600">•</span>
                      Laptop with internet connection
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-600">•</span>
                      Willingness to learn and practice
                    </li>
                  </ul>
                </section>
              </div>

              {/* COURSE HIGHLIGHTS - SIDEBAR */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6 space-y-4 border border-gray-200">
                  <h3 className="font-black text-lg text-gray-900">Course Highlights</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Clock className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase">Duration</p>
                        <p className="font-black text-gray-900">40 hours</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-lg bg-green-100 flex items-center justify-center">
                        <Award className="text-green-600" size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase">Certificate</p>
                        <p className="font-black text-gray-900">Included</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Users className="text-purple-600" size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase">Students</p>
                        <p className="font-black text-gray-900">5,234+</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CALL TO ACTION */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 space-y-4 text-center">
                  <p className="font-black text-gray-900">Ready to start learning?</p>
                  <button
                    onClick={handleEnroll}
                    className="w-full py-3 rounded-xl font-black uppercase text-white text-sm tracking-widest shadow-lg"
                    style={{ background: THEME.gradients.primary }}
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CURRICULUM TAB */}
          {activeTab === 'curriculum' && (
            <div className="space-y-4">
              <h2 className="text-3xl font-black italic text-gray-900 mb-8">Course Curriculum</h2>
              {course.modules && course.modules.length > 0 ? (
                course.modules.map((module, idx) => (
                  <details key={idx} className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all">
                    <summary className="cursor-pointer bg-gray-50 p-6 flex items-center justify-between hover:bg-gray-100 transition-all">
                      <div className="flex items-center gap-4">
                        <span className="font-black text-gray-500 text-lg">Module {idx + 1}</span>
                        <h3 className="font-black text-gray-900">{module.title}</h3>
                      </div>
                      <ChevronRight className="group-open:rotate-90 transition-transform text-gray-500" size={24} />
                    </summary>
                    <div className="p-6 bg-white space-y-3">
                      {module.weeks && module.weeks.map((week, widx) => (
                        <div key={widx} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-all">
                          <Play className="text-blue-600 flex-shrink-0 mt-1" size={16} />
                          <div>
                            <p className="font-bold text-gray-900">{week.title}</p>
                            <p className="text-xs text-gray-500 font-bold">{week.lessons?.length || 0} lessons</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>
                ))
              ) : (
                <p className="text-gray-400 font-bold text-center py-12">Curriculum coming soon</p>
              )}
            </div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === 'reviews' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-black italic text-gray-900">Student Reviews</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
                {/* RATING SUMMARY */}
                <div className="bg-gray-50 rounded-2xl p-8 space-y-6 border border-gray-200 h-fit sticky top-28">
                  <div className="text-center space-y-2">
                    <p className="text-5xl font-black text-gray-900">4.9</p>
                    <div className="flex justify-center gap-1">
                      {[1, 2, 3, 4, 5].map(i => <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />)}
                    </div>
                    <p className="text-sm text-gray-500 font-bold">Based on 250 reviews</p>
                  </div>

                  <div className="space-y-3 pt-4">
                    {[5, 4, 3, 2, 1].map(rating => (
                      <div key={rating} className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-500 w-8">{rating}★</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-400" 
                            style={{ width: `${90 - rating * 5}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold text-gray-500 w-8 text-right">{90 - rating * 5}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* REVIEWS LIST */}
                <div className="md:col-span-2 space-y-4">
                  {course.reviews && course.reviews.length > 0 ? (
                    course.reviews.map((review, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black">
                              {review.user_name?.[0] || 'U'}
                            </div>
                            <div>
                              <p className="font-black text-gray-900">{review.user_name}</p>
                              <div className="flex gap-1">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 font-bold">{review.created_at}</p>
                        </div>
                        <p className="text-gray-600 font-medium">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 font-bold text-center py-12">No reviews yet</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CourseDetail;
