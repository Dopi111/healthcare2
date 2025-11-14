import Typography from '@/components/ui/Typography.jsx';
import Label from '@/components/ui/label.jsx';
import Input from '@/components/ui/input.jsx';
import Button from '@/components/ui/button.jsx';
import { useNavigate } from 'react-router-dom';

const Login_U = () => {
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        // TẠM THỜI ĐIỀU HƯỚNG TĨNH
        navigate('/', { replace: true });

        // Gợi ý sau này: gọi API xác thực user
        // const phone = event.target.elements.phone_number.value;
        // const password = event.target.elements.password.value;
        // console.log("Đăng nhập user:", phone, password);
    };

    const handleRegister = () => {
        // Điều hướng đến trang đăng ký người dùng
        navigate('/User/Register');
    };

    return (
        <div>
            <div className="min-h-screen flex items-center justify-center bg-bg-basic">
                <form onSubmit={handleSubmit} className="w-80 border border-border-base rounded-md p-2.5">
                    <Typography variant="h1" className="flex item-center justify-center">
                        Đăng nhập
                    </Typography>

                    {/* Số điện thoại */}
                    <div className='mt-4'>
                        <Label htmlFor="phone_number">
                            Số điện thoại *
                        </Label>

                        <Input 
                            type="text" 
                            id="phone_number" 
                            name="phone_number" 
                            placeholder="0987654321"
                        />
                    </div>

                    {/* Mật khẩu */}
                    <div className='mt-4'>
                        <Label htmlFor="password">
                            Mật khẩu *
                        </Label>

                        <Input 
                            type="password" 
                            id="password" 
                            name="password" 
                        />
                    </div>

                    {/* Nút đăng nhập */}
                    <div className='flex item-center justify-center mt-4'>
                        <Button 
                            type="submit"
                            className='w-full hover:bg-purple-400'>
                            Đăng nhập
                        </Button>
                    </div>

                    {/* Liên kết đăng ký */}
                    <div className='flex items-center justify-center mt-3'>
                        <Typography variant="body2">
                            Chưa có tài khoản?{' '}
                            <span 
                                onClick={handleRegister} 
                                className='text-purple-600 hover:text-purple-400 cursor-pointer font-medium'>
                                Đăng ký ngay
                            </span>
                        </Typography>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login_U;
