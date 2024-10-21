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

const ActivityReports = () => {
  const [reports, setReports] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [newReport, setNewReport] = useState({
    tenBaoCao: "",
    ngayBaoCao: "",
    nhanSuPhuTrach: "",
    danhSachSuKien: [],
    tongNganSachChiTieu: 0,
    tongThu: 0,
    ketQuaDatDuoc: "",
    club: "",
  });
  const [detailReport, setDetailReport] = useState(null);
  const [editingReportId, setEditingReportId] = useState(null);

  useEffect(() => {
    fetchReports();
    fetchClubs();
    fetchEvents();
  }, []);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/get-reports`);
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClubs = async () => {
    try {
      const response = await axios.get(`${API_URL}/get-clubs`);
      setClubs(response.data);
    } catch (error) {
      console.error("Error fetching clubs:", error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/get-events`);
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleAddReport = async () => {
    try {
      const response = await axios.post(`${API_URL}/add-report`, newReport);
      setIsDialogOpen(false);
      fetchReports();
    } catch (error) {
      console.error("Error adding report:", error);
      alert(`Lỗi khi thêm báo cáo: ${error.response?.data?.message || 'Không xác định'}`);
    }
  };

  const handleUpdateReport = async () => {
    try {
      const response = await axios.put(`${API_URL}/update-report/${editingReportId}`, newReport);
      setIsDialogOpen(false);
      setEditingReportId(null);
      fetchReports();
    } catch (error) {
      console.error("Error updating report:", error);
      alert(`Lỗi khi cập nhật báo cáo: ${error.response?.data?.message || 'Không xác định'}`);
    }
  };

  const handleDeleteReport = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa báo cáo này?")) {
      try {
        await axios.delete(`${API_URL}/delete-report/${id}`);
        fetchReports();
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
      tongNganSachChiTieu: 0,
      tongThu: 0,
      ketQuaDatDuoc: "",
      club: "",
    });
    setEditingReportId(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (id) => {
    const reportToEdit = reports.find(report => report._id === id);
    setNewReport({ ...reportToEdit });
    setEditingReportId(id);
    setIsDialogOpen(true);
  };

  const openDetailDialog = (id) => {
    const reportToView = reports.find(report => report._id === id);
    setDetailReport(reportToView);
    setIsDetailDialogOpen(true);
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
                  {["Tên báo cáo", "Ngày báo cáo", "Nhân sự phụ trách", "CLB", "Thao tác"].map((el) => (
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
                {reports.map(({ _id, tenBaoCao, ngayBaoCao, nhanSuPhuTrach, club }, key) => {
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
                          {new Date(ngayBaoCao).toLocaleDateString()}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {nhanSuPhuTrach}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {clubs.find(c => c._id === club)?.ten || 'N/A'}
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
          <Input label="Tên báo cáo" value={newReport.tenBaoCao} onChange={(e) => setNewReport({ ...newReport, tenBaoCao: e.target.value })} />
          <Input type="date" label="Ngày báo cáo" value={newReport.ngayBaoCao} onChange={(e) => setNewReport({ ...newReport, ngayBaoCao: e.target.value })} />
          <Input label="Nhân sự phụ trách" value={newReport.nhanSuPhuTrach} onChange={(e) => setNewReport({ ...newReport, nhanSuPhuTrach: e.target.value })} />
          <Select 
            label="Câu lạc bộ" 
            value={newReport.club} 
            onChange={(value) => setNewReport({ ...newReport, club: value })}
          >
            {clubs.map((club) => (
              <Option key={club._id} value={club._id}>{club.ten}</Option>
            ))}
          </Select>
          <Select 
            label="Danh sách sự kiện" 
            value={newReport.danhSachSuKien} 
            onChange={(value) => setNewReport({ ...newReport, danhSachSuKien: value })}
            multiple
          >
            {events.map((event) => (
              <Option key={event._id} value={event._id}>{event.tenSuKien}</Option>
            ))}
          </Select>
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
            <Typography>Tên báo cáo: {detailReport.tenBaoCao}</Typography>
            <Typography>Ngày báo cáo: {new Date(detailReport.ngayBaoCao).toLocaleDateString()}</Typography>
            <Typography>Nhân sự phụ trách: {detailReport.nhanSuPhuTrach}</Typography>
            <Typography>Câu lạc bộ: {clubs.find(c => c._id === detailReport.club)?.ten || 'N/A'}</Typography>
            <Typography>Danh sách sự kiện: {detailReport.danhSachSuKien.map(eventId => events.find(e => e._id === eventId)?.tenSuKien).join(', ')}</Typography>
            <Typography>Tổng ngân sách chi tiêu: {detailReport.tongNganSachChiTieu.toLocaleString()} VND</Typography>
            <Typography>Tổng thu: {detailReport.tongThu.toLocaleString()} VND</Typography>
            <Typography className="col-span-2">Kết quả đạt được: {detailReport.ketQuaDatDuoc}</Typography>
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
