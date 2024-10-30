import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Globe, Menu } from 'lucide-react';
import logoImage from '../assets/logo.png';
import englishFlag from '../assets/english.png'; // Add path to English flag
import vietnameseFlag from '../assets/vietnam.png'; // Add path to Vietnamese flag
import { Link } from 'react-router-dom';
const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLanguageOpen, setLanguageOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);

  const languageRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const searchRef = useRef(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
    setLanguageOpen(false);
    setSearchOpen(false);
  };

  const toggleLanguage = () => {
    setLanguageOpen((prev) => !prev);
    setMobileMenuOpen(false);
    setSearchOpen(false);
  };

  const toggleSearch = () => {
    setSearchOpen((prev) => !prev);
    setMobileMenuOpen(false);
    setLanguageOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setLanguageOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="flex w-full h-16 relative z-50">
      {/* Yellow Section */}
      <div className="relative w-[90%] h-full">
        <div className="absolute inset-0 bg-yellow-500 z-10" />
        <div className="relative flex items-center justify-end px-4 h-full z-20">
          {/* Logo Container */}
          {/* Mobile Logo */}

          {/* Mobile Logo */}
          <Link to="/" className="w-[50%] h-auto md:hidden mr-[30%] mt-[35%]">
            <img
              src={logoImage}
              alt="Logo"
              className="w-full h-auto" // Ensures the image fits the link
            />
          </Link>

          {/* Desktop Logo */}
          <Link to="/" className="hidden md:block w-[15%] h-auto mr-[20%] mt-[8%]">
            <img
              src={logoImage}
              alt="Logo"
              className="w-full h-auto" // Ensures the image fits the link
            />
          </Link>


          {/* Desktop Navigation */}
          <div className="hidden md:flex mr-[2%]">
            <span className="font-bold text-[#004D86] mr-[60px]">Học sinh</span>
            <span className="font-bold text-[#004D86] mr-[60px]">Cựu học sinh</span>
            <span className="font-bold text-[#004D86] mr-[90px]">Đội ngũ giáo viên</span>
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden relative" ref={mobileMenuRef}>
            <button onClick={toggleMobileMenu} className="text-[#004D86]">
              <Menu size={24} /> {/* Use Menu icon here */}
            </button>
            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-yellow-500 rounded-lg shadow-lg z-50 transform transition-transform duration-300 scale-y-100 origin-top">
                <ul className="flex flex-col p-2">
                  <li className="px-4 py-2 text-[#004D86] hover:bg-yellow-600 rounded transition duration-200">Học sinh</li>
                  <li className="px-4 py-2 text-[#004D86] hover:bg-yellow-600 rounded transition duration-200">Cựu học sinh</li>
                  <li className="px-4 py-2 text-[#004D86] hover:bg-yellow-600 rounded transition duration-200">Đội ngũ giáo viên</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Red Section */}
      <div className="relative w-[35%] h-full -ml-[4%]">
        <div
          className="absolute inset-0 bg-red-500 z-10"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 10% 100%)',
          }}
        />
        <div className="relative flex items-center justify-end px-4 h-full z-20">
        {/* Language Dropdown for Desktop */}
        <div className="hidden md:flex items-center mr-[20px]" ref={languageRef}>
          <span className="text-white cursor-pointer" onClick={toggleLanguage}>
            Tiếng Việt <ChevronDown size={16} className="inline-block text-white ml-1" />
          </span>
          {/* Desktop Language Dropdown Menu */}
          {isLanguageOpen && (
            <div className="absolute right-64 mt-32 w-auto bg-white rounded shadow-lg z-50 px-2 py-2" >
              <ul className="m-0 p-1"> {/* Remove default margin and padding */}
                <li className="flex items-center py-2 hover:bg-gray-100">
                  <img src={englishFlag} alt="English Flag" className="w-6 h-4 mr-2" />
                  English
                </li>
                <li className="flex items-center py-2 hover:bg-gray-100">
                  <img src={vietnameseFlag} alt="Vietnamese Flag" className="w-6 h-4 mr-2" />
                  Vietnamese
                </li>
              </ul>
            </div>
          )}
        </div>

          {/* Language Dropdown for Mobile */}
          <div className="relative flex items-center mr-4 md:hidden" ref={languageRef}>
            <button
              onClick={toggleLanguage}
              className="flex items-center justify-center w-10 h-10 transition duration-200"
            >
              <Globe size={20} className="text-white" />
            </button>
            {/* Mobile Language Dropdown Menu */}
            {isLanguageOpen && (
              <div className="absolute mt-32 w-32 bg-white rounded-lg shadow-md z-50 right-0">
                <ul className="m-0 px-2 py-2"> {/* Remove default margin and padding */}
                  <li className="flex items-center py-2 text-gray-800 hover:bg-gray-100 transition duration-200 rounded-t-lg">
                    <img src={englishFlag} alt="English Flag" className="w-6 h-4 mr-2" />
                    English
                  </li>
                  <li className="flex items-center py-2 text-gray-800 hover:bg-gray-100 transition duration-200">
                    <img src={vietnameseFlag} alt="Vietnamese Flag" className="w-6 h-4 mr-2" />
                    Vietnamese
                  </li>
                </ul>
              </div>
            )}

          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:relative md:flex items-center" ref={searchRef}>
            <input
              type="text"
              placeholder="Search..."
              className="px-8 py-1.5 rounded-[20px] text-sm w-[70%] bg-transparent border-2 border-white placeholder:text-white"
            />
            <Search size={16} className="absolute right-[35%] top-1/2 transform -translate-y-1/2 text-white" />
          </div>

          {/* Mobile Search Bar */}
          <div className="relative flex items-center md:hidden" ref={searchRef}>
            <button onClick={toggleSearch} className="flex items-center justify-center w-10 h-10 transition duration-200">
              <Search size={20} className="text-white" />
            </button>
            {/* Search Input that expands to the left */}
            {isSearchOpen && (
              <div className={`absolute right-16 mt-2 w-52 bg-white rounded-lg shadow-lg transition-transform duration-300 transform ${isSearchOpen ? 'translate-x-[-20%]' : 'translate-x-0'}`}>
                <input
                  type="text"
                  placeholder="Search..."
                  className="px-4 py-2 w-full rounded-lg border border-gray-300 placeholder:text-gray-500"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
