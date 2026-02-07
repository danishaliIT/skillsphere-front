import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Lock, Briefcase, Eye, EyeOff, 
  CheckCircle2, XCircle, ShieldCheck, GraduationCap, Building2, AlertTriangle 
} from 'lucide-react';
import { registerUser } from '../api/authService';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Signup = () => {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: { role: 'Student' }
    });
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(''); // Isay dynamic message ke liye use karenge
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const selectedRole = watch("role");
    const password = watch("password", "");

    const validations = {
        hasUpperCase: /[A-Z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasMinLength: password.length >= 8
    };

    const onSubmit = async (data) => {
        setLoading(true);
        setApiError(''); // Reset error
        try {
            await registerUser(data);
            navigate('/verify-otp', { state: { email: data.email } });
        } catch (err) {
            // SPECIFIC ERROR HANDLING LOGIC
            const errorData = err.response?.data;
            
            if (errorData && typeof errorData === 'object') {
                // Agar username ka masla hai
                if (errorData.username) {
                    setApiError(`Username Error: ${errorData.username[0]}`);
                } 
                // Agar email pehle se exist karta hai
                else if (errorData.email) {
                    setApiError(`Email Error: ${errorData.email[0]}`);
                }
                // Agar confirm password backend par fail ho jaye
                else if (errorData.non_field_errors) {
                    setApiError(errorData.non_field_errors[0]);
                }
                else {
                    const firstError = Object.values(errorData)[0];
                    setApiError(Array.isArray(firstError) ? firstError[0] : 'Registration failed.');
                }
            } else {
                setApiError('Something went wrong. Please check your internet.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />
            
            <main className="flex-1 flex items-center justify-center pt-32 pb-20 px-6">
                <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    
                    {/* Left: Branding & Logic Info */}
                    <div className="hidden lg:block space-y-10 sticky top-32">
                        <div className="space-y-4">
                            <h1 className="text-7xl font-black text-gray-900 tracking-tighter italic leading-none">
                                JOIN THE <br /> <span className="text-blue-600">DRAGON.</span>
                            </h1>
                            <p className="text-gray-500 font-bold text-lg max-w-sm italic">
                                Creating accounts for students, instructors, and companies since 2025.
                            </p>
                        </div>

                        <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 space-y-6 shadow-sm">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="text-blue-600" size={24} />
                                <h3 className="font-black italic text-gray-900 uppercase tracking-widest text-sm">Security Rules</h3>
                            </div>
                            <div className="space-y-4">
                                <div className={`flex items-center gap-3 font-bold transition-all ${validations.hasUpperCase ? 'text-green-600' : 'text-gray-400 opacity-50'}`}>
                                    {validations.hasUpperCase ? <CheckCircle2 size={18} /> : <XCircle size={18} />} One Capital Letter
                                </div>
                                <div className={`flex items-center gap-3 font-bold transition-all ${validations.hasNumber ? 'text-green-600' : 'text-gray-400 opacity-50'}`}>
                                    {validations.hasNumber ? <CheckCircle2 size={18} /> : <XCircle size={18} />} One Digital Number
                                </div>
                                <div className={`flex items-center gap-3 font-bold transition-all ${validations.hasMinLength ? 'text-green-600' : 'text-gray-400 opacity-50'}`}>
                                    {validations.hasMinLength ? <CheckCircle2 size={18} /> : <XCircle size={18} />} 8+ Characters
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Signup Form */}
                    <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl shadow-gray-200/40 border border-gray-50">
                        
                        {/* Error Message Display (Dynamic) */}
                        {apiError && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-bounce">
                                <AlertTriangle className="text-red-600 flex-shrink-0" size={20} />
                                <p className="text-red-700 text-xs font-black uppercase italic tracking-tight">{apiError}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Role Picker */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 italic">Choose Your Role</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { id: 'Student', icon: GraduationCap },
                                        { id: 'Instructor', icon: User },
                                        { id: 'Company', icon: Building2 }
                                    ].map((role) => (
                                        <button
                                            key={role.id}
                                            type="button"
                                            onClick={() => setValue('role', role.id)}
                                            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                                                selectedRole === role.id 
                                                ? 'border-blue-600 bg-blue-50 text-blue-600 scale-105' 
                                                : 'border-gray-50 bg-gray-50 text-gray-400 opacity-60'
                                            }`}
                                        >
                                            <role.icon size={20} />
                                            <span className="text-[10px] font-black uppercase">{role.id}</span>
                                        </button>
                                    ))}
                                </div>
                                <input type="hidden" {...register("role")} />
                            </div>

                            {/* Credentials */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                    <input {...register("username", { required: "Username required" })} placeholder="Username" className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold border-none italic" />
                                </div>
                                <div className="relative">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                    <input {...register("email", { required: "Email required" })} placeholder="Email Address" className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold border-none italic" />
                                </div>
                            </div>

                            {/* Passwords */}
                            <div className="space-y-4">
                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                    <input 
                                        {...register("password", { required: true })} 
                                        type={showPassword ? "text" : "password"} 
                                        placeholder="Create Password" 
                                        className="w-full pl-12 pr-12 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold border-none italic" 
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300">
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>

                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                    <input 
                                        {...register("password_confirm", { 
                                            required: "Confirm your password",
                                            validate: (val) => val === watch('password') || "Passwords mismatch"
                                        })} 
                                        type="password" 
                                        placeholder="Confirm Password" 
                                        className={`w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 font-bold border-none transition-all italic ${errors.password_confirm ? 'ring-2 ring-red-500 bg-red-50' : 'focus:ring-blue-600'}`} 
                                    />
                                    {errors.password_confirm && <p className="text-[9px] text-red-500 font-black uppercase mt-2 ml-2 tracking-widest">{errors.password_confirm.message}</p>}
                                </div>
                            </div>

                            <button 
                                disabled={loading}
                                className="w-full py-6 bg-gray-900 text-white rounded-[2rem] font-black text-xl hover:bg-blue-600 transition-all shadow-xl shadow-gray-200 italic disabled:opacity-50"
                            >
                                {loading ? "Launching Account..." : "Create Dragon Profile"}
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Signup;