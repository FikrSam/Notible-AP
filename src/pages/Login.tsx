// @/pages/Login.tsx

import { LoginForm } from '@/components/login-form';

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <LoginForm className="w-full" style={{ maxWidth: '340px' }} />
    </div>
  );
};

export default Login;
