import Navbar from '@/components/ui/adminNavbar';
import Schedules from '@/components/schedule/manageSchedules';
import { createClient } from '@/utils/supabase/server';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  icons: {
    icon: '/upfavicon.ico',
  },
  description: 'Homepage of the application',
};

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user_id = data.user?.id || '';

  return (
    <>
      <Navbar user_id={user_id} />
      <div className="lg:mt-0 md:mt-12">
        <Schedules />
      </div>
    </>
  );
}
