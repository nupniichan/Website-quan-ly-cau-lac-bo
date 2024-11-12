import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = "http://4.242.20.80:5000/api";

const ClubDetails = () => {
  const navigate = useNavigate();
  const { clubId } = useParams();
  const [selectedClub, setSelectedClub] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClubDetails = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/get-club/${clubId}`);
        setSelectedClub(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin câu lạc bộ:', error);
        setError("Không thể tải thông tin câu lạc bộ");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClubDetails();
  }, [clubId]);

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

  if (!selectedClub) {
    return <div>Không có thông tin câu lạc bộ.</div>;
  }

  const soLuongThanhVien = selectedClub.thanhVien ? selectedClub.thanhVien.length : 0; // Đếm số lượng thành viên

  return (
    <div className="max-w-5xl mx-auto px-8 py-6 font-sans">
      <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: '#004D86' }}>{selectedClub.ten}</h1>
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
              <td className="border px-4 py-2" style={{ backgroundColor: '#FCFEF6' }}>{soLuongThanhVien}</td> {/* Hiển thị số lượng thành viên */}
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
  );
};

export default ClubDetails;
