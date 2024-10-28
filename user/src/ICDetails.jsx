import { useParams, Link } from 'react-router-dom'; // Import necessary hooks from react-router-dom
import { useEffect, useState } from 'react'; // Import useEffect and useState

const ICDetails = () => {
  const { id } = useParams(); // Get the article ID from the URL parameters
  const [article, setArticle] = useState(null); // State to store the article details
  const [loading, setLoading] = useState(true); // State for loading  

  // Define initial articles data
  const cooperationItems = [
    {
    id: '1',
    title: "Thắm tình hữu nghị Việt Nam - Singapore: khoảng cách địa lí không còn là rào cản",
    date: "05/09/2024",
    content: `Trong những ngày 17/09/2024, 18/09/2024 và 21/09/2024, Trường đã tổ chức chương trình giao lưu với học sinh trường Raffles (Singapore). 

    Để đảm bảo an toàn sau thời gian dịch bệnh, chương trình giao lưu được thực hiện qua hình thức trực tuyến trên Microsoft Teams. Chương trình tạo điều kiện để học sinh từ hai quốc gia chia sẻ văn hóa, phong tục tập quán và lối sống của mỗi nước. Học sinh Việt Nam chia sẻ về những nét đẹp văn hóa như áo dài, phở, và các phong tục trong ngày lễ Tết, trong khi các học sinh Singapore giới thiệu về sự đa dạng văn hóa và sự phát triển của đảo quốc.

    Với 50 học sinh từ cả hai trường tham gia, chương trình bao gồm các hoạt động thảo luận mở và tương tác, từ đó giúp các em hiểu rõ hơn về giá trị của giao lưu văn hóa. Học sinh cũng thảo luận về môi trường học tập, các kỹ năng và phương pháp học tập hiện đại. Một học sinh Singapore chia sẻ rằng: “Tôi thật sự thích cách các bạn Việt Nam học hỏi từ thực tế, điều đó giúp chúng tôi hiểu rõ hơn về văn hóa của các bạn.”

    Chương trình còn bao gồm các trò chơi tương tác, thuyết trình về các chủ đề như môi trường, công nghệ, và các vấn đề xã hội hiện nay. Những câu hỏi thảo luận mở đã tạo điều kiện cho học sinh thể hiện quan điểm của mình và lắng nghe ý kiến từ bạn bè quốc tế. Chương trình kết thúc với những cảm xúc tích cực, tạo dựng một cầu nối tình bạn và sự hiểu biết văn hóa giữa hai quốc gia. Các em học sinh đã gắn bó hơn, tạo nên tình bạn đẹp xuyên biên giới và xây dựng những kỷ niệm khó quên.`,
    imageUrl: "https://ntthnue.edu.vn/uploads/Images/2024/09/065.JPG"
},
{
    id: '2',
    title: "Giao lưu văn hóa Việt - Mỹ: Một cầu nối mới",
    date: "12/09/2024",
    content: `Vào ngày 25/09/2024, Trường đã tổ chức buổi giao lưu văn hóa giữa học sinh Việt Nam và Mỹ. 

    Chương trình thu hút hơn 100 học sinh từ cả hai quốc gia, tạo ra một không gian cởi mở và thân thiện để học sinh có thể tìm hiểu sâu sắc hơn về văn hóa và lối sống của nhau. Học sinh Việt Nam chia sẻ những trải nghiệm về ngày lễ truyền thống như Tết Nguyên Đán, trong khi các học sinh Mỹ giới thiệu các phong tục lễ hội của mình như Lễ Tạ Ơn và Giáng Sinh.

    Các hoạt động bao gồm các trò chơi thể thao, trình diễn văn nghệ và các hoạt động giao lưu như cùng nhau học tiếng Việt và tiếng Anh. Sự kiện cũng tổ chức những buổi thảo luận về sở thích, ẩm thực, và các thách thức trong học tập, qua đó giúp các em phát triển kỹ năng giao tiếp và sự tự tin.

    Sự kiện không chỉ là cầu nối văn hóa mà còn giúp các em vượt qua những định kiến và rào cản ngôn ngữ. Các học sinh Mỹ bày tỏ sự yêu thích các món ăn truyền thống Việt Nam như phở và bánh xèo, đồng thời chia sẻ mong muốn được đến thăm Việt Nam trong tương lai. Buổi giao lưu này đã để lại nhiều ấn tượng sâu sắc, mở ra cơ hội cho các em học sinh xây dựng mối quan hệ bền chặt giữa hai quốc gia.`,
    imageUrl: "https://ntthnue.edu.vn/uploads/Images/2024/09/066.JPG"
},
{
    id: '3',
    title: "Hợp tác quốc tế trong giáo dục: Những cơ hội mới",
    date: "20/09/2024",
    content: `Trường đã ký kết thỏa thuận hợp tác với các trường đại học hàng đầu tại châu Âu, mở ra nhiều cơ hội phát triển cho học sinh và giáo viên. 

    Chương trình hợp tác nhằm thúc đẩy các hoạt động trao đổi sinh viên, nghiên cứu, và các dự án học thuật chung. Học sinh sẽ có cơ hội tham gia các khóa học trực tuyến, hội thảo và nghiên cứu cùng các giáo sư từ châu Âu, từ đó nâng cao kỹ năng và kiến thức toàn cầu.

    Giáo viên cũng được hưởng lợi từ các buổi đào tạo và thảo luận chuyên môn với các giảng viên quốc tế, tạo điều kiện học hỏi những phương pháp giảng dạy tiên tiến. Những hoạt động này sẽ giúp học sinh Việt Nam phát triển tư duy độc lập, sáng tạo, và trang bị kỹ năng để thích ứng với thị trường lao động toàn cầu.

    Dự kiến chương trình sẽ triển khai từ tháng 11 năm 2024 với sự hỗ trợ từ các tổ chức giáo dục quốc tế. Học sinh được khuyến khích tham gia vào các hoạt động thực địa, tìm hiểu phương pháp giảng dạy và cách thức đánh giá sinh viên theo tiêu chuẩn quốc tế. Qua những hoạt động này, học sinh sẽ có cơ hội trở thành những công dân toàn cầu, góp phần nâng cao uy tín và chất lượng giáo dục của nhà trường.`,
    imageUrl: "https://ntthnue.edu.vn/uploads/Images/2024/09/067.JPG"
},
{
    id: '4',
    title: "Chương trình tình nguyện quốc tế: Hành trình của trái tim",
    date: "27/09/2024",
    content: `Vào tháng 10 năm 2024, Trường sẽ tổ chức chương trình tình nguyện quốc tế với sự tham gia của các tình nguyện viên từ nhiều quốc gia. 

    Chương trình này không chỉ giúp đỡ cộng đồng địa phương mà còn tạo điều kiện cho học sinh phát triển kỹ năng lãnh đạo và tinh thần trách nhiệm. Các tình nguyện viên sẽ tham gia các hoạt động như trồng cây, sửa chữa cơ sở hạ tầng công cộng và tổ chức các buổi tuyên truyền về bảo vệ môi trường.

    Ngoài ra, chương trình cũng tổ chức các buổi hội thảo nhỏ để học sinh có thể học hỏi từ các chuyên gia về cách phát triển bền vững. Tham gia chương trình, học sinh không chỉ có cơ hội tiếp xúc với các vấn đề xã hội mà còn được rèn luyện kỹ năng làm việc nhóm, quản lý thời gian, và lãnh đạo.

    Các tình nguyện viên sẽ được hướng dẫn bởi những người có kinh nghiệm, tạo điều kiện để học sinh hiểu rõ hơn về giá trị của việc giúp đỡ người khác. Chương trình hứa hẹn sẽ để lại những kỷ niệm đẹp và trải nghiệm khó quên trong hành trình học tập và phát triển của các em.`,
    imageUrl: "https://ntthnue.edu.vn/uploads/Images/2024/09/068.JPG"
},
{
    id: '5',
    title: "Hội thảo giáo dục quốc tế: Kết nối và chia sẻ",
    date: "10/10/2024",
    content: `Vào ngày 15/10/2024, Trường sẽ tổ chức một hội thảo giáo dục quốc tế với sự tham gia của các chuyên gia giáo dục từ nhiều quốc gia.

    Hội thảo tập trung vào việc chia sẻ các phương pháp giảng dạy hiện đại và khám phá cơ hội hợp tác giữa các trường học. Các phiên thảo luận bao gồm các chủ đề như ứng dụng công nghệ trong giáo dục, phương pháp khuyến khích sự sáng tạo, và cách tạo động lực học tập cho học sinh.

    Ngoài các phiên lý thuyết, hội thảo còn tổ chức các buổi thực hành, nơi giáo viên có thể trải nghiệm và áp dụng những phương pháp mới ngay tại lớp học. Các chuyên gia giáo dục cũng sẽ có buổi chia sẻ về cách đánh giá học sinh hiệu quả và các kỹ năng cần thiết để phát triển trong thế kỷ 21.

    Hội thảo này không chỉ mang lại kiến thức quý báu mà còn là cơ hội tuyệt vời để các giáo viên và học sinh kết nối và học hỏi từ những người cùng chí hướng trên khắp thế giới. Những chia sẻ từ các chuyên gia quốc tế sẽ giúp nâng cao chất lượng giảng dạy tại trường và mở ra hướng đi mới cho sự nghiệp giáo dục của giáo viên.`,
    imageUrl: "https://ntthnue.edu.vn/uploads/Images/2024/09/069.JPG"
},

{
  id: '6',
  title: "Chương trình trao đổi học sinh: Khám phá văn hóa",
  date: "20/10/2024",
  content: `Trường sẽ tổ chức chương trình trao đổi học sinh với một trường học tại Nhật Bản vào tháng 11 năm 2024. 

  Đây là một cơ hội không chỉ để học sinh Việt Nam khám phá văn hóa Nhật Bản mà còn để tạo dựng mối quan hệ với bạn bè quốc tế. Trong chương trình kéo dài một tuần này, học sinh sẽ tham gia vào nhiều hoạt động phong phú như học tiếng Nhật, tham dự các lớp văn hóa truyền thống, từ trà đạo đến nghệ thuật cắm hoa Ikebana.

  Bên cạnh đó, các em sẽ có cơ hội tham gia vào các chuyến tham quan các di tích lịch sử nổi tiếng tại Nhật Bản, giúp các em hiểu rõ hơn về bề dày lịch sử của quốc gia này. Thông qua những hoạt động thực tiễn, các em không chỉ học cách thích nghi với một môi trường văn hóa khác mà còn xây dựng kỹ năng tự lập và giao tiếp quốc tế.

  Chương trình cũng bao gồm các buổi thảo luận mở, nơi các em có thể chia sẻ suy nghĩ về sự khác biệt văn hóa, cùng nhau học hỏi và phát triển sự đồng cảm và tôn trọng. Kết thúc chương trình, các em sẽ viết lại những trải nghiệm đáng nhớ của mình và chia sẻ tại buổi tổng kết, giúp tất cả tham gia cùng nhìn lại những bài học quý giá đã thu hoạch được.`,
  imageUrl: "https://ntthnue.edu.vn/uploads/Images/2024/09/070.JPG"
},
{
  id: '7',
  title: "Sáng kiến hợp tác trong nghiên cứu khoa học",
  date: "01/11/2024",
  content: `Trường đã thiết lập một loạt các dự án hợp tác nghiên cứu khoa học với các trường đại học quốc tế hàng đầu. 

  Chương trình này mở ra cơ hội cho học sinh tiếp cận các công nghệ và phương pháp nghiên cứu tiên tiến, đồng thời phát triển kỹ năng tư duy phản biện và kỹ năng làm việc nhóm. Các lĩnh vực nghiên cứu bao gồm môi trường, công nghệ thông tin, và sức khỏe cộng đồng.

  Học sinh sẽ được hướng dẫn bởi các chuyên gia trong ngành và có cơ hội tham gia vào toàn bộ quy trình nghiên cứu từ lập kế hoạch, thu thập dữ liệu đến phân tích và báo cáo kết quả. Qua đó, các em có thể áp dụng kiến thức lý thuyết vào thực tiễn, đồng thời hiểu rõ hơn về các vấn đề quan trọng trong cộng đồng.

  Dự kiến, một số kết quả nghiên cứu sẽ được trình bày tại các hội nghị khoa học quốc tế, nơi học sinh có thể chia sẻ phát hiện của mình và học hỏi từ các nhà khoa học khác. Những trải nghiệm này không chỉ là cơ hội học tập mà còn góp phần xây dựng hồ sơ cá nhân ấn tượng cho các em học sinh.`,
  imageUrl: "https://ntthnue.edu.vn/uploads/Images/2024/09/071.JPG"
},
{
  id: '8',
  title: "Dự án bảo vệ môi trường: Hành động cho tương lai",
  date: "15/11/2024",
  content: `Trường sẽ triển khai dự án bảo vệ môi trường kéo dài trong một tháng vào cuối năm 2024. 

  Dự án sẽ tập trung vào việc nâng cao ý thức của học sinh về bảo vệ môi trường thông qua các hoạt động thực tiễn như trồng cây, dọn dẹp khu vực công cộng, và tổ chức các chiến dịch tuyên truyền. Mục tiêu là không chỉ giúp các em hiểu rõ hơn về vai trò của mỗi cá nhân trong việc bảo vệ hành tinh mà còn khuyến khích các em hành động để tạo ra sự thay đổi tích cực.

  Các em học sinh sẽ được phân chia thành các nhóm và đảm nhiệm các nhiệm vụ cụ thể, giúp rèn luyện kỹ năng làm việc nhóm, lãnh đạo, và lập kế hoạch. Đồng thời, các hoạt động sẽ kết hợp với các cuộc thi sáng tạo để khuyến khích các em đưa ra các sáng kiến bảo vệ môi trường.

  Dự án sẽ kết thúc bằng một buổi trình diễn nghệ thuật với các tác phẩm sáng tạo về môi trường, giúp lan tỏa thông điệp bảo vệ môi trường đến nhiều người hơn.`,
  imageUrl: "https://ntthnue.edu.vn/uploads/Images/2024/09/072.JPG"
},
{
  id: '9',
  title: "Cuộc thi tài năng trẻ: Thể hiện bản thân",
  date: "01/12/2024",
  content: `Trường sẽ tổ chức cuộc thi tài năng trẻ với quy mô lớn vào tháng 1 năm 2025, nhằm tạo sân chơi sáng tạo và hấp dẫn cho các học sinh thể hiện khả năng của mình. 

  Cuộc thi sẽ bao gồm các lĩnh vực nghệ thuật đa dạng như âm nhạc, khiêu vũ, diễn xuất, hội họa và sáng tác. Học sinh sẽ có cơ hội tỏa sáng trên sân khấu lớn, nơi các em có thể biểu diễn và thể hiện niềm đam mê của mình trước các bạn bè và thầy cô.

  Các phần thi sẽ được chấm bởi một ban giám khảo gồm những nghệ sĩ và chuyên gia đầu ngành, tạo động lực và mang đến những lời khuyên quý báu cho các em. Ngoài ra, cuộc thi sẽ có các giải thưởng hấp dẫn nhằm khuyến khích tinh thần sáng tạo của các em học sinh.

  Cuộc thi hứa hẹn sẽ không chỉ là cơ hội để học sinh thể hiện tài năng mà còn là nơi để các em giao lưu, học hỏi lẫn nhau, và xây dựng những mối quan hệ bạn bè lâu dài. Đây sẽ là một sự kiện đáng nhớ trong hành trình học tập của các em tại trường.`,
  imageUrl: "https://ntthnue.edu.vn/uploads/Images/2024/09/073.JPG"
},
{
  id: '10',
  title: "Chuyến đi thực địa: Khám phá và học hỏi",
  date: "15/12/2024",
  content: `Tháng 1 năm 2025, trường sẽ tổ chức chuyến đi thực địa kéo dài ba ngày cho học sinh đến các địa danh lịch sử và văn hóa nổi tiếng của Việt Nam. 

  Chuyến đi sẽ giúp các em không chỉ học tập mà còn trải nghiệm thực tế về lịch sử và văn hóa của đất nước. Học sinh sẽ được tham gia vào các hoạt động hướng dẫn bởi các chuyên gia lịch sử và tham dự các buổi hội thảo chuyên đề.

  Ngoài ra, chuyến đi sẽ bao gồm các hoạt động nhóm như giải mã kho báu tại các di tích và thử thách tìm hiểu văn hóa dân gian, tạo cơ hội cho học sinh rèn luyện kỹ năng giao tiếp, làm việc nhóm và phát triển khả năng giải quyết vấn đề.

  Chuyến đi sẽ không chỉ mang lại kiến thức bổ ích mà còn giúp các em tạo dựng những kỷ niệm đẹp đẽ và sâu sắc. Sau chuyến đi, các em sẽ viết lại nhật ký hành trình và chia sẻ tại buổi tổng kết, ghi dấu những trải nghiệm ý nghĩa đã có.`,
  imageUrl: "https://ntthnue.edu.vn/uploads/Images/2024/09/074.JPG"
}
  ];

  useEffect(() => {
    // Find the article by ID
    const foundArticle = cooperationItems.find(item => item.id === id);
    setArticle(foundArticle); // Set the found article to state
    setLoading(false); // Update loading state
  }, [id]);

  // Render loading message if article is still loading
  if (loading) return <div className="text-center">Loading...</div>;

  // Render not found message if article is not found
  if (!article) return <div className="text-center">Article not found</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      <h1 className="text-4xl font-bold text-[#004D86] mb-4">{article.title}</h1>
      <p className="text-gray-600 mb-4 text-lg">
        <span className="mr-1" aria-hidden="true">&#128337;</span> {/* Clock emoji */}
        {article.date}
      </p>
      <img 
        src={article.imageUrl} 
        alt={article.title} 
        className="w-full md:w-2/3 h-auto mb-4 object-cover mx-auto" // Adjusted size
      />
      <p className="text-gray-800 mb-4 text-lg">{article.content}</p>
      <Link to="/international-cooperation" className="bg-yellow-400 text-black py-3 px-8 rounded text-lg font-semibold block mx-auto hover:bg-yellow-500 transition duration-300">
        Quay lại
      </Link>
    </div>
  );
};

export default ICDetails;
