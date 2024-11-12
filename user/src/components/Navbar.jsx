import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react'; // Import the Menu icon

const Navbar = () => {
<<<<<<< HEAD
    return (
      <nav className="relative flex justify-between items-center h-12 bg-white border-b border-gray-300 w-full">
        {/* Navigation Links */}
        <ul className="flex space-x-6 z-20 ml-[25%] font-bold">
        <Link to="/" className="text-black no-underline"><li className="text-black no-underline">Trang chủ</li></Link>
        <Link to="/about" className="text-black no-underline"><li className="text-black no-underline">Về trường</li></Link>
          <Link to="/clubs" className="text-black no-underline"><li className="text-black no-underline">Chương trình học</li></Link>
          <Link to="/curriculum" className="text-black no-underline"><li className="text-black no-underline">Khoa học - Công nghệ</li></Link>
          <Link to="/international-cooperation" className="text-black no-underline"><li className="text-black no-underline">Hợp tác</li></Link>
          <Link to="/admission" className="text-black no-underline"><li className="text-black no-underline">Tuyển sinh lớp 10</li></Link>
        </ul>
      </nav>
    );
=======
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
>>>>>>> 23d7bb75261c12e106af89be1a6d371714633fc6
  };

  return (
    <nav className="relative flex justify-between items-center h-18 bg-white border-b border-gray-300 w-full z-10 custom-navbar "> {/* Add custom class here */}
      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center px-4 ml-auto">
        <button onClick={toggleMobileMenu} className="text-black">
          <Menu size={24} /> {/* Use Menu icon here */}
        </button>
      </div>

      {/* Navigation Links */}
      <ul className={`text-lg flex space-x-10 ml-[25%] pr-3 pl-3 pt-3 pb-1 rounded ${isMobileMenuOpen ? 'flex-col h-auto absolute bg-white shadow-lg w-64 z-50 right-14 mt-64 p-4' : 'hidden md:flex'} md:flex-row`}>
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
