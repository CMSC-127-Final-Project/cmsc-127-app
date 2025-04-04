'use client'; // ✅ Mark this as a client component

import LoginPage from '@/components/login/loginForm';
import { useUser } from '@/components/homepage/UserContext';
import { metadata } from './metadata'; // ✅ Import metadata from separate file

export default function Page() {
  const { setUser } = useUser();
  const handleLogin = async (credentials: { username: string; password: string }) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser({ firstName: userData.firstName, studentNumber: userData.studentNumber });

        console.log('User updated:', userData); // ✅ Debugging step
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return <LoginPage onLogin={handleLogin} />;
}
