import Index from '@/components/index';
import { createClient } from '@/utils/supabase/server';

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data) {
    return (
      <div>
        <Index action={true} />
      </div>
    );
  } else {
    return (
      <div>
        <Index action={false} />
      </div>
    );
  }
}
