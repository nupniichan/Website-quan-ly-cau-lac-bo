import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const API_URL = "http://4.242.20.80:5000/api";

const requirements = [
  {
    text: 'Câu lạc bộ phải có ít nhất từ ',
    bold: '4 thành viên',
    rest: ' trở lên và có 1 thành viên đảm nhận vai trò quản lý'
  },
  {
    text: 'Câu lạc bộ phải có ',
    bold: 'mục tiêu hoạt động',
    rest: ' rõ ràng và phù hợp với các quy định chung.'
  },
  {
    text: 'Tên câu lạc bộ cần mang tính ',
    bold: 'sáng tạo',
    rest: ' và không trùng lặp với các câu lạc bộ đã có.'
  },
  {
    text: 'Câu lạc bộ phải có kế hoạch tổ chức ',
    bold: 'ít nhất',
    rest: ' một sự kiện hoặc tham gia giải mỗi 2 tháng.'
  },
  {
    text: 'Câu lạc bộ cần có một ',
    bold: 'biểu tượng (logo)',
    rest: ' hoặc khẩu hiệu riêng để tạo dấu ấn.'
  }
];

const ClubList = () => {
  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllClubs, setShowAllClubs] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    fetchClubs();
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    return () => window.removeEventListener('resize', handleResize);
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

  const displayedClubs = showAllClubs ? clubs : clubs.slice(0, 6);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: '#004D86' }}>Danh sách câu lạc bộ tại trường</h1>
      
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
              
              if (windowWidth >= 1024) { // Large screens (lg and above)
                if (column === 0) { // Left column
                  style = {
                    borderTopRightRadius: '20px',
                    borderBottomLeftRadius: '20px'
                  };
                } else if (column === 1) { // Middle column
                  style = {
                    borderRadius: '20px'
                  };
                } else { // Right column
                  style = {
                    borderTopLeftRadius: '20px',
                    borderBottomRightRadius: '20px'
                  };
                }
              } else { // Small and medium screens
                style = {
                  borderRadius: '20px'
                };
              }

              return (
                <Link 
                  key={club.clubId}
                  to={`/clubs/${club.clubId}`}
                  className="bg-red-600 text-white h-[55px] w-full sm:w-[325px] flex items-center justify-center cursor-pointer hover:bg-red-700 transition duration-300 no-underline"
                  style={style}
                >
                  <span className="text-center">{club.ten}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {clubs.length > 6 && (
        <div className="text-center mt-8 sm:mt-12">
          <button 
            className="bg-yellow-400 text-black px-6 py-3 rounded-full hover:bg-yellow-500 transition duration-300"
            onClick={toggleShowAllClubs}
          >
            {showAllClubs ? "Thu gọn" : "Xem thêm"}
          </button>
        </div>
      )}

      <div className="p-6 rounded-lg mt-8">
        <h2 className="text-xl font-semibold mb-4 text-[#004D86]">Không có câu lạc bộ bạn ưa thích?</h2>
        <p className="mb-4">Bạn có thể tự đăng ký câu lạc bộ mà bạn ưa thích chỉ với các điều kiện:</p>
        <ol className="list-none">
          {requirements.map((req, index) => (
            <li key={index} className="mb-2 bg-[#FCFEF6] p-3 rounded-lg shadow flex">
              <span className="mr-2 font-bold">{index + 1}/</span>
              <span>
                {req.text}
                <strong>{req.bold}</strong>
                {req.rest}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <p className="mt-4 text-center font-semibold text-lg text-[#004D86] ">
        Bạn đã sẵn sàng thành lập nên câu lạc bộ và tạo ra kỷ niệm cho thời học sinh của mình chưa?
      </p>
    </div>
  );
};

export default ClubList;
