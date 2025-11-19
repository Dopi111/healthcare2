import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5001/api';

const Login_U = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/user-auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone_number: phoneNumber,
                    password: password
                })
            });

            const data = await response.json();

            if (data.success) {
                // Store auth data in localStorage
                localStorage.setItem('userToken', 'user-token-' + Date.now());
                localStorage.setItem('userId', data.data.user_id);
                localStorage.setItem('userPhone', data.data.phone_number);
                localStorage.setItem('userName', data.data.full_name);
                localStorage.setItem('userEmail', data.data.email || '');
                localStorage.setItem('userRole', 'Bệnh nhân');

                setMessage('Đăng nhập thành công!');

                // Redirect to home page after 500ms
                setTimeout(() => {
                    navigate('/User/HomePage', { replace: true });
                }, 500);
            } else {
                setMessage(data.message || 'Đăng nhập thất bại!');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Login error:', error);
            setMessage('Lỗi kết nối đến server. Vui lòng thử lại!');
            setIsLoading(false);
        }
    };

    const handleRegister = () => {
        navigate('/User/Register');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Login Card */}
            <div className="w-full max-w-md">
                <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-8">
                    {/* Logo & Title */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 text-purple-600 mb-4">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            HealthCare Portal
                        </h1>
                        <p className="text-sm text-gray-600 mt-2">
                            Đăng nhập vào hệ thống bệnh nhân
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Phone Number */}
                        <div>
                            <label
                                htmlFor="phone_number"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Số điện thoại
                            </label>
                            <input
                                type="tel"
                                id="phone_number"
                                name="phone_number"
                                placeholder="Nhập số điện thoại (10 chữ số)"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                                maxLength={10}
                                pattern="[0-9]{10}"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Mật khẩu
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                            />
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Đang đăng nhập...
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    Đăng nhập
                                </>
                            )}
                        </button>

                        {/* Message */}
                        {message && (
                            <div className={`p-3 rounded-lg text-sm text-center font-medium ${
                                message.includes('thành công')
                                    ? 'bg-green-100 text-green-700 border border-green-300'
                                    : 'bg-red-100 text-red-700 border border-red-300'
                            }`}>
                                {message}
                            </div>
                        )}
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">hoặc</span>
                        </div>
                    </div>

                    {/* Register Button */}
                    <button
                        onClick={handleRegister}
                        className="w-full bg-white text-purple-600 font-semibold py-3 px-4 rounded-lg border-2 border-purple-600 hover:bg-purple-50 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Tạo tài khoản mới
                    </button>

                    {/* Forgot Password */}
                    <div className="text-center mt-4">
                        <a href="#" className="text-sm text-purple-600 hover:text-purple-700 hover:underline">
                            Quên mật khẩu?
                        </a>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-500 mt-6">
                    © 2024 HealthCare. Hệ thống quản lý bệnh viện
                </p>
            </div>
        </div>
    );
};

export default Login_U;
