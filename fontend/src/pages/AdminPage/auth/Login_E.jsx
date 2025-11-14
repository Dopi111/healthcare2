import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Sử dụng để điều hướng sau khi đăng nhập

const Login_E = () => {
    const [employeeId, setEmployeeId] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate(); // Khởi tạo hook điều hướng

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const res = await axios.post("http://localhost:5001/api/employee/login", {
                infor_auth_employee_id: employeeId,
                password,
            });

            if (res.data?.token) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('employeeId', res.data.employee.employee_id);
                navigate('/Admin/Dashboard');
            } else {
                setMessage(res.data?.message || 'Login failed');
            }
        } catch (err) {
    setMessage(err.response?.data?.message || err.message || 'Network error');
  }
    };

    // ----------
    // UI
    // ----------//
  return (
    <div>
        <div className="min-h-screen flex items-center justify-center bg-bg-basic">
            <form onSubmit={handleLogin} className="w-80 border border-border-base rounded-md p-2.5">
               {/* Sử dụng H1: Tiêu đề lớn nhất */}
                <h1 variant="h1" className="flex item-center justify-center">Đăng nhập</h1>
                {/* MÃ nhân viên */}
                <div className='mt-4'>
                    <label 
                        htmlFor="employee_id">
                        Mã nhân viên *
                    </label>

                    <input
                        type="text"
                        id="employee_id"
                        name="employee_id"
                        placeholder="0205060710"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                    />

                </div>
                {/* Mật khẩu */}
                <div className='mt-4'>
                    <label 
                        htmlFor="password"
                        >Mật khẩu *
                    </label>
                    
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                </div>
                <div className='flex item-center justify-center mt-4 hove'>
                    
                    <button type="submit" className='btn-primary w-full'>
                        Đăng nhập
                    </button>
                </div>
                <div className="mt-2 text-center">
                    <button
                        type="button"
                        onClick={() => navigate('/Admin/auth/register')}
                        className="text-sm text-primary underline hover:text-secondary"
                    >
                        Chưa có tài khoản? Đăng ký
                    </button>
                </div>
                {message && (
                    <p className="mt-3 text-center text-sm text-red-600">{message}</p>
                )}
            </form>
        </div>
    </div>
  )
}

export default Login_E