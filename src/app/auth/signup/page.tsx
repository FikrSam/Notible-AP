// @/app/auth/signup/page.tsx

import { SignUpForm } from '@/components/signup-form';

const SignUp = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <SignUpForm className="w-full" style={{ maxWidth: '340px' }} />
    </div>
  );
};

export default SignUp;
