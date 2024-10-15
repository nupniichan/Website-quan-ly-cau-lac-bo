import React from 'react';
import { Search } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-yellow-400">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          {/* Logo placeholder */}
          <div className="w-10 h-10 bg-gray-200 rounded-sm"></div> 

          <div className="flex-1 flex justify-between items-center">
            <nav>
              <ul className="flex space-x-4">
                <li><a href="#" className="text-black hover:underline text-sm">Học sinh</a></li>
                <li><a href="#" className="text-black hover:underline text-sm">Cựu học sinh</a></li>
                <li><a href="#" className="text-black hover:underline text-sm">Đội ngũ giáo viên</a></li>
              </ul>
            </nav>

            <div className="flex items-center space-x-4">
              <select className="bg-yellow-400 text-black border-none text-sm">
                <option>Tiếng việt</option>
                {/* Add more language options if needed */}
              </select>
              <div className="relative"> {/* Relative wrapper for search icon positioning */}
                 <input type="text" placeholder="Tìm kiếm" className="bg-red-100 rounded-lg pl-3 pr-8 py-1 text-sm focus:outline-none" />
                 <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
              </div>

              {/*  Previous button code (using button element):
              <button className="bg-red-500 text-white px-3 py-1 rounded flex items-center text-sm">
                Tìm kiếm
                <Search className="ml-1" size={16} />
              </button> 
              */}

            </div>
          </div>
        </div>

        <nav className="mt-2">
          <ul className="flex justify-center space-x-6">
            <li><a href="#" className="text-black hover:underline text-sm">Về trường</a></li>
            <li><a href="#" className="text-black hover:underline text-sm">Chương trình học</a></li>
            <li><a href="#" className="text-black hover:underline text-sm">Khoa học - Công nghệ</a></li>
            <li><a href="#" className="text-black hover:underline text-sm">Hợp tác</a></li>
            <li><a href="#" className="text-black hover:underline text-sm">Tuyển sinh lớp 10</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;