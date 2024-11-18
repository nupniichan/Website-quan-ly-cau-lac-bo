import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import achievement1 from '/public/imgs/achivement1.jpg';
import achievement2 from '/public/imgs/achivement2.jpg';
import achievement3 from '/public/imgs/achivement3.jpg';
import achievement4 from '/public/imgs/achivement4.jpg';

// Thêm ScrollReveal component
const ScrollReveal = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "0px 0px -100px 0px"
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay }}
    >
      {children}
    </motion.div>
  );
};

const AboutSchool = () => {
  return (
    <div className="min-h-screen font-sans mt-10">
      {/* Title Animation */}
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-bold text-center text-[#004D86] mb-12"
      >
        GIỚI THIỆU CHUNG VỀ TRƯỜNG HỌC
      </motion.h1>

      {/* School Introduction Section */}
      <ScrollReveal>
        <div className="flex flex-col md:block">
          {/* Background image for all devices */}
          <div
            className="relative bg-cover bg-center h-[200px] sm:h-[300px] md:h-[25rem] w-full"
            style={{backgroundImage: "url('/public/imgs/310241947-586932963121590-3034296582378048999-n-16802426955401349567464.jpg')"}}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-70"></div>

            {/* Text overlay for medium and larger screens */}
            <div className="hidden md:flex items-end h-full">
              <div className="max-w-6xl mx-auto relative z-10 w-full pb-[7rem] px-4 md:px-2">
                <div className="md:w-2/3 lg:w-1/2">
                  <h2 className="text-3xl font-bold text-white mb-4">
                    Trường trung học phổ thông
                  </h2>
                  <p className="text-md text-white whitespace-pre-line">
                    {`Được thành lập vào năm 2000, với mục tiêu cung cấp giáo dục chất lượng
                    và môi trường học tập hiện đại. Trải qua nhiều năm phát triển, trường
                    đã đạt được nhiều thành tích xuất sắc trong giảng dạy và hoạt động
                    ngoại khóa, trở thành một trong những trường THPT uy tín trong khu vực.`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Text content for mobile and tablet */}
          <div className="md:hidden px-4 py-6 sm:py-8 bg-[#F5F5F5]">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#004D86] mb-4">
                Trường trung học phổ thông
              </h2>
              <p className="text-sm sm:text-base text-gray-700">
                Được thành lập vào năm 2000, với mục tiêu cung cấp giáo dục
                chất lượng và môi trường học tập hiện đại. Trải qua nhiều năm
                phát triển, trường đã đạt được nhiều thành tích xuất sắc trong
                giảng dạy và hoạt động ngoại khóa, trở thành một trong những
                trường THPT uy tín trong khu vực.
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Extracurricular Activities Section */}
      <ScrollReveal>
        <div className="px-12 sm:px-16 md:px-24 lg:px-32 xl:px-50 mb-12">
          <div className="max-w-7xl mx-auto mt-12 relative">
            <div className="flex flex-col lg:flex-row items-center">
              <div className="lg:w-2/3 bg-[#F6F6F6] p-8 rounded-lg relative">
                <div className="lg:w-3/4">
                  <h2 className="text-3xl font-semibold text-[#004D86] mb-6">
                    Hoạt động ngoại khoá
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Trường chú trọng không chỉ kiến thức mà còn phát triển kỹ năng sống,
                    tư duy sáng tạo và tinh thần tự lập. Học sinh tham gia nhiều hoạt
                    động ngoại khóa từ thể thao đến nghệ thuật, cùng các câu lạc bộ giúp
                    rèn luyện sự tự tin và sáng tạo.
                  </p>
                  <div className="w-16 h-1 bg-blue-700 mt-6"></div>
                </div>
              </div>
              <div className="lg:w-1/2 mt-6 lg:mt-0 lg:-ml-24 z-10">
                <img
                  src="/public/imgs/ay8a6925.jpg"
                  alt="Hoạt động ngoại khoá"
                  className="w-full h-auto object-cover rounded-lg border-4 border-white shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Facilities Section */}
      <ScrollReveal>
        <div className="px-12 sm:px-16 md:px-24 lg:px-32 xl:px-50 mb-12">
          <div className="max-w-7xl mx-auto mt-12 relative">
            <div className="flex flex-col lg:flex-row-reverse items-center">
              <div className="lg:w-2/3 bg-[#F6F6F6] p-8 rounded-lg relative">
                <div className="lg:w-3/4 ml-auto">
                  <h2 className="text-3xl font-semibold text-[#004D86] mb-6">
                    Cơ sở vật chất
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Cơ sở vật chất hiện đại, với phòng học thông minh, thư viện phong phú và các phòng thí nghiệm chuyên dụng, tạo điều kiện thuận lợi nhất để học sinh khám phá tri thức và phát triển năng lực bản thân của mỗi học sinh.
                  </p>
                  <div className="w-16 h-1 bg-blue-700 mt-6"></div>
                </div>
              </div>
              <div className="lg:w-1/2 mt-6 lg:mt-0 lg:-mr-24 z-10 space-y-4">
                <img
                  src="/public/imgs/csvc1.jpg"
                  alt="Cơ sở vật chất 1"
                  className="w-full h-auto object-cover rounded-lg border-4 border-white shadow-lg"
                />
                <img
                  src="/public/imgs/csvc2.jpg"
                  alt="Cơ sở vật chất 2"
                  className="w-full h-auto object-cover rounded-lg border-4 border-white shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Achievements Section */}
      <ScrollReveal>
        <div className="px-12 sm:px-16 md:px-24 lg:px-32 xl:px-50 mb-12">
          <div className="max-w-7xl mx-auto mt-12 relative">
            <h2 className="text-3xl font-semibold text-[#004D86] mb-6 text-center">
              Một vài thành tích học sinh đạt được:
            </h2>
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2 flex items-center">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">Giải trong kỳ thi học sinh giỏi cấp thành phố:</h3>
                    <p className="text-gray-700">Nhiều học sinh của trường đã đạt các giải cao trong các kỳ thi học sinh giỏi các môn học, khẳng định chất lượng giáo dục của trường.</p>
                  </div>
                </div>
                <img src={achievement1} alt="Lễ khai mạc kỳ thi chọn học sinh giỏi quốc gia" className="w-full md:w-1/2 h-auto object-cover rounded-lg" />
              </div>

              <div className="flex flex-col md:flex-row gap-4 bg-[#F5F5F5] p-4 rounded-lg">
                <img src={achievement2} alt="Lễ tuyên dương học sinh đoạt giải Olympic quốc tế" className="w-full md:w-1/2 h-auto object-cover rounded" />
                <div className="w-full md:w-1/2 flex items-center">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">Thành tích cao trong các cuộc thi Olympic:</h3>
                    <p className="text-gray-700">Học sinh của trường đã tham gia và giành nhiều giải thưởng trong các cuộc thi Olympic quốc gia về Toán, Vật lý, Hóa học và Tiếng Anh.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2 flex items-center">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">Đạt học bổng tại trường đại học danh tiếng:</h3>
                    <p className="text-gray-700">Nhiều cựu học sinh của trường đã nhận được học bổng từ các trường đại học trong nước và quốc tế.</p>
                  </div>
                </div>
                <img src={achievement3} alt="Lễ khai mạc kỳ thi chọn học sinh giỏi quốc gia" className="w-full md:w-1/2 h-auto object-cover rounded-lg" />
              </div>

              <div className="flex flex-col md:flex-row gap-4 bg-[#F5F5F5] p-4 rounded-lg">
                <img src={achievement4} alt="Lễ tuyên dương học sinh đoạt giải Olympic quốc tế" className="w-full md:w-1/2 h-auto object-cover rounded-lg" />
                <div className="w-full md:w-1/2 flex items-center">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">Thành tích xuất sắc các cuộc thi thể thao:</h3>
                    <p className="text-gray-700">Đội tuyển thể thao của trường đã giành nhiều huy chương vàng tại các giải đấu thể thao cấp thành phố và quốc gia.</p>
                  </div>
                </div>
              </div>
              <h2 className="text-3xl font-semibold text-[#004D86] mb-6 text-center">
              Và còn nhiều thành tích khác...
            </h2>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* School Leadership Team Section */}
      <ScrollReveal>
        <div className="px-12 sm:px-16 md:px-24 lg:px-32 xl:px-50 mb-12">
          <div className="max-w-7xl mx-auto mt-12 relative">
            <h2 className="text-3xl font-semibold text-[#004D86] mb-6 text-center">
              Ban cán bộ trường
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Leadership Member 1 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img src="/public/imgs/HieuTruong.jpg" alt="Thầy Nguyễn Văn A" className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800">Thầy Nguyễn Văn A</h3>
                  <p className="text-gray-600">Thạc sĩ môn toán</p>
                  <p className="text-sm text-gray-500 mt-2">Thầy đã từng giúp nhiều học sinh vượt qua nỗi sợ môn toán bằng phương pháp giảng dạy của thầy</p>
                  <p className="text-[#FF7426] font-semibold mt-2">Hiệu trưởng</p>
                </div>
              </div>

              {/* Leadership Member 2 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img src="/public/imgs/HieuPho2.jpg" alt="Cô Trần Thị V" className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800">Cô Trần Thị V</h3>
                  <p className="text-gray-600">Thạc sĩ văn học</p>
                  <p className="text-sm text-gray-500 mt-2">Cách giảng dạy của cô đã biến một môn cố vể "khô khan" sang một môn học trần đầy thú vị</p>
                  <p className="text-[#FF7426] font-semibold mt-2">Phó hiệu trưởng</p>
                </div>
              </div>

              {/* Leadership Member 3 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img src="/public/imgs/HieuPho1.jpg" alt="Cô Nguyễn Thị T" className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800">Thầy Nguyễn Văn B</h3>
                  <p className="text-gray-600">Tiến sĩ Ngoại Ngữ</p>
                  <p className="text-sm text-gray-500 mt-2">Là một giáo viên có thành tích 9.0 Ietls và đạt được nhiều thành tích cao và cách dạy rất thu hút học sinh</p>
                  <p className="text-[#FF7426] font-semibold mt-2">Phó hiệu trưởng</p>
                </div>
              </div>
            </div>
            <p className="text-lg font-semibold text-[#004D86] mt-8">
              Và nhiều thầy cô khác đang chờ đón học sinh...
            </p>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};

export default AboutSchool;
