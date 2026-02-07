import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  Mail, Lock, ArrowRight, Eye, EyeOff, 
  ShieldCheck, Chrome, LogIn 
} from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await login({ email, password });
            
            // Role based redirection
            if (response.role === 'Instructor') {
                navigate('/instructor/dashboard');
            } else if (response.role === 'Company') {
                navigate('/company/dashboard');
            } else {
                navigate('/dashboard/home');
            }
        } catch (err) {
            setError(err.response?.data?.detail || "Invalid credentials or unverified email.");
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />
            
            <main className="flex-1 flex items-center justify-center pt-32 pb-20 px-6">
                <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    
                    {/* Left Side: Motivational Branding */}
                    <div className="hidden lg:block space-y-8">
                        <span className="px-6 py-2 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.4em] rounded-full">
                            Secure Access
                        </span>
                        <h1 className="text-7xl font-black text-gray-900 tracking-tighter italic leading-none">
                            RESUME YOUR <br /> <span className="text-blue-600">MISSION.</span>
                        </h1>
                        <p className="text-gray-500 font-bold text-lg max-w-md italic leading-relaxed">
                            Sign in to access your specialized trainings and recruitment dashboard.
                        </p>
                        
                        <div className="pt-10 flex items-center gap-6">
                            <div className="flex -space-x-4">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="size-12 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center font-black text-xs">
                                        {i}
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm font-black italic text-gray-900 tracking-tight">
                                Joined by 2,000+ professionals from Lodhran and beyond.
                            </p>
                        </div>
                    </div>

                    {/* Right Side: Login Form */}
                    <div className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-2xl shadow-gray-200/50 border border-gray-50">
                        <div className="mb-10 text-center lg:text-left">
                            <h2 className="text-4xl font-black text-gray-900 italic tracking-tight italic">Welcome Back</h2>
                            <p className="text-gray-400 font-bold mt-2 italic uppercase text-[10px] tracking-widest">
                                Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign up for free</Link>
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-5 rounded-2xl mb-8 flex items-center gap-3 border border-red-100 font-bold text-xs italic">
                                <ShieldCheck size={18} /> {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email Input */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Email Identity</label>
                                <div className="relative">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                                    <input 
                                        type="email" 
                                        required 
                                        placeholder="name@example.com"
                                        className="w-full pl-14 pr-6 py-5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all border-none italic"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Secure Key</label>
                                    <Link to="/forgot-password" className="text-[10px] font-black text-blue-600 hover:underline uppercase tracking-widest">Recovery?</Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        required 
                                        placeholder="••••••••"
                                        className="w-full pl-14 pr-14 py-5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all border-none"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-blue-600"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <button className="w-full py-6 bg-gray-900 text-white rounded-[2rem] font-black text-xl hover:bg-blue-600 transition-all shadow-2xl shadow-gray-200 mt-4 flex items-center justify-center gap-3 group italic">
                                Sign In <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>

                        <div className="relative flex items-center gap-4 py-10">
                            <div className="flex-1 h-px bg-gray-100"></div>
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Fast Auth</span>
                            <div className="flex-1 h-px bg-gray-100"></div>
                        </div>

                        {/* Social Login Buttons */}
                        <div className="space-y-4">
                            <button className="w-full py-4 px-6 border-2 border-gray-50 rounded-2xl flex items-center justify-center gap-4 font-black text-gray-900 hover:bg-gray-50 transition-all italic text-sm">
                                <Chrome className="text-blue-600" size={20} /> Login with Google
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Login;