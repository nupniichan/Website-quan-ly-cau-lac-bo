import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
  Select,
  Option,
  Spinner,
} from "@material-tailwind/react";
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/solid";

const API_URL = "http://localhost:5500/api";

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

const ActivityReports = () => {
  const [reports, setReports] = useState([]);
  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [newReport, setNewReport] = useState({
    tenBaoCao: "",
    ngayBaoCao: "",
    nhanSuPhuTrach: "",
    danhSachSuKien: [],
    danhSachGiai: [],
    tongNganSachChiTieu: 0,
    tongThu: 0,
    ketQuaDatDuoc: "",
  });
  const [detailReport, setDetailReport] = useState(null);
  const [editingReportId, setEditingReportId] = useState(null);
  const [eventSuggestions, setEventSuggestions] = useState({ index: -1, suggestions: [] });
  const [awardSuggestions, setAwardSuggestions] = useState({ index: -1, suggestions: [] });
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const managedClubsString = localStorage.getItem('managedClubs');
    if (managedClubsString) {
      try {
        const managedClubs = JSON.parse(managedClubsString);
        if (managedClubs && managedClubs.length > 0) {
          setClub(managedClubs[0]);
          fetchReports(managedClubs[0]._id);
          fetchEvents(managedClubs[0]._id);
        } else {
          throw new Error("No managed clubs found");
        }
      } catch (error) {
        alert("Không thể tải thông tin câu lạc bộ. Vui lòng đăng nhập lại.");
      }
    } else {
      console.error("No managed clubs data found");
      alert("Không tìm thấy thông tin câu lạc bộ. Vui lòng đăng nhập lại.");
    }
    setIsLoading(false);
  }, []);

  const fetchReports = async (clubId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/get-reports-by-club/${clubId}`);
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
      // Thêm dòng này để xem chi tiết lỗi
      console.error("Error details:", error.response?.data);
      alert("Lỗi khi tải danh sách báo cáo");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEvents = async (clubId) => {
    try {
      const response = await axios.get(`${API_URL}/get-events-by-club/${clubId}`);
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleAddReport = async () => {
    try {
      const reportData = {
        ...newReport,
        club: club._id
      };
      const response = await axios.post(`${API_URL}/add-report`, reportData);
      setIsDialogOpen(false);
      fetchReports(club._id);
    } catch (error) {
      console.error("Error adding report:", error);
      alert(`Lỗi khi thêm báo cáo: ${error.response?.data?.message || 'Không xác định'}`);
    }
  };

  const handleUpdateReport = async () => {
    try {
      // Đảm bảo rằng dữ liệu giải thưởng được cập nhật đúng cách
      const updatedReport = {
        ...newReport,
        danhSachGiai: newReport.danhSachGiai.map(award => ({
          ...award,
          nguoiNhanGiai: award.nguoiNhanGiai || 'Không xác định'
        }))
      };

      const response = await axios.put(`${API_URL}/update-report/${editingReportId}`, updatedReport);
      setIsDialogOpen(false);
      setEditingReportId(null);
      fetchReports(club._id);
    } catch (error) {
      console.error("Error updating report:", error);
      alert(`Lỗi khi cập nhật báo cáo: ${error.response?.data?.message || 'Không xác định'}`);
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa báo cáo này?")) {
      try {
        const response = await axios.delete(`${API_URL}/delete-report/${reportId}/${club._id}`);
        fetchReports(club._id);
      } catch (error) {
        console.error("Error deleting report:", error);
        alert(`Lỗi khi xóa báo cáo: ${error.response?.data?.message || 'Không xác định'}`);
      }
    }
  };

  const openAddDialog = () => {
    setNewReport({
      tenBaoCao: "",
      ngayBaoCao: "",
      nhanSuPhuTrach: "",
      danhSachSuKien: [],
      danhSachGiai: [],
      tongNganSachChiTieu: 0,
      tongThu: 0,
      ketQuaDatDuoc: "",
    });
    setEditingReportId(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/get-report/${id}`);
      setNewReport(response.data);
      setEditingReportId(id);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error fetching report details:", error);
      alert("Lỗi khi tải thông tin báo cáo");
    }
  };

  const openDetailDialog = (id) => {
    const reportToView = reports.find(report => report._id === id);
    setDetailReport(reportToView);
    setIsDetailDialogOpen(true);
  };

  const handleAddEvent = () => {
    setNewReport({
      ...newReport,
      danhSachSuKien: [
        ...newReport.danhSachSuKien,
        { tenSuKien: "", moTa: "", ngayToChuc: "" }
      ]
    });
  };

  const handleUpdateEvent = (index, field, value) => {
    const updatedEvents = [...newReport.danhSachSuKien];
    updatedEvents[index][field] = value;
    setNewReport({ ...newReport, danhSachSuKien: updatedEvents });
  };

  const handleRemoveEvent = (index) => {
    const updatedEvents = newReport.danhSachSuKien.filter((_, i) => i !== index);
    setNewReport({ ...newReport, danhSachSuKien: updatedEvents });
  };

  const handleAddAward = () => {
    setNewReport({
      ...newReport,
      danhSachGiai: [
        ...newReport.danhSachGiai,
        { tenGiai: "", moTa: "" }
      ]
    });
  };

  const handleUpdateAward = (index, field, value) => {
    const updatedAwards = [...newReport.danhSachGiai];
    updatedAwards[index][field] = value;
    setNewReport({ ...newReport, danhSachGiai: updatedAwards });
  };

  const handleRemoveAward = (index) => {
    const updatedAwards = newReport.danhSachGiai.filter((_, i) => i !== index);
    setNewReport({ ...newReport, danhSachGiai: updatedAwards });
  };

  const handleEventNameChange = async (e, index) => {
    const value = e.target.value;
    handleUpdateEvent(index, 'tenSuKien', value);
    if (value.length > 2 && club) {
      try {
        const response = await axios.get(`${API_URL}/search-events/${club._id}?query=${value}`);
        setEventSuggestions({ index, suggestions: response.data });
      } catch (error) {
        console.error("Error fetching event suggestions:", error);
      }
    } else {
      setEventSuggestions({ index, suggestions: [] });
    }
  };

  const handleEventSuggestionClick = (suggestion, index) => {
    const updatedEvents = [...newReport.danhSachSuKien];
    updatedEvents[index] = {
      tenSuKien: suggestion.ten,
      nguoiPhuTrach: suggestion.nguoiPhuTrach,
      ngayToChuc: suggestion.ngayToChuc.split('T')[0]
    };
    setNewReport({ ...newReport, danhSachSuKien: updatedEvents });
    setEventSuggestions({ index: -1, suggestions: [] });
  };

  const handleAwardNameChange = async (e, index) => {
    const value = e.target.value;
    handleUpdateAward(index, 'tenGiai', value);
    if (value.length > 2 && club) {
      try {
        const response = await axios.get(`${API_URL}/search-prizes/${club._id}?query=${value}`);
        setAwardSuggestions({ index, suggestions: response.data });
      } catch (error) {
        console.error("Error fetching award suggestions:", error);
      }
    } else {
      setAwardSuggestions({ index, suggestions: [] });
    }
  };

  const handleAwardSuggestionClick = (suggestion, index) => {
    const updatedAwards = [...newReport.danhSachGiai];
    updatedAwards[index] = {
      tenGiai: suggestion.tenGiai,
      nguoiNhanGiai: suggestion.nguoiNhanGiai, // Lưu tên người nhận giải
      ngayNhanGiai: suggestion.ngayNhanGiai.split('T')[0]
    };
    setNewReport({ ...newReport, danhSachGiai: updatedAwards });
    setAwardSuggestions({ index: -1, suggestions: [] });
  };
  

  return (
    <div className="mt-12">
      <Card>
        <CardHeader color="cyan" contentPosition="none">
          <div className="w-full flex items-center justify-between">
            <h2 className="text-white text-2xl">Báo cáo hoạt động CLB</h2>
            <Button color="white" buttonType="link" size="lg" style={{ padding: 0 }} onClick={openAddDialog}>
              <PlusIcon className="h-6 w-6" />
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          {isLoading ? (
            <Spinner />
          ) : reports.length === 0 ? (
            <Typography color="gray" className="mt-4 mb-8">
              Chưa có báo cáo nào.
            </Typography>
          ) : (
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Tên báo cáo", "Ngày báo cáo", "Nhân sự phụ trách", "Thao tác"].map((el) => (
                    <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reports.map(({ _id, tenBaoCao, ngayBaoCao, nhanSuPhuTrach }, key) => {
                  const className = `py-3 px-5 ${
                    key === reports.length - 1 ? "" : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={_id}>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {tenBaoCao}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {formatDateForInput(ngayBaoCao)} {/* Ngày đã được chuyển đổi ở server */}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {nhanSuPhuTrach}
                        </Typography>
                      </td>
                      <td className={className}>
                        <div className="flex items-center gap-2">
                          <Button size="sm" color="green" className="flex items-center gap-2" onClick={() => openDetailDialog(_id)}>
                            <EyeIcon strokeWidth={2} className="h-4 w-4" /> Chi tiết
                          </Button>
                          <Button size="sm" color="blue" className="flex items-center gap-2" onClick={() => openEditDialog(_id)}>
                            <PencilIcon strokeWidth={2} className="h-4 w-4" /> Sửa
                          </Button>
                          <Button size="sm" color="red" className="flex items-center gap-2" onClick={() => handleDeleteReport(_id)}>
                            <TrashIcon strokeWidth={2} className="h-4 w-4" /> Xóa
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>

      {/* Dialog thêm/sửa báo cáo */}
      <Dialog open={isDialogOpen} handler={() => setIsDialogOpen(false)} size="xl">
        <DialogHeader>{editingReportId ? "Chỉnh sửa Báo cáo" : "Thêm Báo cáo Mới"}</DialogHeader>
        <DialogBody divider className="grid grid-cols-2 gap-4">
          <div className="relative">
            <Input 
              label="Tên báo cáo" 
              value={newReport.tenBaoCao} 
              onChange={(e) => setNewReport({ ...newReport, tenBaoCao: e.target.value })}
            />
            {eventSuggestions.suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg">
                {eventSuggestions.suggestions.map((suggestion) => (
                  <li
                    key={suggestion._id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleEventSuggestionClick(suggestion, eventSuggestions.index)}
                  >
                    {suggestion.ten}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Input 
            type="date" 
            label="Ngày báo cáo" 
            value={formatDateForInput(newReport.ngayBaoCao)} 
            onChange={(e) => setNewReport({ ...newReport, ngayBaoCao: e.target.value })} 
          />
          <Input label="Nhân sự phụ trách" value={newReport.nhanSuPhuTrach} onChange={(e) => setNewReport({ ...newReport, nhanSuPhuTrach: e.target.value })} />
          
          <div className="col-span-2">
            <Typography variant="h6" color="blue-gray" className="mb-3">
              Danh sách sự kiện
            </Typography>
            {newReport.danhSachSuKien.map((event, index) => (
              <div key={index} className="flex items-center gap-2 mb-2 relative">
                <Input 
                  label="Tên sự kiện" 
                  value={event.tenSuKien} 
                  onChange={(e) => handleEventNameChange(e, index)} 
                />
                <Input 
                  label="Người phụ trách" 
                  value={event.nguoiPhuTrach} 
                  onChange={(e) => handleUpdateEvent(index, 'nguoiPhuTrach', e.target.value)} 
                />
                <Input 
                  type="date"
                  label="Ngày tổ chức" 
                  value={formatDateForInput(event.ngayToChuc)} 
                  onChange={(e) => handleUpdateEvent(index, 'ngayToChuc', e.target.value)} 
                />
                {eventSuggestions.index === index && eventSuggestions.suggestions.length > 0 && (
                  <ul className="absolute z-50 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg top-full left-0">
                    {eventSuggestions.suggestions.map((suggestion) => (
                      <li
                        key={suggestion._id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleEventSuggestionClick(suggestion, index)}
                      >
                        {suggestion.ten}
                      </li>
                    ))}
                  </ul>
                )}
                <Button color="red" size="sm" onClick={() => handleRemoveEvent(index)}>Xóa</Button>
              </div>
            ))}
            <Button color="blue" size="sm" onClick={handleAddEvent}>Thêm sự kiện</Button>
          </div>

          <div className="col-span-2">
            <Typography variant="h6" color="blue-gray" className="mb-3">
              Danh sách giải thưởng
            </Typography>
            {newReport.danhSachGiai.map((award, index) => (
              <div key={index} className="flex items-center gap-2 mb-2 relative">
                <Input 
                  label="Tên giải" 
                  value={award.tenGiai} 
                  onChange={(e) => handleAwardNameChange(e, index)} 
                />
                <Input 
                  label="Người nhận giải" 
                  value={award.nguoiNhanGiai} 
                  onChange={(e) => handleUpdateAward(index, 'nguoiNhanGiai', e.target.value)} 
                />
                <Input 
                  type="date"
                  label="Ngày nhận giải" 
                  value={formatDateForInput(award.ngayNhanGiai)} 
                  onChange={(e) => handleUpdateAward(index, 'ngayNhanGiai', e.target.value)} 
                />
                {awardSuggestions.index === index && awardSuggestions.suggestions.length > 0 && (
                  <ul className="absolute z-50 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg top-full left-0">
                    {awardSuggestions.suggestions.map((suggestion) => (
                      <li
                        key={suggestion._id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleAwardSuggestionClick(suggestion, index)}
                      >
                        {suggestion.tenGiai}
                      </li>
                    ))}
                  </ul>
                )}
                <Button color="red" size="sm" onClick={() => handleRemoveAward(index)}>Xóa</Button>
              </div>
            ))}
            <Button color="blue" size="sm" onClick={handleAddAward}>Thêm giải thưởng</Button>
          </div>

          <Input type="number" label="Tổng ngân sách chi tiêu" value={newReport.tongNganSachChiTieu} onChange={(e) => setNewReport({ ...newReport, tongNganSachChiTieu: e.target.value })} />
          <Input type="number" label="Tổng thu" value={newReport.tongThu} onChange={(e) => setNewReport({ ...newReport, tongThu: e.target.value })} />
          <Textarea label="Kết quả đạt được" value={newReport.ketQuaDatDuoc} onChange={(e) => setNewReport({ ...newReport, ketQuaDatDuoc: e.target.value })} className="col-span-2" />
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={() => setIsDialogOpen(false)} className="mr-1">
            Hủy
          </Button>
          <Button variant="gradient" color="green" onClick={editingReportId ? handleUpdateReport : handleAddReport}>
            {editingReportId ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Dialog xem chi tiết báo cáo */}
      <Dialog open={isDetailDialogOpen} handler={() => setIsDetailDialogOpen(false)} size="xl">
        <DialogHeader>Chi tiết Báo cáo</DialogHeader>
        {detailReport && (
          <DialogBody divider className="grid grid-cols-2 gap-4">
            <Typography><strong>Tên báo cáo:</strong> {detailReport.tenBaoCao}</Typography>
            <Typography><strong>Ngày báo cáo:</strong> {formatDateForInput(detailReport.ngayBaoCao)}</Typography>
            <Typography><strong>Nhân sự phụ trách:</strong> {detailReport.nhanSuPhuTrach}</Typography>
            <Typography className="col-span-2"><strong>Danh sách sự kiện:</strong></Typography>
            <ul className="col-span-2 list-disc pl-5">
              {detailReport.danhSachSuKien.map((event, index) => (
                <li key={index}>
                  {event.tenSuKien} (Phụ trách: {event.nguoiPhuTrach}, Ngày tổ chức: {formatDateForInput(event.ngayToChuc)})
                </li>
              ))}
            </ul>
            <Typography className="col-span-2"><strong>Danh sách giải thưởng:</strong></Typography>
            <ul className="col-span-2 list-disc pl-5">
              {detailReport.danhSachGiai.map((award, index) => (
                <li key={index}>
                  {award.tenGiai} (Người nhận: {award.nguoiNhanGiai}, Ngày nhận: {formatDateForInput(award.ngayNhanGiai)})
                </li>
              ))}
            </ul>
            <Typography><strong>Tổng ngân sách chi tiêu:</strong> {detailReport.tongNganSachChiTieu.toLocaleString()} VND</Typography>
            <Typography><strong>Tổng thu:</strong> {detailReport.tongThu.toLocaleString()} VND</Typography>
            <Typography className="col-span-2"><strong>Kết quả đạt được:</strong> {detailReport.ketQuaDatDuoc}</Typography>
          </DialogBody>
        )}
        <DialogFooter>
          <Button variant="text" color="red" onClick={() => setIsDetailDialogOpen(false)} className="mr-1">
            Đóng
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default ActivityReports;
