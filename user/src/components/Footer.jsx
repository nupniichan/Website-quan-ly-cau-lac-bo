import { FaFacebookF, FaYoutube } from 'react-icons/fa';
import { RiInstagramFill } from 'react-icons/ri';

const Footer = () => {
  return (
    <footer className="w-full border-t-[1px] border-black mt-4">
      {/* Main Content Section */}
      <div className="flex flex-col sm:flex-row justify-between px-4 sm:px-16 py-6 sm:py-10 bg-[#F2F2F2] space-y-6 sm:space-y-0">
        {/* Trường trung học phổ thông Section */}
        <div className="space-y-2">
          {/* Desktop Version */}
          <div className="hidden sm:block mx-5">
            <h3 className="font-bold relative mt-4 pt-2 text-lg">
              Trường trung học phổ thông Thành Phố Hồ Chí Minh
              <span className="absolute left-0 right-0 top-0 transform -translate-y-2 w-[120%] border-t border-gray-300"></span>
            </h3>
            <p className="text-lg mt-2">
              246 Nguyễn Văn Luông, Phường 6, Quận 6, TP. HCM  <br />
              (028) 3863 2052 - (028) 3862 9232 <br />
              (028) 3865 0991 <br />
              thpttphcm@ttpt.edu.vn
            </p>
          </div>
          
          {/* Mobile Version */}
          <div className="block sm:hidden text-sm">
            <h3 className="font-bold relative mt-4 pt-2">
              Trường trung học phổ thông Thành Phố Hồ Chí Minh
              <span className="absolute left-0 right-0 top-0 transform -translate-y-2 w-[100%] border-t border-gray-300"></span>
            </h3>
            <p className="mt-2">
              246 Nguyễn Văn Luông, Phường 6, Quận 6, TP. HCM <br />
              (028) 3863 2052 - (028) 3862 9232 <br />
              (028) 3865 0991 <br />
              thpttphcm@ttpt.edu.vn
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="flex flex-col sm:flex-row w-full sm:h-16 relative">
        {/* Yellow Section */}
        <div className="w-full sm:w-[90%] h-16 bg-yellow-500 flex items-center justify-center sm:justify-start text-[#004D86] pl-4 sm:pl-16">
          © Copyright 2024 - Trường trung học phổ thông Thành Phố Hồ Chí Minh
        </div>

        {/* Red Section with Protruding Triangle for Desktop */}
        <div
          className="hidden sm:flex w-[35%] h-full -ml-[4%] items-center justify-center bg-red-500 space-x-10"
          style={{
            clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 10% 100%)',
          }}
        >
          {/* Social Media Icons */}
          <FaFacebookF className="text-white cursor-pointer hover:opacity-80" size={24} />
          <RiInstagramFill className="text-white cursor-pointer hover:opacity-80" size={24} />
          <FaYoutube className="text-white cursor-pointer hover:opacity-80" size={24} />
        </div>

        {/* Red Section for Mobile without clipPath */}
        <div className="flex sm:hidden w-full h-16 bg-red-500 items-center justify-center space-x-10">
          <FaFacebookF className="text-white cursor-pointer hover:opacity-80" size={24} />
          <RiInstagramFill className="text-white cursor-pointer hover:opacity-80" size={24} />
          <FaYoutube className="text-white cursor-pointer hover:opacity-80" size={24} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
