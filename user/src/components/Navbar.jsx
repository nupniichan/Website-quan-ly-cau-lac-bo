import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react'; // Import the Menu icon

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <nav className="relative flex justify-between items-center h-18 bg-white border-b border-gray-300 w-full z-10 custom-navbar">
      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center px-4 ml-auto">
        <button onClick={toggleMobileMenu} className="text-black">
          <Menu size={24} />
        </button>
      </div>

      {/* Navigation Links */}
      <ul className={`text-lg ${
        isMobileMenuOpen 
          ? 'flex flex-col absolute top-full right-0 bg-white shadow-lg w-64 z-50 mt-2 rounded-lg overflow-hidden' 
          : 'hidden md:flex space-x-10 ml-[25%]'
      } md:flex-row`}>
        <Link to="/about" className="text-black no-underline">
          <li className="px-6 py-4 hover:bg-gray-100 transition-colors duration-200">
            Về trường
          </li>
        </Link>
        <Link to="/clubs" className="text-black no-underline">
          <li className="px-6 py-4 hover:bg-gray-100 transition-colors duration-200">
            Chương trình học
          </li>
        </Link>
        <Link to="/curriculum" className="text-black no-underline">
          <li className="px-6 py-4 hover:bg-gray-100 transition-colors duration-200">
            Khoa học - Công nghệ
          </li>
        </Link>
        <Link to="/international-cooperation" className="text-black no-underline">
          <li className="px-6 py-4 hover:bg-gray-100 transition-colors duration-200">
            Hợp tác
          </li>
        </Link>
        <Link to="/admission" className="text-black no-underline">
          <li className="px-6 py-4 hover:bg-gray-100 transition-colors duration-200">
            Tuyển sinh lớp 10
          </li>
        </Link>
      </ul>
    </nav>
  );
};

export default Navbar;
