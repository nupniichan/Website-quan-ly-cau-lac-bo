const Navbar = () => {
    return (
      <nav className="relative flex justify-between items-center h-12 bg-white border-b border-gray-300 w-full">
        {/* Navigation Links */}
        <ul className="flex space-x-6 z-20 ml-[25%] font-bold">
          <li className="text-black">Về trường</li>
          <li className="text-black">Chương trình học</li>
          <li className="text-black">Khoa học - Công nghệ</li>
          <li className="text-black">Hợp tác</li>
          <li className="text-black">Tuyển sinh lớp 10</li>
        </ul>
      </nav>
    );
  };
  
  export default Navbar;
  