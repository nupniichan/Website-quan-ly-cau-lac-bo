import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = "http://localhost:5500/api";

const ClubDetails = () => {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await axios.get(`${API_URL}/get-clubs`);
        setClubs(response.data);
        if (response.data.length > 0) {
          setSelectedClub(response.data[0]);
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách câu lạc bộ:', error);
        setError("Không thể tải danh sách câu lạc bộ");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClubs();
  }, []);

  const handleClubSelect = (club) => {
    setSelectedClub(club);
  };

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Lỗi: {error}</p>
        <button onClick={() => navigate('/')}>Quay lại trang chủ</button>
      </div>
    );
  }

  if (clubs.length === 0) {
    return <div>Không có thông tin câu lạc bộ.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-8 py-6 font-sans">
      <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: '#004D86' }}>Danh sách Câu Lạc Bộ</h1>
      
      <div className="mb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {clubs.map((club) => (
          <button
            key={club._id}
            onClick={() => handleClubSelect(club)}
            className={`p-2 border rounded text-center transition-colors duration-200 ${
              selectedClub?._id === club._id ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-100'
            }`}
          >
            {club.ten}
          </button>
        ))}
      </div>

      {selectedClub && (
        <div>
          <h2 className="text-xl font-bold mb-4" style={{ color: '#004D86' }}>{selectedClub.ten}</h2>
          
          <div className="flex mb-8 items-center">
            <div className="w-1/4 pr-6 flex-shrink-0 flex items-center justify-center">
              <img 
                src={selectedClub.logo ? `${API_URL}/${selectedClub.logo}` : "/imgs/logoclb.jpg"} 
                alt={`Logo ${selectedClub.ten}`} 
                className="w-64 h-64 object-contain"
              />
            </div>
            <div className="w-3/4 flex items-center">
              <p className="text-gray-700 text-lg">{selectedClub.mieuTa}</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-4" style={{ color: '#004D86' }}>Thông tin chi tiết</h3>
          
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
                  <td className="border px-4 py-2" style={{ backgroundColor: '#FCFEF6' }}>{selectedClub.linhVucHoatDong}</td>
                  <td className="border px-4 py-2" style={{ backgroundColor: '#FCFEF6' }}>{new Date(selectedClub.ngayThanhLap).toLocaleDateString()}</td>
                  <td className="border px-4 py-2" style={{ backgroundColor: '#FCFEF6' }}>Đang cập nhật</td>
                </tr>
              </tbody>
            </table>
            <div className="p-4 bg-gray-50 text-center">
              <p className="mb-2">
                <span className="font-bold" style={{ color: '#004D86' }}>Giáo viên phụ trách:</span>
                <span className="font-medium text-black"> {selectedClub.giaoVienPhuTrach}</span>
              </p>
              <p>
                <span className="font-bold" style={{ color: '#004D86' }}>Trưởng ban câu lạc bộ:</span>
                <span className="font-medium text-black"> {selectedClub.truongBanCLB}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubDetails;
