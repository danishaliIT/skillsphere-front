import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { Mail, ArrowRight } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('auth/password-reset-request/', { email });
            // Email state mein pass karein taake agle page par kaam aaye
            navigate('/reset-password', { state: { email } });
        } catch (err) {
            alert(err.response?.data?.error || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <h2 className="text-3xl font-black text-gray-900 mb-2">Forgot Password?</h2>
                <p className="text-gray-500 mb-8">No worries! Enter your email and we'll send you an OTP.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                        <input 
                            type="email" required placeholder="Email Address"
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <button disabled={loading} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all">
                        {loading ? "Sending..." : "Send Reset Code"} <ArrowRight className="size-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;