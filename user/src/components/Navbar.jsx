import { Link } from 'react-router-dom';
const Navbar = () => {
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
  };
  
  export default Navbar;
  