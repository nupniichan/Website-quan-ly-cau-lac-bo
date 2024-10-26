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
  Spinner,
} from "@material-tailwind/react";
import { CheckCircleIcon, XCircleIcon, EyeIcon } from "@heroicons/react/24/solid";

const API_URL = "http://localhost:5500/api";

const ApproveEvents = () => {
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [detailEvent, setDetailEvent] = useState(null);

  useEffect(() => {
    fetchClubs().then(() => fetchPendingEvents());
  }, []);

  const fetchPendingEvents = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/get-pending-events`);
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching pending events:", error);
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

  const handleApproveEvent = async (id) => {
    try {
      await axios.put(`${API_URL}/approve-event/${id}`);
      fetchPendingEvents();
    } catch (error) {
      console.error("Error approving event:", error);
      alert(`Lỗi khi phê duyệt sự kiện: ${error.response?.data?.message || 'Không xác định'}`);
    }
  };

  const handleRejectEvent = async (id) => {
    try {
      await axios.put(`${API_URL}/reject-event/${id}`);
      fetchPendingEvents();
    } catch (error) {
      console.error("Error rejecting event:", error);
      alert(`Lỗi khi từ chối sự kiện: ${error.response?.data?.message || 'Không xác định'}`);
    }
  };

  const openDetailDialog = (id) => {
    const eventDetail = events.find(event => event._id === id);
    if (eventDetail) {
      setDetailEvent(eventDetail);
      setIsDetailDialogOpen(true);
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Phê duyệt sự kiện
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner className="h-12 w-12" color="blue" />
            </div>
          ) : (
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Tên sự kiện", "Ngày tổ chức", "Địa điểm", "Người phụ trách", "CLB", "Thao tác"].map((el) => (
                    <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                      <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {events.map(({ _id, ten, ngayToChuc, diaDiem, nguoiPhuTrach, club }, index) => {
                  const className = index === events.length - 1 ? "p-4" : "p-4 border-b border-blue-gray-50";
                  return (
                    <tr key={_id}>
                      <td className={className}>
                        <Typography variant="small" color="blue-gray" className="font-semibold">
                          {ten}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {new Date(ngayToChuc).toLocaleDateString()}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {diaDiem}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {nguoiPhuTrach}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {clubs.find(c => c._id === Number(club))?.ten || 'N/A'}
                        </Typography>
                      </td>
                      <td className={className}>
                        <div className="flex items-center gap-2">
                          <Button size="sm" color="green" className="flex items-center gap-2" onClick={() => handleApproveEvent(_id)}>
                            <CheckCircleIcon strokeWidth={2} className="h-4 w-4" />
                          </Button>
                          <Button size="sm" color="red" className="flex items-center gap-2" onClick={() => handleRejectEvent(_id)}>
                            <XCircleIcon strokeWidth={2} className="h-4 w-4" />
                          </Button>
                          <Button size="sm" color="blue" className="flex items-center gap-2" onClick={() => openDetailDialog(_id)}>
                            <EyeIcon strokeWidth={2} className="h-4 w-4" />
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

      {/* Dialog xem chi tiết sự kiện */}
      <Dialog open={isDetailDialogOpen} handler={() => setIsDetailDialogOpen(false)} size="xl">
        <DialogHeader>Chi tiết Sự kiện</DialogHeader>
        {detailEvent && (
          <DialogBody divider className="grid grid-cols-2 gap-4">
            <Typography>Tên sự kiện: {detailEvent.ten}</Typography>
            <Typography>Ngày tổ chức: {new Date(detailEvent.ngayToChuc).toLocaleDateString()}</Typography>
            <Typography>Thời gian tổ chức: {detailEvent.thoiGianToChuc}</Typography>
            <Typography>Địa điểm: {detailEvent.diaDiem}</Typography>
            <Typography className="col-span-2">Nội dung: {detailEvent.noiDung}</Typography>
            <Typography>Ngân sách chi tiêu: {detailEvent.nganSachChiTieu.toLocaleString()} VND</Typography>
            <Typography>Người phụ trách: {detailEvent.nguoiPhuTrach}</Typography>
            <Typography>Khách mời: {detailEvent.khachMoi}</Typography>
            <Typography>
              Câu lạc bộ: {clubs.find(c => c._id === Number(detailEvent.club))?.ten || 'N/A'}
            </Typography>
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

export default ApproveEvents;
