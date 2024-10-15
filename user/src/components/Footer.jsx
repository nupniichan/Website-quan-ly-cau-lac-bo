
import { Facebook, Instagram, Youtube } from 'lucide-react'; // Icons for social media

const Footer = () => {
  return (
    <footer className="w-full border-t-[1px] border-black mt-4">
      {/* Main Content Section */}
      <div className="flex justify-between px-16 py-10 bg-gray-100">
        <div className="space-y-2">
          <h3 className="font-bold relative inline-block pb-2 after:content-[''] after:block after:w-16 after:border-b-2 after:border-gray-300 after:mt-2">Môn học giảng dạy</h3>
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
            <li>GDQP - AN</li>
            <li>GDKT - PL</li>
            <li>Công nghệ</li>
            <li>Âm nhạc</li>
            <li>Mỹ thuật</li>
            <li>Thể dục</li>
          </ul>
        </div>
        <div className="space-y-2 mr-[-5%]">
          <h3 className="font-bold relative inline-block pb-2 after:content-[''] after:block after:w-16 after:border-b-2 after:border-gray-300 after:mt-2">Tuyển sinh</h3>
          <ul className="space-y-1 pl-0">
            <li>Tuyển sinh lớp 10</li>
            <li>Tuyển sinh bổ sung</li>
            <li>Du học</li>
            <li>Chất lượng cao</li>
          </ul>
        </div>
        <div className="space-y-2 mr-[-60%]">
          <h3 className="font-bold relative inline-block pb-2 after:content-[''] after:block after:w-16 after:border-b-2 after:border-gray-300 after:mt-2">Nhận diện học hiệu</h3>
          <ul className="space-y-1 pl-0">
            <li>Cẩm nang học hiệu</li>
            <li>Template PowerPoint</li>
            <li>Ấn phẩm thiết kế</li>
          </ul>
        </div>
        <div className="space-y-2 mt-[20%] mr-[10%]">
        <h3 className="font-bold relative text-center mt-4 pt-2">
  Trường trung học phổ thông
  <span className="absolute left-0 right-0 top-0 transform -translate-y-2 w-[140%] border-t border-gray-300 mr-[-20%]"></span>
</h3>

          <p>
            828 Sư Vạn Hạnh, Phường 13, Quận 10, TP. HCM <br />
            (028) 3863 2052 - (028) 3862 9232 <br />
            (028) 3865 0991 <br />
            contact@ttpt.edu.vn
          </p>
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="flex w-full h-16 relative overflow-hidden">
        {/* Yellow Section */}
        <div className="relative w-[90%] h-full">
          <div className="absolute inset-0 bg-yellow-500 z-10" />
          <div className="relative flex items-center justify-between px-4 h-full z-20">
            <span className="text-black font-bold">© Copyright 2024 - Trường trung học phổ thông</span>
          </div>
        </div>

        {/* Red Section with Protruding Triangle */}
        <div className="relative w-[15%] h-full -ml-[4%]">
          <div
            className="absolute inset-0 bg-red-500 z-10"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 10% 100%)',
            }}
          />
          <div className="relative flex items-center justify-end px-4 h-full z-20">
            {/* Social Media Icons */}
            <Facebook className="text-white ml-2" size={24} />
            <Instagram className="text-white ml-2" size={24} />
            <Youtube className="text-white ml-2" size={24} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
