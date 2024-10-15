import { ChevronDown } from 'lucide-react';

const Header = () => {
  return (
    <header className="flex w-full h-16 relative overflow-hidden">
      {/* Yellow Section (slightly more than 2/3 of the header) */}
      <div className="relative w-[90%] h-full">
        <div className="absolute inset-0 bg-yellow-500 z-10" />
        <div className="relative flex items-center justify-end px-4 h-full z-20">
          {/* Positioned on the right side */}
          <div className="flex">
            <span className="font-bold text-white mr-[30px]">Học sinh</span>
            <span className="font-bold text-white mr-[30px]">Cựu học sinh</span>
            <span className="font-bold text-white mr-[30px]">Đội ngũ giáo viên</span>
          </div>
        </div>
      </div>

      {/* Red Section with a Protruding Triangle */}
      <div className="relative w-[15  %] h-full -ml-[4%]">
        <div
          className="absolute inset-0 bg-red-500 z-10"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 10% 100%)',
          }}
        />
        <div className="relative flex items-center justify-end px-4 h-full z-20">
          {/* Language Dropdown */}
          <div className="relative flex items-center mr-4">
            <span className="text-white">Language</span>
            <ChevronDown size={16} className="text-white ml-1" />
            {/* Dropdown menu placeholder */}
            <div className="absolute right-0 mt-2 w-32 bg-white rounded shadow-lg hidden">
              <ul>
                <li className="px-4 py-2 hover:bg-gray-100">English</li>
                <li className="px-4 py-2 hover:bg-gray-100">Vietnamese</li>
              </ul>
            </div>
          </div>

          {/* Search Bar */}
          <div>
            <input
              type="text"
              placeholder="Search..."
              className="px-3 py-1 rounded-md text-sm"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
