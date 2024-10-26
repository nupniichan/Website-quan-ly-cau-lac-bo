import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <nav className="relative flex justify-between items-center h-12 bg-white border-b border-gray-300 w-full z-10">
      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center px-4 ml-auto">
        <button onClick={toggleMobileMenu} className="text-black">
          Nav
        </button>
      </div>

      {/* Navigation Links */}
      <ul className={`flex space-x-6 ml-[25%] pr-3 pl-3 pt-3 pb-3 rounded ${isMobileMenuOpen ? 'flex-col absolute bg-white shadow-lg w-auto z-30 mt-32' : 'hidden md:flex'} md:flex-row`}>
        <Link to="/about" className="text-black no-underline">
          <li className="text-black no-underline hover:bg-gray-100">Về trường</li>
        </Link>
        <Link to="/clubs" className="text-black no-underline">
          <li className="text-black no-underline hover:bg-gray-100">Chương trình học</li>
        </Link>
        <Link to="/curriculum" className="text-black no-underline">
          <li className="text-black no-underline hover:bg-gray-100">Khoa học - Công nghệ</li>
        </Link>
        <Link to="/news" className="text-black no-underline">
          <li className="text-black no-underline hover:bg-gray-100">Hợp tác</li>
        </Link>
        <Link to="/admission" className="text-black no-underline">
          <li className="text-black no-underline hover:bg-gray-100">Tuyển sinh lớp 10</li>
        </Link>
      </ul>
    </nav>
  );
};

export default Navbar;
