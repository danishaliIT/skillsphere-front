import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import THEME from '../styles/theme';
import {
  Facebook, Twitter, Linkedin, Github, Mail, Phone, MapPin,
  Heart, Send, Shield, Lock, Eye, HelpCircle, FileText,
  CreditCard, Smartphone, Globe, Users, BookOpen
} from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();
  const [newsletter, setNewsletter] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletter) {
      setSubscribed(true);
      setTimeout(() => {
        setNewsletter('');
        setSubscribed(false);
      }, 3000);
    }
  };

  const links = {
    Learning: [
      { label: 'Browse Courses', href: '/catalog' },
      { label: 'Live Trainings', href: '/trainings' },
      { label: 'Career Paths', href: '#' },
      { label: 'Certifications', href: '#' },
      { label: 'Success Stories', href: '#' },
    ],
    'For Teachers': [
      { label: 'Become an Instructor', href: '#' },
      { label: 'Instructor Hub', href: '#' },
      { label: 'Teaching Tools', href: '#' },
      { label: 'Revenue Share', href: '#' },
      { label: 'Partner Program', href: '#' },
    ],
    'For Companies': [
      { label: 'Company Hub', href: '#' },
      { label: 'Team Training', href: '#' },
      { label: 'Bulk Licensing', href: '#' },
      { label: 'Custom Learning', href: '#' },
      { label: 'Analytics', href: '#' },
    ],
    Support: [
      { label: 'Help Center', href: '#' },
      { label: 'Contact Us', href: '#' },
      { label: 'Knowledge Base', href: '#' },
      { label: 'Feedback', href: '#' },
      { label: 'Status Page', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: <Facebook size={20} />, href: '#', label: 'Facebook' },
    { icon: <Twitter size={20} />, href: '#', label: 'Twitter' },
    { icon: <Linkedin size={20} />, href: '#', label: 'LinkedIn' },
    { icon: <Github size={20} />, href: '#', label: 'GitHub' },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', icon: <Eye size={14} /> },
    { label: 'Terms of Service', icon: <FileText size={14} /> },
    { label: 'Cookies Policy', icon: <Shield size={14} /> },
    { label: 'Security', icon: <Lock size={14} /> },
  ];

  const paymentMethods = [
    { name: 'Visa', color: '#1A1F71' },
    { name: 'Mastercard', color: '#EB001B' },
    { name: 'PayPal', color: '#003087' },
    { name: 'Apple Pay', color: '#000000' },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white pt-20 pb-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* TOP SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 pb-12 border-b border-gray-800">
          
          {/* COMPANY INFO & SOCIAL */}
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-6">
              <div style={{ background: THEME.gradients.primary }} className="size-12 rounded-xl flex items-center justify-center font-black italic text-lg shadow-lg">
                S
              </div>
              <div>
                <h3 className="text-2xl font-black italic">SkillSphere</h3>
                <p className="text-xs text-gray-400 font-bold">Empowering Global Talent</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm leading-relaxed mb-6 font-medium">
              SkillSphere is a premier online learning platform dedicated to transforming careers and enabling individuals to master in-demand skills through high-quality courses, certifications, and training programs.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 mb-8">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Follow Us:</span>
              <div className="flex gap-3">
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    className="p-3 bg-gray-800 hover:bg-blue-600 rounded-lg transition-all text-gray-300 hover:text-white"
                    title={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
              <div className="flex text-yellow-400 text-lg">⭐⭐⭐⭐⭐</div>
              <div>
                <p className="text-sm font-black">4.9/5 Rating</p>
                <p className="text-xs text-gray-400">From 50,000+ learners</p>
              </div>
            </div>
          </div>

          {/* NEWSLETTER */}
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-2xl p-8">
            <h3 className="text-xl font-black italic mb-2">Stay Updated</h3>
            <p className="text-sm text-gray-300 mb-6 font-medium">Get the latest courses, tips, and career advice delivered to your inbox.</p>
            
            <form onSubmit={handleSubscribe}>
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={newsletter}
                  onChange={(e) => setNewsletter(e.target.value)}
                  required
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 text-white placeholder-gray-500 font-bold transition-all"
                />
                <button
                  type="submit"
                  style={{ background: THEME.gradients.primary }}
                  className="px-6 py-3 font-black text-sm uppercase tracking-widest rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Send size={16} />
                  Subscribe
                </button>
              </div>
              {subscribed && (
                <p className="text-xs text-green-400 font-bold flex items-center gap-2">
                  ✓ Thanks for subscribing!
                </p>
              )}
            </form>

            {/* CTA Button */}
            <button
              onClick={() => navigate('/signup')}
              className="w-full mt-6 px-4 py-3 bg-white text-blue-600 font-black uppercase text-xs tracking-widest rounded-xl hover:shadow-lg hover:shadow-white/20 transition-all"
            >
              Start Learning Today
            </button>
          </div>
        </div>

        {/* LINKS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-16 pb-12 border-b border-gray-800">
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                {category === 'Learning' && <BookOpen size={16} className="text-blue-500" />}
                {category === 'For Teachers' && <Users size={16} className="text-purple-500" />}
                {category === 'For Companies' && <Globe size={16} className="text-green-500" />}
                {category === 'Support' && <HelpCircle size={16} className="text-orange-500" />}
                {category}
              </h4>
              <ul className="space-y-3">
                {items.map((item, idx) => (
                  <li key={idx}>
                    <a
                      href={item.href}
                      className="text-sm text-gray-400 hover:text-white transition-all font-medium hover:translate-x-1 inline-block"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* MIDDLE SECTION - FEATURES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-16 pb-12 border-b border-gray-800">
          <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all">
            <Lock size={24} className="text-blue-500 mb-3" />
            <h4 className="font-black text-sm mb-2">Secure & Safe</h4>
            <p className="text-xs text-gray-400 font-medium">Your data is protected with enterprise-grade security</p>
          </div>

          <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700 hover:border-green-500/50 transition-all">
            <Smartphone size={24} className="text-green-500 mb-3" />
            <h4 className="font-black text-sm mb-2">Learn Anywhere</h4>
            <p className="text-xs text-gray-400 font-medium">Access courses on any device, anytime</p>
          </div>

          <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all">
            <Shield size={24} className="text-purple-500 mb-3" />
            <h4 className="font-black text-sm mb-2">Verified Certs</h4>
            <p className="text-xs text-gray-400 font-medium">Industry-recognized certificates</p>
          </div>

          <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700 hover:border-orange-500/50 transition-all">
            <Users size={24} className="text-orange-500 mb-3" />
            <h4 className="font-black text-sm mb-2">Expert Teachers</h4>
            <p className="text-xs text-gray-400 font-medium">Learn from industry professionals</p>
          </div>
        </div>

        {/* CONTACT & PAYMENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 pb-12 border-b border-gray-800">
          {/* CONTACT */}
          <div>
            <h3 className="font-black text-lg mb-6 flex items-center gap-2">
              <Mail size={20} className="text-blue-500" />
              Get in Touch
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold">Our Office</p>
                  <p className="text-xs text-gray-400 font-medium">Lodhran, Punjab, Pakistan</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={20} className="text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold">Email</p>
                  <a href="mailto:info@skillsphere.com" className="text-xs text-blue-400 hover:text-blue-300 font-medium">
                    info@skillsphere.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={20} className="text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold">Phone</p>
                  <a href="tel:+923001234567" className="text-xs text-blue-400 hover:text-blue-300 font-medium">
                    +92 (300) 123-4567
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* PAYMENT METHODS */}
          <div>
            <h3 className="font-black text-lg mb-6 flex items-center gap-2">
              <CreditCard size={20} className="text-blue-500" />
              We Accept
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {paymentMethods.map((method, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-gray-800 rounded-xl border border-gray-700 flex items-center justify-center cursor-pointer hover:border-blue-500/50 transition-all"
                  style={{ borderColor: method.color + '40' }}
                >
                  <div 
                    className="w-12 h-8 rounded flex items-center justify-center font-black text-xs"
                    style={{ backgroundColor: method.color + '20', color: method.color }}
                  >
                    {method.name}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 font-medium">Secure payments processed by industry-leading providers</p>
          </div>
        </div>

        {/* LEGAL & BOTTOM */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* LEGAL LINKS */}
          <div className="flex flex-wrap justify-center md:justify-start gap-6">
            {legalLinks.map((link, idx) => (
              <a
                key={idx}
                href="#"
                className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-all group"
              >
                <span className="text-blue-500 group-hover:text-blue-400">{link.icon}</span>
                {link.label}
              </a>
            ))}
          </div>

          {/* COPYRIGHT */}
          <div className="text-center md:text-right">
            <p className="text-xs text-gray-500 font-bold flex items-center justify-center md:justify-end gap-1">
              Made with <Heart size={14} className="text-red-500 fill-red-500" /> by SkillSphere
            </p>
            <p className="text-xs text-gray-600 font-bold">© 2024 SkillSphere. All rights reserved.</p>
          </div>
        </div>

        {/* SCROLL TO TOP */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all opacity-0 hover:opacity-100"
          style={{ opacity: window.scrollY > 300 ? 1 : 0, pointerEvents: window.scrollY > 300 ? 'auto' : 'none' }}
        >
          ↑
        </button>
      </div>
    </footer>
  );
};

export default Footer;