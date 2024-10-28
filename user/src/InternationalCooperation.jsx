import PropTypes from 'prop-types'; // Import PropTypes
import { useState } from 'react'; // Import useState for state management
import { Link } from 'react-router-dom'; // Import Link for navigation

const CooperationItem = ({ title, date, content, imageUrl, id }) => (
  <Link to={`/international-cooperation/${id}`} className="flex mb-8 pb-8 border-b border-gray-200 no-underline">
    <img src={imageUrl} alt={title} className="w-[15rem] h-42 object-cover mr-6" />
    <div className="flex-1 space-y-4">
      <h3 className="text-[#000000] text-xl font-semibold mt-0">{title}</h3>
      <p className="text-gray-600 text-sm mb-2 flex items-center">
        <span className="mr-1" aria-hidden="true">&#128337;</span> {/* Clock emoji */}
        {date}
      </p>
      <p className="text-gray-800">{content}</p>
    </div>
  </Link>
);

// Define PropTypes for props validation
CooperationItem.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired, // Added id to PropTypes
};

const InternationalCooperation = () => {
  const initialCooperationItems = [
    // Existing articles with ids
    {
      id: '1',
      title: "Thắm tình hữu nghị Việt Nam - Singapore: khoảng cách địa lí không còn là rào cản",
      date: "05/09/2024",
      content: "Trong những ngày 17/09/2024, 18/09/2024 và 21/09/2024, Trường đã tổ chức chương trình giao lưu với học sinh trường Raffles (Singapore). Để đảm bảo an toàn sau hậu quả của thiên tai, chương trình giao lưu được thực hiện qua hình thức trực tuyến trên Microsoft Teams.",
      imageUrl: "https://ntthnue.edu.vn/uploads/Images/2024/09/065.JPG"
    },
    {
      id: '2',
      title: "Đón chào các giáo viên đến từ xứ sở Mặt trời mọc",
      date: "01/09/2024",
      content: "Ngày 27/09/2024 vừa qua, trường rất vinh dự khi được đón tiếp những vị khách quý đến từ xứ sở Mặt trời mọc - các giáo viên của Trường Trung học Miyazaki (Nhật Bản). Các thầy cô đã có những giây phút gặp gỡ, trao đổi về hành trình hợp tác bền vững giữa hai ngôi trường và cùng tham gia chuyến đi đến Bảo tàng Dân tộc học Việt Nam để hiểu nhau hơn.",
      imageUrl: "https://ntthnue.edu.vn/uploads/Images/2024/10/035.JPG"
    },
    {
      id: '3',
      title: "Trải nghiệm, lên ý tưởng và thí nghiệm mô hình nông nghiệp cùng học sinh trường Miyazaki (Nhật Bản)",
      date: "20/07/2024",
      content: "Đến với trường, các bạn học sinh Nhật Bản từ trường Miyazaki đã có cơ hội được trải nghiệm tại phòng thí nghiệm Nông nghiệp ĐHCN Quốc gia. Buổi trải nghiệm cùng thành viên CLB Khoa học (SPC) đã đem đến nhiều kiến thức bổ ích, thú vị cho các bạn học sinh Nhật Bản.",
      imageUrl: "../public/imgs/news4.jpg"
    },
    {
      id: '4',
      title: "Trải nghiệm STEM cùng học sinh trường Frederiksborg Gymnasium (Đan Mạch)",
      date: "15/06/2024",
      content: "Chiều thứ năm (26/10/2023) vừa qua, đoàn học sinh trường Frederiksborg đã có một buổi trải nghiệm STEM do CLB Khoa học (SPC - Science Passion Club) tổ chức. Thành viên trong CLB đã đem đến những thí nghiệm sáng tạo, độc đáo, để lại ấn tượng sâu sắc cho những người bạn Đan Mạch.",
      imageUrl: "https://ntthnue.edu.vn/uploads/Images/2024/06/013.JPG"
    },
    {
      id: '5',
      title: "Trải nghiệm đáng nhớ tại Đài Loan",
      date: "10/05/2024",
      content: "Lần đầu tiên, đoàn giáo viên (GV) và học sinh đã có chuyến đi tới thủ đô Đài Bắc của hòn đảo Đài Loan xinh đẹp cùng với sự kết nối của trung tâm Du học Đài Loan Ưu Việt. Trong khoảng thời gian ngắn, đoàn đã có cơ hội tham quan, trải nghiệm hướng nghiệp tại ba trường Đại học lớn của đất nước Đài Loan, hiểu biết thêm về bề dày giáo dục, văn hóa, về cuộc sống và con người nơi đây. ",
      imageUrl: "https://ntthnue.edu.vn/uploads/Images/2024/08/012.JPG"
    },
    {
      id: '6',
      title: "Chương trình trao đổi văn hóa Việt Nam - Hàn Quốc",
      date: "12/08/2024",
      content: "Chương trình trao đổi văn hóa Việt Nam - Hàn Quốc đã diễn ra sôi nổi, với sự tham gia nhiệt tình của học sinh và giáo viên từ hai quốc gia. Trong suốt tuần lễ giao lưu, học sinh Việt Nam và Hàn Quốc cùng nhau tham gia vào các hoạt động văn hóa phong phú như học tiếng Việt, tiếng Hàn, và cùng nhau trải nghiệm các món ăn truyền thống. Các buổi biểu diễn nghệ thuật được tổ chức hàng ngày, từ múa nón Việt Nam, trình diễn K-pop, đến các tiết mục nhạc cụ dân tộc. Học sinh từ hai nước cũng có dịp chia sẻ những phong tục tập quán đặc trưng và khám phá những điểm tương đồng, khác biệt trong lối sống của nhau. Chương trình không chỉ giúp các em mở rộng hiểu biết về văn hóa đối tác mà còn gắn kết tình hữu nghị giữa Việt Nam và Hàn Quốc, mở ra cơ hội cho những lần hợp tác và giao lưu trong tương lai.",
      imageUrl: "https://ntthnue.edu.vn/uploads/Images/2024/08/021.JPG"
    },
    {
      id: '7',
      title: "Hội thảo quốc tế về giáo dục STEM",
      date: "22/04/2024",
      content: "Hội thảo quốc tế về giáo dục STEM diễn ra tại Hà Nội, thu hút sự tham gia của các chuyên gia giáo dục và giảng viên hàng đầu từ hơn 10 quốc gia. Trong sự kiện, nhiều phương pháp giảng dạy mới mẻ và sáng tạo được giới thiệu, bao gồm các mô hình học tập thực hành, tích hợp công nghệ hiện đại vào lớp học, và cách khuyến khích tư duy phản biện. Các chuyên gia chia sẻ cách áp dụng STEM vào các môn học phổ thông, giúp học sinh có trải nghiệm học tập gắn liền với thực tiễn. Ngoài ra, hội thảo cũng cung cấp các buổi thảo luận nhóm, nơi các giáo viên có thể giao lưu và trao đổi kinh nghiệm, đóng góp vào sự phát triển của giáo dục STEM tại Việt Nam.",
      imageUrl: "https://ntthnue.edu.vn/uploads/Images/2024/04/010.JPG"
    },
    {
      id: '8',
      title: "Chuyến thăm quan trường học tại Thái Lan",
      date: "10/03/2024",
      content: "Vào tháng 3, đoàn học sinh và giáo viên của trường đã thực hiện chuyến thăm quan các cơ sở giáo dục tiêu biểu tại Thái Lan. Chuyến đi kéo dài một tuần, mang đến cho các em học sinh cơ hội học hỏi về phương pháp giảng dạy đa dạng và phong cách quản lý lớp học của các thầy cô Thái Lan. Ngoài tham quan lớp học và giao lưu với học sinh địa phương, đoàn còn có cơ hội tham dự các buổi hội thảo với giảng viên Thái Lan để trao đổi kiến thức và kinh nghiệm. Chuyến đi là cơ hội tuyệt vời giúp học sinh hiểu rõ hơn về văn hóa và nền giáo dục của nước bạn, tạo cầu nối cho các hoạt động giao lưu quốc tế sau này.",
      imageUrl: "https://ntthnue.edu.vn/uploads/Images/2024/03/015.JPG"
    },
    {
      id: '9',
      title: "Giao lưu thể thao quốc tế",
      date: "18/01/2024",
      content: "Sự kiện giao lưu thể thao quốc tế diễn ra sôi nổi với sự tham gia của các trường học đến từ Nhật Bản, Hàn Quốc, và Philippines. Các bộ môn thể thao bao gồm bóng đá, bóng chuyền, và cầu lông đã mang lại nhiều trải nghiệm bổ ích và khơi dậy tinh thần đồng đội giữa các quốc gia. Học sinh từ các nước khác nhau có cơ hội hiểu hơn về văn hóa thể thao của nhau và thiết lập những tình bạn mới. Ngoài các trận đấu, các em còn tham gia các buổi tập huấn và chia sẻ kỹ năng với nhau. Sự kiện kết thúc với buổi lễ trao giải và tiệc giao lưu, tạo nên những kỷ niệm đẹp và thúc đẩy tinh thần đoàn kết quốc tế.",
      imageUrl: "https://ntthnue.edu.vn/uploads/Images/2024/01/025.JPG"
    },
    {
      id: '10',
      title: "Workshop về nghệ thuật truyền thống Việt Nam",
      date: "05/12/2023",
      content: "Workshop về nghệ thuật truyền thống Việt Nam là một sự kiện đáng chú ý nhằm gìn giữ và phát huy các giá trị văn hóa dân tộc trong học sinh. Tại chương trình, các em học sinh được hướng dẫn và tham gia vào các hoạt động trải nghiệm như làm nón lá, viết thư pháp, và chơi nhạc cụ dân tộc. Sự kiện cũng giới thiệu các nghệ nhân lâu năm, những người trực tiếp truyền dạy các kỹ năng độc đáo và câu chuyện lịch sử phía sau từng bộ môn nghệ thuật. Chương trình không chỉ là một cơ hội để học sinh khám phá những giá trị văn hóa phong phú của đất nước, mà còn giúp các em thêm yêu quý và tự hào về truyền thống quê hương.",
      imageUrl: "https://ntthnue.edu.vn/uploads/Images/2023/12/011.JPG"
    },
  ];

  const [showMore, setShowMore] = useState(false);

  const toggleShowMore = () => {
    setShowMore((prev) => !prev);
  };

  return (
    <div className="font-sans max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-[#004D86] text-center mb-8">HỢP TÁC QUỐC TẾ</h1>
      {initialCooperationItems.map((item, index) => (
        <CooperationItem key={index} {...item} />
      ))}
      {showMore && additionalCooperationItems.map((item, index) => (
        <CooperationItem key={index + initialCooperationItems.length} {...item} />
      ))}
      <button 
        className="bg-yellow-400 text-black py-2 px-6 rounded text-lg font-semibold block mx-auto hover:bg-yellow-500 transition duration-300"
        onClick={toggleShowMore}
      >
        {showMore ? 'Ẩn bớt' : 'Xem thêm'}
      </button>
    </div>
  );
};

export default InternationalCooperation;
