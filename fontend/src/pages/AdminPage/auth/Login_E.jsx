import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AccountService from '../../../services/AccountService';

const Login_E = () => {
    const [employeeId, setEmployeeId] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [demoAccounts, setDemoAccounts] = useState([]);
    const navigate = useNavigate();

    // Initialize accounts and load demo list
    useEffect(() => {
        AccountService.initializeAccounts();
        const accounts = AccountService.getAllAccounts();
        // Show only first 3 accounts for demo
        setDemoAccounts(accounts.slice(0, 3));
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsLoading(true);

        // Simulate API delay
        setTimeout(() => {
            // Authenticate using AccountService
            const result = AccountService.authenticate(employeeId, password);

            if (result.success) {
                const account = result.account;

                // Store auth data in localStorage
                localStorage.setItem('token', 'static-token-' + Date.now());
                localStorage.setItem('employeeId', account.employeeId);
                localStorage.setItem('employeeName', account.name);
                localStorage.setItem('department', account.department);
                localStorage.setItem('role', account.role);

                setMessage('Đăng nhập thành công!');

                // Redirect to dashboard after 500ms
                setTimeout(() => {
                    navigate('/Admin/Dashboard');
                }, 500);
            } else {
                setMessage(result.message);
                setIsLoading(false);
            }
        }, 800);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-admin-bg-light)]">
            {/* Login Card */}
            <div className="w-full max-w-md">
                <div className="bg-[var(--color-admin-card-light)] rounded-xl shadow-lg border border-[var(--color-admin-border-light)] p-8">
                    {/* Logo & Title */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="size-16 text-[var(--color-admin-primary)] mb-4">
                            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path>
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-[var(--color-admin-text-light-primary)]">
                            HealthCare Admin
                        </h1>
                        <p className="text-sm text-[var(--color-admin-text-light-secondary)] mt-2">
                            Đăng nhập vào hệ thống quản trị
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Employee ID */}
                        <div>
                            <label
                                htmlFor="employee_id"
                                className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2"
                            >
                                Mã nhân viên
                            </label>
                            <input
                                type="text"
                                id="employee_id"
                                name="employee_id"
                                placeholder="Nhập mã nhân viên"
                                value={employeeId}
                                onChange={(e) => setEmployeeId(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-[var(--color-admin-border-light)] bg-white text-[var(--color-admin-text-light-primary)] placeholder:text-[var(--color-admin-text-light-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-transparent"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-[var(--color-admin-text-light-primary)] mb-2"
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
                                className="w-full px-4 py-3 rounded-lg border border-[var(--color-admin-border-light)] bg-white text-[var(--color-admin-text-light-primary)] placeholder:text-[var(--color-admin-text-light-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-transparent"
                            />
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[var(--color-admin-primary)] text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin">refresh</span>
                                    Đang đăng nhập...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">login</span>
                                    Đăng nhập
                                </>
                            )}
                        </button>

                        {/* Message */}
                        {message && (
                            <div className={`p-3 rounded-lg text-sm text-center ${
                                message.includes('thành công')
                                    ? 'bg-[var(--color-admin-success)]/10 text-[var(--color-admin-success)]'
                                    : 'bg-[var(--color-admin-danger)]/10 text-[var(--color-admin-danger)]'
                            }`}>
                                {message}
                            </div>
                        )}
                    </form>

                    {/* Demo Accounts Info */}
                    <div className="mt-6 p-4 bg-[var(--color-admin-bg-light)] rounded-lg">
                        <p className="text-xs font-semibold text-[var(--color-admin-text-light-primary)] mb-2">
                            Tài khoản demo:
                        </p>
                        <div className="space-y-1 text-xs text-[var(--color-admin-text-light-secondary)]">
                            {demoAccounts.map((acc, idx) => (
                                <p key={idx}>
                                    • {acc.name}: <code className="bg-white px-2 py-0.5 rounded">{acc.employeeId}</code> / <code className="bg-white px-2 py-0.5 rounded">{acc.password}</code>
                                </p>
                            ))}
                        </div>
                        <p className="text-xs text-[var(--color-admin-text-light-secondary)] mt-2 italic">
                            💡 Admin có thể thêm/sửa/xóa tài khoản tại "Quản lý tài khoản"
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-[var(--color-admin-text-light-secondary)] mt-6">
                    © 2024 HealthCare. Phiên bản demo - Không kết nối database
                </p>
            </div>
        </div>
    );
};

export default Login_E;
