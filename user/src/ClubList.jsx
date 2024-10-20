import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const clubs = [
  'Câu lạc bộ tin học', 'Câu lạc bộ tình nguyện', 'Câu lạc bộ âm nhạc',
  'Câu lạc bộ nhiếp ảnh', 'Câu lạc bộ nhật ngữ', 'Câu lạc bộ anime',
  'Câu lạc bộ anh ngữ', 'Câu lạc bộ nhiếp ảnh', 'Câu lạc bộ 7SEC',
  'Câu lạc bộ hài kịch', 'Câu lạc bộ thể thao', 'Câu lạc bộ hội học sinh',
  'Câu lạc bộ bơi lội', 'Câu lạc bộ văn học cổ điển', 'Câu lạc bộ du lịch'
];

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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: '#004D86' }}>Danh sách câu lạc bộ tại trường</h1>
      
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-[1125px]">
          {clubs.map((club, index) => {
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
                key={index}
                to={`/clubs/${encodeURIComponent(club)}`}
                className="bg-red-600 text-white h-[55px] w-full sm:w-[325px] flex items-center justify-center cursor-pointer hover:bg-red-700 transition duration-300 no-underline"
                style={style}
              >
                <span className="text-center">{club}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="p-6 rounded-lg">
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
