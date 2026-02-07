import API from './axios';

export const registerUser = async (userData) => {
    return await API.post('auth/register/', userData);
};

export const verifyOTP = async (otpData) => {
    return await API.post('auth/verify-otp/', otpData);
};

export const loginUser = async (credentials) => {
    return await API.post('auth/login/', credentials);
};

export const resendOTP = async (email) => {
    return await API.post('auth/resend-otp/', { email });
};