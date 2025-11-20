import Button from '@/components/ui/button.jsx';
import Typography from '@/components/ui/Typography.jsx';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const goDoctorLogin = () => {
    navigate('/Admin/auth/Login'); // hoặc đường dẫn bạn muốn
  };

  const goPatientLogin = () => {
    navigate('/User/Login'); // đổi sang route login patient của bạn
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-basic">
      <div className="w-80 border border-border-base rounded-md p-4 flex flex-col gap-4">
        
        <Typography variant="h1" className="text-center">
          Select Role
        </Typography>

        <Button 
          className="w-full hover:bg-purple-400"
          onClick={goDoctorLogin}
        >
          I'm Doctor
        </Button>

        <Button 
          className="w-full hover:bg-purple-400"
          onClick={goPatientLogin}
        >
          I'm Patient
        </Button>

      </div>
    </div>
  );
};

export default Login;
