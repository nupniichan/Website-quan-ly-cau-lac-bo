import  { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaBookReader, FaBrain, FaGlobeAmericas, FaLaptop } from 'react-icons/fa';

const API_URL = "http://localhost:5500/api";

const Homepage = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  let isDown = false;
  let startX;
  let scrollLeft;

  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllClubs, setShowAllClubs] = useState(false);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/get-clubs`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setClubs(data);
    } catch (error) {
      console.error("Error fetching clubs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowAllClubs = () => {
    setShowAllClubs(!showAllClubs);
  };

  const displayedClubs = clubs.slice(0, 9);

  const handleMouseDown = (e) => {
    isDown = true;
    scrollContainerRef.current.classList.add('active');
    startX = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeft = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown = false;
    scrollContainerRef.current.classList.remove('active');
  };

  const handleMouseUp = () => {
    isDown = false;
    scrollContainerRef.current.classList.remove('active');
  };

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1; // Tăng tốc độ kéo
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

//   const handleClubClick = () => {
//     navigate(`${API_URL}/get-club/${clubId}`);  // This will navigate to the ClubList page
//   };

  const handleViewMoreClubs = () => {
    navigate('/clubs');
  };

  return (
    <div>
      {/* Banner Section */}
      <div className="relative">
        <img src="../public/imgs/banner.jpg" alt="Trường trung học phổ thông" className="w-full object-cover h-[300px] sm:h-[400px] md:h-[500px]"/>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 p-4 sm:p-6 border-t-4 border-black w-11/12 sm:w-5/6 md:w-4/6"
             style={{
               fontFamily: 'Roboto, sans-serif',
               fontWeight: 300,
               backgroundColor: 'rgba(0, 0, 0, 0.65)'
             }}>
          <div className="text-left">
            <div className="w-16 sm:w-24 h-px bg-white mb-2 sm:mb-3"></div>
            <h1 className="text-white text-xl sm:text-2xl md:text-4xl font-bold mb-2 sm:mb-3">Trường trung học phổ thông</h1>
            <p className="text-white text-xs sm:text-sm md:text-base">
              Mang lại trải nghiệm học tập tốt nhất cho bạn, trau dồi kỹ năng học hỏi và kết bạn,
              đồng thời tạo ra môi trường thân thiện, giúp bạn phát triển bản thân một cách toàn diện.
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto mt-8 px-4">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 text-[#004D86]">Tìm kiếm</h2>
        <div className="flex flex-col items-center">
          <div className="w-full bg-[#EFEFEF] p-2 rounded-lg">
            <div className="w-full bg-white rounded-lg shadow-md overflow-hidden flex">
              <input
                type="text"
                placeholder="Bạn cần tìm gì?"
                className="flex-grow px-4 py-2 focus:outline-none"
              />
              <button className="bg-red-600 text-white px-6 hover:bg-red-700 transition duration-300">
                Tìm kiếm
              </button>
            </div>
          </div>
          <div className="flex flex-wrap justify-center mt-4 gap-2">
            <button className="px-4 py-2 border border-[#004D86] rounded-full text-[#004D86] hover:bg-[#004D86] hover:text-white transition duration-300">
              Câu lạc bộ
            </button>
            <button className="px-4 py-2 border border-[#004D86] rounded-full text-[#004D86] hover:bg-[#004D86] hover:text-white transition duration-300">
              Điểm tuyển sinh
            </button>
            <button className="px-4 py-2 border border-[#004D86] rounded-full text-[#004D86] hover:bg-[#004D86] hover:text-white transition duration-300">
              Chương trình học
            </button>
          </div>
        </div>
      </div>

      {/* Curriculum Info Section */}
      <div className="bg-[#F5F5F5] py-8 sm:py-12 px-4 md:px-8 mt-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-[#004D86] mb-8 sm:mb-12 text-left">
            Tìm hiểu về chương trình học tập tại trường
          </h2>

          {/* Desktop version */}
          <div className='hidden lg:flex h-[25rem] pt-1'>
            <div className='w-1/2 h-auto flex flex-col justify-center'>
              <h3 className="text-2xl font-semibold mb-4">Chương trình giáo dục phổ thông</h3>
              <button className="bg-[#004D86] text-white px-4 py-2 rounded-full hover:bg-red-600 transition duration-300"></button>
            </div>
            <div className='w-1/2 h-auto relative'>
      <img
        src="../public/imgs/cachdaotao.jpg"
        alt="Curriculum Infographic"
        className="absolute top-0 left-0 w-2/4 h-full object-contain"
      />              <div className="absolute top-0 left-0 w-full h-full">
                <p className="text-sm absolute top-[4%] left-[24%]">Chú trọng phát triển năng lực cá nhân, nhấn mạnh việc <b>rèn luyện kĩ năng  bồi đắp phẩm chất</b></p>
                <p className="text-sm absolute top-[25%] left-[36%]">Cách tiếp cận học tập chủ động thông qua <b>trải nghiệm, suy ngẫm</b></p>
                <p className="text-sm absolute top-[44%] left-[25%]">Tập trung <b>phát triển tư duy bậc cao</b> cho học sinh như phân tích, đánh giá, sáng tạo</p>
                <p className="text-sm absolute top-[63%] left-[36%]">Giúp học sinh vừa <b>hội nhập toàn cầu</b>, vừa <b>giữ gìn và phát huy bản sắc Việt Nam</b></p>
                <p className="text-sm absolute top-[85%] left-[24%]">Học sinh có thể <b>học mọi lúc mọi nơi</b>, kết hợp giữa việc tự học thông qua nền tảng công nghệ và học tập chuyên sâu tại lớp</p>
              </div>
            </div>
          </div>

          {/* Mobile and Tablet version */}
          <div className="lg:hidden space-y-4 sm:space-y-6">
            <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
              <FaGraduationCap className="text-4xl text-[#004D86]" />
              <p className="text-sm">Chú trọng phát triển năng lực cá nhân, nhấn mạnh việc rèn luyện kĩ năng – bồi đắp phẩm chất</p>
            </div>
            <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
              <FaBookReader className="text-4xl text-[#004D86]" />
              <p className="text-sm">Cách tiếp cận học tập chủ động thông qua trải nghiệm, suy ngẫm</p>
            </div>
            <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
              <FaBrain className="text-4xl text-[#004D86]" />
              <p className="text-sm">Tập trung phát triển tư duy bậc cao cho học sinh như phân tích, đánh giá, sáng tạo</p>
            </div>
            <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
              <FaGlobeAmericas className="text-4xl text-[#004D86]" />
              <p className="text-sm">Giúp học sinh vừa hội nhập toàn cầu, vừa giữ gìn và phát huy bản sắc Việt Nam</p>
            </div>
            <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
              <FaLaptop className="text-4xl text-[#004D86]" />
              <p className="text-sm">Học sinh có thể học mọi lúc mọi nơi, kết hợp giữa việc tự học thông qua nền tảng công nghệ và học tập chuyên sâu tại lớp</p>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-white py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-[#004D86] mb-12">
            Thành tựu nổi bật
          </h2>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 md:space-x-4">
            <div className="flex flex-col items-center text-center max-w-xs mt-6">
              <img src="../public/imgs/icon-achievement-1.png" alt="Global Education" className="w-20 h-auto mb-4" />
              <p className="text-sm text-gray-600">Trường học kết hợp phương pháp giảng dạy mới nhất mang lại kết quả tốt nht</p>
            </div>
            <div className="flex flex-col items-center text-center max-w-xs">
              <img src="../public/imgs/icon-achievement-2.png" alt="30 Years Experience" className="w-20 h-25 mb-4" />
              <p className="text-sm text-gray-600">Kinh nghiệm 30 năm giảng dạy chuyên ngành bằng ngoại ngữ</p>
            </div>
            <div className="flex flex-col items-center text-center max-w-xs">
              <img src="../public/imgs/icon-achievement-3.png" alt="Education Quality" className="w-20 h-25 mb-4" />
              <p className="text-sm text-gray-600">Đạt kiểm định chất lượng giáo dục về chương trình đào tạo và cơ sở giáo dục</p>
            </div>
          </div>
        </div>
      </div>

      {/* Career Guidance and Admissions Section */}
      <div className="flex flex-col md:block">
        {/* Background image for all devices */}
        <div
          className="relative bg-cover bg-center h-[200px] sm:h-[300px] md:h-[24rem] w-full"
          style={{backgroundImage: "url('../public/imgs/careers.jpg')"}}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-70"></div>

          {/* Text overlay for medium and larger screens */}
          <div className="hidden md:flex items-end h-full">
            <div className="max-w-6xl mx-auto relative z-10 w-full pb-[7rem] px-4 md:px-2">
              <div className="md:w-2/3 lg:w-1/2">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Hướng nghiệp - tuyển sinh cho học sinh
                </h2>
                <p className="text-md text-white">
                  Có rất nhiều hoạt động và dịch vụ hỗ trợ các bạn học sinh lên kế hoạch và
                  đưa ra các quyết định về nghề nghiệp, cũng như tìm được ngành nghề
                  phù hợp sau khi tốt nghiệp. Chuẩn bị cho việc hướng nghiệp, Kế hoạch và
                  Quyết định nghề nghiệp, Các Chương trình và Sự kiện Hướng nghiệp.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Text content for mobile and tablet */}
        <div className="md:hidden px-4 py-6 sm:py-8 bg-[#F5F5F5]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#004D86] mb-4">
              Hướng nghiệp - tuyển sinh cho học sinh
            </h2>
            <p className="text-sm sm:text-base text-gray-700">
              Có rất nhiều hoạt động và dịch vụ hỗ trợ các bạn học sinh lên kế hoạch và
              đưa ra các quyết định về nghề nghiệp, cũng như tìm được ngành nghề
              phù hợp sau khi tốt nghiệp. Chuẩn bị cho việc hướng nghiệp, Kế hoạch và
              Quyết định nghề nghiệp, Các Chương trình và Sự kiện Hướng nghiệp.
            </p>
          </div>
        </div>
      </div>

      {/* School Clubs Section */}
      <div className="bg-white py-8 sm:py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-[#004D86] mb-8 sm:mb-12">
            Các câu lạc bộ tại trường
          </h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p>Đang tải...</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-[1125px]">
                {displayedClubs.map((club, index) => {
                  const column = index % 3;
                  let style = {};

                  if (window.innerWidth >= 1024) {
                    if (column === 0) {
                      style = {
                        borderTopRightRadius: '20px',
                        borderBottomLeftRadius: '20px'
                      };
                    } else if (column === 1) {
                      style = {
                        borderRadius: '20px'
                      };
                    } else {
                      style = {
                        borderTopLeftRadius: '20px',
                        borderBottomRightRadius: '20px'
                      };
                    }
                  } else {
                    style = {
                      borderRadius: '20px'
                    };
                  }

                  return (
                    <div
                      key={club._id}
                      className="bg-red-600 text-white h-[55px] w-full sm:w-[325px] flex items-center justify-center cursor-pointer hover:bg-red-700 transition duration-300"
                      style={style}
                      onClick={() => navigate(`/clubs/${club.clubId}`)}
                    >
                      <span className="text-center">{club.ten}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div className="text-center mt-8 sm:mt-12">
            <button
              className="bg-yellow-400 text-black px-6 py-3 rounded-full hover:bg-yellow-500 transition duration-300"
              onClick={handleViewMoreClubs}
            >
              Xem thêm
            </button>
          </div>
        </div>
      </div>

      {/* News Section */}
      <div className="bg-white pt-0 pb-8 sm:pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-[#004D86] mb-6 sm:mb-8">
            Tin tức & sự kiện
          </h2>
          <div className="overflow-x-auto pb-6 select-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', overflow: 'hidden' }}
               onMouseDown={handleMouseDown}
               onMouseLeave={handleMouseLeave}
               onMouseUp={handleMouseUp}
               onMouseMove={handleMouseMove}
               ref={scrollContainerRef}>
            <div className="flex space-x-4 sm:space-x-6 min-w-max">
              {[
                {
                  title:
                    "Học sinh hào hứng trải nghiệm sự 'thay da đổi thịt' của trường",
                  image: "../public/imgs/news1.jpg",
                  date: "3/10/2024",
                  description:
                    "Chiều ngày 3/10/2024 tại Đà Nẵng, Trung tâm ngoại ngữ Đại học RMIT tại Đà Nẵng đã tổ chức lễ ra mắt chương trình Luyện thi IELTS mới,...",
                },
                {
                  title: "Nhiều trường và phụ huynh ủng hộ đi học lại sau Tết",
                  image: "../public/imgs/news2.jpg",
                  date: "3/10/2024",
                  description:
                    "Khi nhóm chat của phụ huynh xuất hiện câu hỏi \"Nếu trường mở cửa sau Tết, có cho con đi học không?\", chị Diệu Linh, 42 tuổi, nhanh chóng chn \"Có\".",
                },
                {
                  title: "Tích hợp tiếng Anh giúp người học gặt hái thành công",
                  image: "../public/imgs/news3.jpg",
                  date: "3/10/2024",
                  description:
                    "Chủ trương đưa tiếng Anh ngôn ngữ thứ hai gần đây là một bước tiến lớn nhằm tiếp tục giúp người học thành công trong cuộc sống và công việc.",
                },
                {
                  title: "Hồi sinh di sản văn hóa với công nghệ 3D tiên tiến",
                  image: "../public/imgs/news4.jpg",
                  date: "7/10/2024",
                  description:
                    "Adobe tổ chức tập huấn cho các bảo tàng và trung tâm lưu trữ trong nước nhằm tìm hiểu về vai trò của công nghệ 3D bảo tồn văn hóa di sản bản địa..",
                },
                {
                  title: "Đưa bền vững vào giảng dạy truyền thông và thiết kế",
                  image: "../public/imgs/news5.jpg",
                  date: "5/10/2024",
                  description:
                    "Phù hợp với các Mục tiêu phát triển bền vững và 95,7% trong số đó được tích hợp tính bền vững vào tài liệu giảng dạy và học tập.",
                },
                // Add more news items here if needed
              ].map((news, index) => (
                <div
                  key={index}
                  className="w-[300px] bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
                >
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 text-[#004D86]">
                      {news.title}
                    </h3>
                    <div className="flex items-center text-gray-500 text-sm mb-2">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                      {news.date}
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {news.description}
                    </p>
                    <button className="mt-auto bg-[#004D86] text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300">
                      Xem thêm
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
