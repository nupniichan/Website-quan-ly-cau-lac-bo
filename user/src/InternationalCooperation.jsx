import PropTypes from 'prop-types'; // Import PropTypes

const CooperationItem = ({ title, date, content, imageUrl }) => (
  <div className="flex mb-8 pb-8 border-b border-gray-200">
    <img src={imageUrl} alt={title} className="w-[15rem] h-42 object-cover mr-6" />
    <div className="flex-1 space-y-4">
      <h3 className="text-[#000000] text-xl font-semibold mt-0">{title}</h3>
      <p className="text-gray-600 text-sm mb-2 flex items-center">
        <span className="mr-1" aria-hidden="true">&#128337;</span> {/* Clock emoji */}
        {date}
      </p>
      <p className="text-gray-800">{content}</p>
    </div>
  </div>
);

// Định nghĩa PropTypes để kiểm tra kiểu dữ liệu của các props
CooperationItem.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
};

const InternationalCooperation = () => {
  const cooperationItems = [
    {
      title: "Thắm tình hữu nghị Việt Nam - Singapore: khoảng cách địa lí không còn là rào cản",
      date: "05/09/2024",
      content: "Trong những ngày 17/09/2024, 18/09/2024 và 21/09/2024, Trường đã tổ chức chương trình giao lưu với học sinh trường Raffles (Singapore). Để đảm bảo an toàn sau thời gian dịch bệnh, chương trình giao lưu được thực hiện qua hình thức trực tuyến trên Microsoft Teams.",
      imageUrl: "https://ntthnue.edu.vn/uploads/Images/2024/09/065.JPG"
    },
    {
      title: "Đón chào các giáo viên đến từ xứ sở Mặt trời mọc",
      date: "01/09/2024",
      content: "Ngày 27/09/2024 vừa qua, trường rất vinh dự khi được đón tiếp những vị khách quý đến từ xứ sở Mặt trời mọc - các giáo viên của Trường Trung học Miyazaki (Nhật Bản). Các thầy cô đã có những chia sẻ quý giá về trao đổi và thành trình học tập, bồi dưỡng nghề nghiệp của mình, cũng như tham gia chuyến đi đến Bảo tàng Dân tộc học Việt để hiểu nhau hơn.",
      imageUrl: "https://ntthnue.edu.vn/uploads/Images/2024/10/035.JPG"
    },
    {
      title: "Trải nghiệm, lên ý tưởng và thí nghiệm mô hình nông nghiệp cùng học sinh trường Miyazaki (Nhật Bản)",
      date: "20/07/2024",
      content: "Đến với trường, các bạn học sinh Nhật Bản từ trường Miyazaki đã có cơ hội được trải nghiệm tại phòng thí nghiệm Nông nghiệp STEM Quốc gia. Buổi trải nghiệm cùng thành viên CLB Khoa học (SPC) đã đem đến nhiều kiến thức bổ ích, thú vị cho các bạn học sinh Nhật Bản.",
      imageUrl: "../public/imgs/news4.jpg"
    },
    {
      title: "Trải nghiệm STEM cùng học sinh trường Frederiksborg Gymnasium (Đan Mạch)",
      date: "15/06/2024",
      content: "Chiều thứ năm (25/10/2023) vừa qua, đoàn học sinh trường Frederiksborg đã có một buổi trải nghiệm STEM do CLB Khoa học (SPC - Science Passion Club) tổ chức. Thành viên trong CLB đã đem đến những thí nghiệm thú vị, độc đáo, để lại ấn tượng sâu sắc cho các bạn học sinh Đan Mạch.",
      imageUrl: "https://ntthnue.edu.vn/uploads/Images/2024/06/013.JPG"
    },
    {
      title: "Trải nghiệm đáng nhớ tại Đài Loan",
      date: "10/05/2024",
      content: "Lần đầu tiên, đoàn giáo viên (GV) và học sinh đã có chuyến đi tới thủ đô Đài Bắc của Đảo Quốc Đài Loan xinh đẹp cùng với kết hợp của trường Đại học Quốc gia Đài Loan (NTU). Trong khoảng thời gian ngắn ngủi, đoàn đã có cơ hội tham quan khuôn viên trường Đại học Quốc gia Đài Loan, hiểu biết thêm về bề dày giáo dục, văn hóa và con người nơi đây.",
      imageUrl: "https://ntthnue.edu.vn/uploads/Images/2024/08/012.JPG"
    },
  ];

  return (
    <div className="font-sans max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-[#004D86] text-center mb-8">HỢP TÁC QUỐC TẾ</h1>
      {cooperationItems.map((item, index) => (
        <CooperationItem key={index} {...item} />
      ))}
      <button className="bg-yellow-400 text-black py-2 px-6 rounded text-lg font-semibold block mx-auto hover:bg-yellow-500 transition duration-300">
        Xem thêm
      </button>
    </div>
  );
};

export default InternationalCooperation;
