import { Link } from 'react-router-dom';

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
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: '#004D86' }}>Danh sách câu lạc bộ tại trường</h1>
      
      <div className="grid grid-cols-3 gap-6 mb-8">
        {clubs.map((club, index) => (
          <Link 
            key={index}
            to={`/clubs/${encodeURIComponent(club)}`}
            className={`
              bg-red-600 text-white py-4 px-4 hover:bg-red-700 transition duration-300
              h-12 flex items-center justify-center w-full no-underline
              ${index % 3 === 0 ? 'rounded-tl-none rounded-tr-[20px] rounded-bl-[20px] rounded-br-none' : 
                index % 3 === 1 ? 'rounded-[20px]' : 
                'rounded-tl-[20px] rounded-tr-none rounded-bl-none rounded-br-[20px]'}
            `}
          >
            {club}
          </Link>
        ))}
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
