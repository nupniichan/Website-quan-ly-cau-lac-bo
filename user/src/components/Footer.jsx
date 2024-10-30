import { FaFacebookF,  FaYoutube } from 'react-icons/fa';
import { RiInstagramFill } from 'react-icons/ri';

const Footer = () => {
  return (
    <footer className="w-full border-t-[1px] border-black mt-4">
      {/* Main Content Section */}
      <div className="flex flex-col sm:flex-row justify-between px-4 sm:px-16 py-6 sm:py-10 bg-gray-100 space-y-6 sm:space-y-0 ">
      <div className="space-y-2 lg:ml-32">
        <h3 className="font-bold relative inline-block pb-2 after:content-[''] after:block after:w-16 after:border-b-2 after:border-gray-300 after:mt-2">
          Môn học giảng dạy
        </h3>
        <div className="grid grid-cols-2 gap-4"> {/* Add lg:ml-32 here for desktop */}
          <ul className="space-y-2 pl-0">
            <li>Toán học</li>
            <li>Ngữ văn</li>
            <li>Ngoại ngữ</li>
            <li>Lịch sử</li>
            <li>Địa lý</li>
            <li>Vật lý</li>
            <li>Hóa học</li>
            <li>Sinh học</li>
            <li>Tin học</li>
          </ul>
          <ul className="space-y-2 pl-0">
            <li>GDQP - AN</li>
            <li>GDKT - PL</li>
            <li>Công nghệ</li>
            <li>Âm nhạc</li>
            <li>Mỹ thuật</li>
            <li>Thể dục</li>
          </ul>
        </div>
      </div>


        <div className="space-y-2 sm:mr-[-5%] lg:mr-44">
          <h3 className=" font-bold relative inline-block pb-2 after:content-[''] after:block after:w-16 after:border-b-2 after:border-gray-300 after:mt-2">
            Tuyển sinh
          </h3>
          <ul className="space-y-1 pl-0">
            <li>Tuyển sinh lớp 10</li>
            <li>Tuyển sinh bổ sung</li>
            <li>Du học</li>
            <li>Chất lượng cao</li>
          </ul>
        </div>

        <div className="space-y-2 sm:mr-[-60%] lg:mr-[-40%]">
          <h3 className="font-bold relative inline-block pb-2 after:content-[''] after:block after:w-16 after:border-b-2 after:border-gray-300 after:mt-2">
            Nhận diện học hiệu
          </h3>
          <ul className="space-y-1 pl-0">
            <li>Cẩm nang học hiệu</li>
            <li>Template PowerPoint</li>
            <li>Ấn phẩm thiết kế</li>
          </ul>
        </div>

        {/* Trường trung học phổ thông Section */}
        <div className="space-y-2 sm:mt-[20%] sm:mr-[10%] sm:text-left">
          {/* Desktop Version */}
          <div className="hidden sm:block mt-48 ">
            <h3 className="font-bold relative mt-4 pt-2 text-sm">
              Trường trung học phổ thông
              <span className="absolute left-0 right-0 top-0 transform -translate-y-2 w-[120%] border-t border-gray-300 mr-[-20%]"></span>
            </h3>
            <p>
              828 Sư Vạn Hạnh, Phường 13, Quận 10, TP. HCM <br />
              (028) 3863 2052 - (028) 3862 9232 <br />
              (028) 3865 0991 <br />
              contact@ttpt.edu.vn
            </p>
          </div>
          
          {/* Mobile Version */}
          <div className="block sm:hidden text-sm">
            <h3 className="font-bold relative mt-4 pt-2 text-sm">
              Trường trung học phổ thông
              <span className="absolute left-0 right-0 top-0 transform -translate-y-2 w-[100%] border-t border-gray-300 mr-[-20%]"></span>
            </h3>
            <p>
              828 Sư Vạn Hạnh, Phường 13, Quận 10, TP. HCM <br />
              (028) 3863 2052 - (028) 3862 9232 <br />
              (028) 3865 0991 <br />
              contact@ttpt.edu.vn
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Footer Section */}
<div className="flex flex-col sm:flex-row w-full sm:h-16 relative overflow-hidden">
  {/* Yellow Section */}
  <div className="w-full sm:w-[90%] h-16 sm:h-full bg-yellow-500 z-10 flex items-center justify-center sm:justify-between text-[#004D86]">
    © Copyright 2024 - Trường trung học phổ thông
  </div>

  {/* Red Section with Protruding Triangle for Desktop */}
  <div
    className="hidden sm:flex w-[35%] h-full -ml-[4%] items-center justify-center bg-red-500 z-10 px-4 space-x-10"
    style={{
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 10% 100%)',
      
    }}
  >
    {/* Social Media Icons */}
    <FaFacebookF className="text-white" size={36} />
    <RiInstagramFill className="text-white" size={36} />
    <FaYoutube className="text-white" size={36} />
  </div>

  {/* Red Section for Mobile without clipPath */}
  <div className="flex sm:hidden w-full h-16 bg-red-500 items-center justify-center space-x-10">
  <FaFacebookF className="text-white" size={36} />
    <RiInstagramFill className="text-white" size={36} />
    <FaYoutube className="text-white" size={36} />
  </div>
</div>




    </footer>
  );
};

export default Footer;
