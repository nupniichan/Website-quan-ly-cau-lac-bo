import { ChevronDown } from 'lucide-react';
import { Search } from 'lucide-react'; // Make sure to import the Search icon

const Header = () => {
  return (
    <header className="flex w-full h-16 relative overflow-hidden">
      {/* Yellow Section (slightly more than 2/3 of the header) */}
      <div className="relative w-[90%] h-full">
        <div className="absolute inset-0 bg-yellow-500 z-10" />
        <div className="relative flex items-center justify-end px-4 h-full z-20">
          {/* Positioned on the right side */}
          <div className="flex mr-[10%]">
            <span className="font-bold text-white mr-[60px]">Học sinh</span>
            <span className="font-bold text-white mr-[60px]">Cựu học sinh</span>
            <span className="font-bold text-white mr-[90px]">Đội ngũ giáo viên</span>
            </div>
        </div>
      </div>

      {/* Red Section with a Protruding Triangle */}
      <div className="relative w-[35%] h-full -ml-[4%]">
        <div
          className="absolute inset-0 bg-[#D91E26] z-10"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 10% 100%)',
          }}
        />
        <div className="relative flex items-center justify-end px-4 h-full z-20">
          {/* Language Dropdown */}
          <div className="relative flex items-center mr-[20px]">
            <span className="text-white">Tiếng việt</span>
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
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="px-10 py-2 rounded-[20px] text-sm w-[70%] bg-transparent border-2 border-white placeholder:text-white"
            />
            <Search size={16} className="absolute right-[35%] top-1/2 transform -translate-y-1/2 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
