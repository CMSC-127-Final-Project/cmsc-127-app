import Index from '@/components/index';
import { cookies } from 'next/headers';

export default async function Home() {
  const cookieStore = await cookies();
  const access_token = cookieStore.get('access_token')?.value;

  if (!access_token) {
    console.log('No access token found, redirecting to login...');
    return (
      <div>
        <Index action={''}/>
      </div>
    );
  } else {
    return (
      <div>
        <Index action={'access_token'}/>
      </div>
    );
  }
}
