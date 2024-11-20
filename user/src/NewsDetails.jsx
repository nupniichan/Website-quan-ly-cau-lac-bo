import { useParams } from 'react-router-dom';

const NewsDetail = () => {
  const { id } = useParams(); // Get the news ID from the URL
  const newsItems = [
    {
      title: "Học sinh hào hứng trải nghiệm sự 'thay da đổi thịt' của trường",
      image: "../public/imgs/news1.jpg",
      date: "3/10/2024",
      description: "Chiều ngày 3/10/2024 tại Thành Phố Hồ Chí Minh, Trường THPT TPHCM đã tổ chức lễ ra mắt chương trình Luyện thi IELTS mới,...",
      content: `Với sự tham gia đông đảo của học sinh và phụ huynh, buổi lễ ra mắt chương trình Luyện thi IELTS mới tại Đà Nẵng đã thành công rực rỡ. Các em học sinh có cơ hội trải nghiệm các hoạt động ngoại khóa và rèn luyện kỹ năng giao tiếp bằng tiếng Anh với những tình huống thực tế, được hướng dẫn bởi các giảng viên giàu kinh nghiệm.
  
      Nguyễn Thanh Tùng, một học sinh tham dự buổi lễ, chia sẻ: "Em rất thích cách thầy cô tạo ra những tình huống thật để chúng em luyện tập. Trước đây, em chỉ học qua sách vở, nhưng giờ em có thể tự tin hơn khi nói chuyện."
  
      Trong buổi phỏng vấn sau sự kiện, cô Mai Hương, giảng viên lâu năm tại trung tâm, nhấn mạnh: "Chúng tôi không chỉ muốn học sinh đạt điểm cao mà còn muốn họ có kỹ năng ngôn ngữ thật sự. Vì thế, chương trình tập trung vào các tình huống giao tiếp thực tế để học sinh có thể sử dụng ngay lập tức."
  
      Chương trình được thiết kế linh hoạt với các cấp độ từ cơ bản đến nâng cao. Hơn 80% phụ huynh cho biết sẽ cho con em mình tham gia chương trình để đạt kết quả thi tốt nhất. Buổi lễ là một bước tiến mới trong việc nâng cao chất lượng giảng dạy tiếng Anh tại địa phương.`,
    },
    {
      title: "Nhiều trường và phụ huynh ủng hộ đi học lại sau Tết",
      image: "../public/imgs/news2.jpg",
      date: "3/10/2024",
      description: "Khi nhóm chat của phụ huynh xuất hiện câu hỏi \"Nếu trường mở cửa sau Tết, có cho con đi học không?\", chị Diệu Linh, 42 tuổi, nhanh chóng chọn \"Có\".",
      content: `Sau một thời gian dài học trực tuyến, nhiều phụ huynh và nhà trường tại các khu vực trong cả nước đã ủng hộ mạnh mẽ việc quay trở lại học tập trực tiếp. Theo khảo sát, hơn 90% phụ huynh cho rằng việc học trực tiếp sẽ giúp học sinh có cơ hội tương tác xã hội và tiếp thu kiến thức sâu sắc hơn.
  
      Chị Diệu Linh, một phụ huynh có hai con học tiểu học, chia sẻ trong buổi phỏng vấn: "Thời gian qua, học trực tuyến là cần thiết, nhưng tôi thấy con mình thiếu sự tương tác với bạn bè và thầy cô. Tôi rất vui vì các trường sẽ mở cửa trở lại."
  
      Phó hiệu trưởng Trường THPT Thành Công, ông Trần Văn Bình, cho biết: "Chúng tôi đã chuẩn bị các biện pháp phòng dịch nghiêm ngặt, đảm bảo an toàn tối đa cho học sinh và giáo viên. Mục tiêu của chúng tôi là mang lại một môi trường học tập an toàn và hiệu quả."
  
      Nhà trường còn lên kế hoạch tổ chức các hoạt động ngoại khóa sau giờ học, tạo điều kiện để học sinh thư giãn và gắn kết với bạn bè sau thời gian dài học trực tuyến.`,
    },
    {
      title: "Tích hợp tiếng Anh giúp người học gặt hái thành công",
      image: "../public/imgs/news3.jpg",
      date: "3/10/2024",
      description: "Chủ trương đưa tiếng Anh làm ngôn ngữ thứ hai gần đây là một bước tiến lớn nhằm giúp người học thành công trong cuộc sống và công việc.",
      content: `Việc tích hợp tiếng Anh vào chương trình giảng dạy là một bước ngoặt trong việc nâng cao khả năng cạnh tranh của học sinh trên thị trường lao động quốc tế.
  
      Phỏng vấn với chị Minh Anh, mẹ của một học sinh lớp 10, cho biết: "Tôi thấy con mình tự tin hơn rất nhiều. Cháu đã bắt đầu xem các tài liệu học tập bằng tiếng Anh và thậm chí là giao tiếp với các bạn quốc tế qua các dự án nhóm."
  
      Bà Trần Thị Lan, chuyên gia giáo dục tiếng Anh tại RMIT, nhận xét: "Khi học tiếng Anh thông qua các hoạt động thực tiễn và dự án nhóm, học sinh không chỉ học từ ngữ mà còn học cách giao tiếp và xử lý tình huống trong cuộc sống thực tế."
  
      Tính đến nay, hơn 95% học sinh trong chương trình cho rằng việc học tiếng Anh giúp họ tự tin hơn trong giao tiếp, mở ra nhiều cơ hội học tập và làm việc toàn cầu.`,
    },
    {
      title: "Hồi sinh di sản văn hóa với công nghệ 3D tiên tiến",
      image: "../public/imgs/news4.jpg",
      date: "7/10/2024",
      description: "Adobe tổ chức tập huấn cho các bảo tàng và trung tâm lưu trữ trong nước nhằm tìm hiểu về vai trò của công nghệ 3D bảo tồn văn hóa di sản bản địa.",
      content: `Với công nghệ 3D, các chuyên gia văn hóa đang có cơ hội hồi sinh các di sản lịch sử một cách chưa từng có. Trong buổi tập huấn, đại diện từ Adobe trình bày về cách công nghệ 3D có thể tái tạo hình ảnh và lưu trữ chi tiết của các hiện vật lịch sử.
  
      Chị Nguyễn Thị Mai, một nhân viên bảo tàng, chia sẻ: "Nhờ công nghệ 3D, chúng tôi có thể lưu giữ nguyên bản các hiện vật quý giá, tránh tình trạng hư hại khi trưng bày thường xuyên."
  
      Đại diện của Adobe, ông Mark Evans, cho biết: "Công nghệ 3D không chỉ giúp bảo tồn di sản mà còn tạo điều kiện cho người dân tiếp cận dễ dàng hơn qua các nền tảng kỹ thuật số, từ đó tăng cường hiểu biết và yêu quý di sản văn hóa."
  
      Việc áp dụng công nghệ này còn mở ra cơ hội để các bảo tàng tương tác với cộng đồng và học sinh, giúp thế hệ trẻ hiểu thêm về di sản văn hóa của đất nước.`,
    },
    {
      title: "Đưa bền vững vào giảng dạy truyền thông và thiết kế",
      image: "../public/imgs/news5.jpg",
      date: "5/10/2024",
      description: "Phù hợp với các Mục tiêu phát triển bền vững, 95,7% trong số đó đã tích hợp tính bền vững vào tài liệu giảng dạy và học tập.",
      content: `Sự kết hợp giữa truyền thông và thiết kế bền vững đã trở thành xu hướng giảng dạy mới tại các trường đại học trên toàn quốc.
  
      Sinh viên Lan Anh, người vừa tham gia khóa học truyền thông bền vững, cho biết: "Chúng em được hướng dẫn cách thiết kế các chiến dịch không chỉ thu hút mà còn thân thiện với môi trường. Điều này giúp em hiểu rõ hơn về trách nhiệm của người làm truyền thông đối với xã hội."
  
      Bà Nguyễn Thị Minh, trưởng khoa truyền thông, cho biết: "Bền vững không chỉ là chủ đề, mà là một giá trị cốt lõi trong các môn học. Chúng tôi hy vọng sinh viên của mình có thể trở thành những người tiên phong trong việc bảo vệ môi trường qua công việc của họ."
  
      Những nỗ lực này giúp sinh viên phát triển kỹ năng và ý thức trách nhiệm, tạo động lực để họ trở thành những nhà thiết kế có ảnh hưởng tích cực trong xã hội.`,
    },
    {
      title: "Chương trình học bổng giúp học sinh khó khăn",
      image: "../public/imgs/news6.jpg",
      date: "12/10/2024",
      description: "Trường phát động chương trình học bổng cho học sinh có hoàn cảnh khó khăn, nhằm hỗ trợ những em có thành tích học tập tốt nhưng gặp khó khăn về tài chính, giúp các em có cơ hội tiếp cận giáo dục chất lượng hơn.",
      content: `Trường trung học ABC đã khởi động chương trình học bổng dành cho học sinh có hoàn cảnh khó khăn. Chương trình này đã nhận được sự quan tâm lớn từ cộng đồng và các tổ chức xã hội.
  
      Phỏng vấn với em Hoàng Nam, một trong những học sinh nhận học bổng: "Em rất biết ơn trường đã hỗ trợ học bổng để em có thể tiếp tục học tập. Gia đình em khó khăn nên học bổng này là nguồn động viên lớn để em cố gắng."
  
      Bà Trần Thu Hà, trưởng ban cố vấn học bổng, cho biết: "Chúng tôi hy vọng chương trình học bổng sẽ giúp đỡ nhiều em học sinh có điều kiện học tập tốt hơn. Đây cũng là cách chúng tôi đóng góp cho cộng đồng."`,
    },
    {
      title: "Cuộc thi sáng tạo khoa học kỹ thuật năm 2024",
      image: "../public/imgs/news7.jpg",
      date: "15/10/2024",
      description: "Cuộc thi sáng tạo khoa học kỹ thuật cấp quốc gia năm nay thu hút hơn 2.000 học sinh từ khắp cả nước với những dự án đầy sáng tạo và tiềm năng.",
      content: `Cuộc thi khoa học kỹ thuật cấp quốc gia đã chứng kiến sự tham gia nhiệt tình của học sinh trên toàn quốc, với hơn 200 dự án ấn tượng.
  
      Nguyễn Anh Tuấn, học sinh lớp 12 và là tác giả của dự án đoạt giải Nhất, nói: "Em rất vui khi được tham gia và học hỏi từ các bạn đồng trang lứa. Dự án của em về năng lượng sạch đã được giám khảo đánh giá cao, điều này tạo động lực rất lớn cho em theo đuổi đam mê."
  
      Đại diện Ban giám khảo, bà Lê Thị Hoa, phát biểu: "Năm nay, chúng tôi rất ấn tượng bởi sự đa dạng và chất lượng cao của các dự án. Chúng tôi hy vọng những ý tưởng này sẽ tiếp tục được phát triển và mang lại giá trị cho xã hội."
  
      Đây là cơ hội quý báu để học sinh phát huy khả năng sáng tạo và ứng dụng kiến thức vào thực tế.`,
    },
    {
      title: "Sinh viên đạt thành tích cao trong cuộc thi quốc tế",
      image: "../public/imgs/news8.jpg",
      date: "20/10/2024",
      description: "Nhóm sinh viên đại học X đã giành chiến thắng trong cuộc thi công nghệ quốc tế với dự án sử dụng trí tuệ nhân tạo trong y tế.",
      content: `Đội tuyển sinh viên đại học X đã ghi dấu ấn khi giành chiến thắng cuộc thi công nghệ quốc tế tổ chức tại Nhật Bản. Dự án của họ tập trung vào việc sử dụng trí tuệ nhân tạo để cải thiện hiệu quả chăm sóc sức khỏe.
  
      Nguyễn Văn Hùng, trưởng nhóm dự án, chia sẻ: "Chúng tôi đã làm việc cật lực để phát triển mô hình AI hỗ trợ chẩn đoán sớm các bệnh mãn tính. Thành công này không chỉ là thành tựu của chúng tôi mà còn là động lực cho các sinh viên khác tiếp tục nghiên cứu và phát triển."
  
      Bà Mary Tanaka, đại diện tổ chức cuộc thi, cho biết: "Chúng tôi rất ấn tượng với khả năng sáng tạo và năng lực của các bạn trẻ Việt Nam. Dự án của các bạn là minh chứng cho tiềm năng phát triển của công nghệ trong y tế."
  
      Thành công của nhóm sinh viên đã góp phần nâng cao uy tín của Đại học X trên trường quốc tế và tạo động lực lớn cho các sinh viên trẻ tiếp tục sáng tạo.`,
    },
  ];
  
  
  

  const news = newsItems[id]; // Find the news item based on the ID

  if (!news) {
    return <div>News not found!</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-[#004D86] mb-4 text-center">{news.title}</h1>
      <img 
        src={news.image} 
        alt={news.title} 
        className="w-full max-w-2xl h-auto max-h-[400px] object-cover mb-4 mx-auto" 
      />
      <p className="text-gray-600 text-sm mb-2">{news.date}</p>
      <p className="text-gray-800 mb-4">{news.description}</p>
      <p className="text-gray-800">{news.content}</p> 
    </div>
  );
};

export default NewsDetail;

