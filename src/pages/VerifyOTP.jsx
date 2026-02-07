import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { verifyOTP, resendOTP } from '../api/authService';

const VerifyOTP = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || "";
    const [otp, setOtp] = useState("");

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            await verifyOTP({ email, otp_code: otp });
            alert("Verification Successful! You can now login.");
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.error || "Invalid OTP");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center">
                <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
                <p className="text-gray-500 mb-6">Enter the 6-digit code sent to <b>{email}</b></p>
                
                <form onSubmit={handleVerify} className="space-y-4">
                    <input 
                        type="text" maxLength="6" placeholder="000000"
                        className="w-full text-center text-3xl tracking-[1rem] py-4 border rounded-xl"
                        value={otp} onChange={(e) => setOtp(e.target.value)}
                    />
                    <button className="w-full bg-black text-white py-3 rounded-xl font-bold">
                        Verify OTP
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VerifyOTP;