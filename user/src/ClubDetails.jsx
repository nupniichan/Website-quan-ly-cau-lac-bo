import { useParams } from 'react-router-dom';
import logoclb from '../public/imgs/logoclb.jpg';

const ClubDetails = () => {
  const { clubName } = useParams();

  // Ở đây bạn có thể thêm logic để lấy thông tin chi tiết của câu lạc bộ dựa trên clubName
  // Ví dụ: const clubInfo = getClubInfo(clubName);

  return (
    <div className="max-w-5xl mx-auto px-8 py-6 font-sans" style={{ paddingLeft: '50px', paddingRight: '50px' }}>
      <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: '#004D86' }}>{clubName}</h1>

      <div className="flex mb-8 items-center">
        <div className="w-1/4 pr-6 flex-shrink-0 flex items-center justify-center">
          <img src={logoclb} alt="Logo câu lạc bộ tin học" className="w-64 h-64 object-contain" />
        </div>
        <div className="w-3/4 flex items-center">
          <p className="text-gray-700 text-lg">
            Câu lạc bộ tin học là nơi dành cho các bạn đam mê công nghệ và lập trình.
            Tại đây, thành viên có cơ hội học hỏi về các ngôn ngữ lập trình như Python, Java, C++,...
            và tham gia vào các dự án thực tế, từ đó rèn luyện kỹ năng lập trình và làm việc nhóm.
          </p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4" style={{ color: '#004D86' }}>Một số thông tin về câu lạc bộ</h2>

      <div className="border rounded-lg overflow-hidden mb-4">
        <table className="w-full text-center">
          <thead>
            <tr className="bg-blue-100">
              <th className="border px-4 py-2 font-semibold text-blue-700 w-1/3">Lĩnh vực</th>
              <th className="border px-4 py-2 font-semibold text-blue-700 w-1/3">Ngày thành lập</th>
              <th className="border px-4 py-2 font-semibold text-blue-700 w-1/3">Thành viên tham gia</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2" style={{ backgroundColor: '#FCFEF6' }}>Công nghệ</td>
              <td className="border px-4 py-2" style={{ backgroundColor: '#FCFEF6' }}>02/02/2022</td>
              <td className="border px-4 py-2" style={{ backgroundColor: '#FCFEF6' }}>34 thành viên</td>
            </tr>
          </tbody>
        </table>
        <div className="p-4 bg-gray-50 text-center">
          <p className="mb-2">
            <span className="font-bold" style={{ color: '#004D86' }}>Giáo viên phụ trách:</span>
            <span className="font-medium text-black"> (Thầy/Cô) Nguyễn Văn B</span>
          </p>
          <p>
            <span className="font-bold" style={{ color: '#004D86' }}>Trưởng ban câu lạc bộ:</span>
            <span className="font-medium text-black"> Nguyễn Văn A</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClubDetails;
