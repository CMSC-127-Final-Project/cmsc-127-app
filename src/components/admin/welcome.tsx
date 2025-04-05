import { FaUser } from 'react-icons/fa';

const WelcomeBanner = ({ username = 'User00' }) => {
  return (
    <div className="p-4 md:p-6 md:ml-16">
      <h1 className="text-2xl md:text-5xl font-bold font-raleway flex flex-wrap items-center gap-2">
        Welcome, {username}!<span className="text-2xl md:text-5xl">👋</span>
        <span className="bg-[#5D1A0B] text-white text-[10px] md:text-sm font-roboto font-normal px-2 py-[2px] md:px-3 md:py-2 rounded-xl flex items-center gap-1">
          <FaUser className="text-[10px] md:text-base" />
          Admin
        </span>
      </h1>
      <p className="text-gray-900 mt-1 text-[10px] md:text-sm font-raleway ml-1 md:ml-2">
        Manage upcoming reservations with ease. Modify or cancel bookings as needed.
      </p>
    </div>
  );
};

export default WelcomeBanner;
