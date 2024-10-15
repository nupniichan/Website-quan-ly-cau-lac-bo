import React from 'react';
import achievement1 from '../public/imgs/achivement1.jpg';
import achievement2 from '../public/imgs/achivement2.jpg';
import achievement3 from '../public/imgs/achivement3.jpg';
import achievement4 from '../public/imgs/achivement4.jpg';

const AboutSchool = () => {
  return (
    <div className="max-w-5xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6" style={{ color: '#004D86' }}>VỀ TRƯỜNG HỌC</h1>
      
      <div className="space-y-6 text-gray-700">
        <p>
          Tại trường, chúng tôi tự hào là ngôi nhà thứ hai của những thế hệ học sinh yêu thích học tập 
          và khám phá. Với môi trường học tập thân thiện và đội ngũ giáo viên nhiệt huyết, chúng tôi 
          cam kết mang đến cho các em một nền giáo dục chất lượng và những trải nghiệm đáng nhớ.
        </p>

        <p>
          Trường chúng tôi không chỉ chú trọng vào kiến thức mà còn phát triển toàn diện kỹ năng 
          sống, khả năng tư duy sáng tạo và tinh thần tự lập cho học sinh. Các em sẽ được tham gia 
          vào nhiều hoạt động ngoại khóa phong phú, từ thể thao đến nghệ thuật, giúp phát huy khả 
          năng cá nhân và rèn luyện sự tự tin. Ngoài ra còn có rất nhiều câu lạc bộ khác nhau dành cho 
          các em tham gia nhằm nâng cao tính sáng tạo và tinh thần tham gia ngoại khóa của các em.
        </p>

        <p>
          Chúng tôi còn có cơ sở vật chất hiện đại, với phòng học thông minh, thư viện phong phú và 
          các phòng thí nghiệm chuyên dụng, tạo điều kiện thuận lợi nhất để học sinh khám phá tri thức 
          và phát triển năng lực bản thân.
        </p>

        <p>
          Hãy đăng ký vào trường để cùng nhau xây dựng một tương lai tươi sáng! Chúng tôi rất mong 
          được chào đón các em.
        </p>
      </div>

      <div className="mt-10 p-0 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6" style={{ color: '#004D86' }}>Một vài thành tích học sinh đạt được:</h2>        
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2 flex items-center">
              <div>
                <h3 className="font-semibold text-lg text-gray-800">Giải trong kỳ thi học sinh giỏi cấp thành phố:</h3>
                <p className="text-gray-700">Nhiều học sinh của trường đã đạt các giải cao trong các kỳ thi học sinh giỏi các môn học, khẳng định chất lượng giáo dục của trường.</p>
              </div>
            </div>
            <img src={achievement1} alt="Lễ khai mạc kỳ thi chọn học sinh giỏi quốc gia" className="w-full md:w-1/2 h-auto object-cover rounded" />
          </div>

          <div className="flex flex-col md:flex-row gap-4 bg-[#F5F5F5]">
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
            <img src={achievement3} alt="Lễ khai mạc kỳ thi chọn học sinh giỏi quốc gia" className="w-full md:w-1/2 h-auto object-cover rounded" />
          </div>

          <div className="flex flex-col md:flex-row gap-4 bg-[#F5F5F5]">
            <img src={achievement4} alt="Lễ tuyên dương học sinh đoạt giải Olympic quốc tế" className="w-full md:w-1/2 h-auto object-cover rounded" />
            <div className="w-full md:w-1/2 flex items-center">
              <div>
                <h3 className="font-semibold text-lg text-gray-800">Thành tích xuất sắc các cuộc thi thể thao:</h3>
                <p className="text-gray-700">Đội tuyển thể thao của trường đã giành nhiều huy chương vàng tại các giải đấu thể thao cấp thành phố và quốc gia.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-center mb-6" style={{ color: '#004D86' }}>Và nhiều thành tích khác...</h2>

        <div className="rounded-lg">
          <h3 className="text-2xl font-bold mb-4" style={{ color: '#004D86' }}>Giáo viên ưu tú</h3>
          
          <ul className="space-y-4">
            <li>
              <strong>Thầy Nguyễn Văn A:</strong> Giáo viên dạy Toán với hơn 15 năm kinh nghiệm, đã từng đạt giải "Giáo 
              viên dạy giỏi cấp thành phố" và có nhiều học sinh giỏi quốc gia.
            </li>
            <li>
              <strong>Cô Trần Thị B:</strong> Giáo viên dạy Ngữ văn, tác giả của nhiều sách giáo khoa, nổi tiếng với phương 
              pháp giảng dạy sáng tạo và khả năng truyền cảm hứng cho học sinh.
            </li>
            <li>
              <strong>Thầy Lê Minh C:</strong> Giáo viên dạy Tiếng Anh, có chứng chỉ giảng dạy quốc tế và đã từng tham 
              gia các khóa đào tạo ở nước ngoài, giúp học sinh cải thiện kỹ năng ngôn ngữ và giao tiếp.
            </li>
            <li>
              <strong>Cô Phạm Thị D:</strong> Giáo viên dạy Sinh học, đã hướng dẫn nhiều dự án nghiên cứu khoa học của 
              học sinh đạt giải thưởng lớn và được mời tham gia các hội thảo khoa học quốc tế.
            </li>
            <li>
              <strong>Thầy Nguyễn Hoàng E:</strong> Giáo viên dạy Vật lý, nổi tiếng với phương pháp giảng dạy độc đáo và 
              luôn tạo động lực cho học sinh trong việc khám phá kiến thức.
            </li>
          </ul>
        </div>

        <p className="text-center text-lg font-semibold mt-6" style={{ color: '#004D86' }}>
          Và nhiều thầy cô ưu tú khác đang chờ đón học sinh...
        </p>
      </div>
    </div>
  );
};

export default AboutSchool;
