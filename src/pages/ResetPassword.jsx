import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || "";
    
    const [formData, setFormData] = useState({ otp_code: '', new_password: '' });

  const handleReset = async (e) => {
    e.preventDefault();
    try {
        // Ensure karein ke keys yehi hain: email, otp_code, new_password
        await API.post('auth/password-reset-confirm/', { 
            email: email, 
            otp_code: formData.otp_code, 
            new_password: formData.new_password 
        });
        alert("Success!");
        navigate('/login');
    } catch (err) {
        console.log(err.response.data);
    }
};

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">Set New Password</h2>
                <form onSubmit={handleReset} className="space-y-4">
                    <input 
                        type="text" placeholder="6-digit OTP" required
                        className="w-full p-4 bg-gray-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setFormData({...formData, otp_code: e.target.value})}
                    />
                    <input 
                        type="password" placeholder="New Password" required
                        className="w-full p-4 bg-gray-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setFormData({...formData, new_password: e.target.value})}
                    />
                    <button className="w-full py-4 bg-black text-white rounded-xl font-bold hover:opacity-90">
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;