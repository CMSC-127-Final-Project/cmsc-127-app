import { FaUser } from 'react-icons/fa';

const WelcomeBanner = ({ username = 'User00' }) => {
  return (
    <div className="p-6 ml-16">
      <h1 className="text-5xl font-bold font-raleway flex items-center gap-2">
        Welcome, {username}! 
        <span className="text-5xl">👋</span> {/* Increased font size */}
        <span className="bg-[#5D1A0B] text-white text-sm font-roboto font-normal px-3 py-2 rounded-xl flex items-center gap-1">
          <FaUser className="text-base" />
          User
        </span>
      </h1>
      <p className="text-gray-900 mt-1 text-sm font-raleway ml-2">
        Here are your upcoming reservations. Modify or cancel your reservations anytime.
      </p>
    </div>
  );
};

export default WelcomeBanner;
