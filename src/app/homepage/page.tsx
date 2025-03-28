import Navbar from '@/components/ui/navbar';
import WelcomeBanner from './components/welcome';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <WelcomeBanner username="Celeru00" />
    </>
  );
}
