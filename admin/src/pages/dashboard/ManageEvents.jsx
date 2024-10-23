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
  Spinner,
  IconButton,
} from "@material-tailwind/react";
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, XCircleIcon } from "@heroicons/react/24/solid";
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';

const API_URL = "http://localhost:5500/api";

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    ten: "",
    ngayToChuc: "",
    thoiGianBatDau: "00:00",
    thoiGianKetThuc: "00:00",
    diaDiem: "",
    noiDung: "",
    nganSachChiTieu: 0,
    nguoiPhuTrach: "",
    khachMoi: [],
    club: "",
  });
  const [detailEvent, setDetailEvent] = useState(null);
  const [editingEventId, setEditingEventId] = useState(null);
  const [managedClub, setManagedClub] = useState(null);
  const [guestInput, setGuestInput] = useState("");

  useEffect(() => {
    const managedClubsString = localStorage.getItem('managedClubs');
    if (managedClubsString) {
      try {
        const managedClubs = JSON.parse(managedClubsString);
        if (managedClubs && managedClubs.length > 0) {
          setManagedClub(managedClubs[0]);
          fetchEvents(managedClubs[0]._id);
        } else {
          throw new Error("No managed clubs found");
        }
      } catch (error) {
        console.error("Error parsing managed clubs data:", error);
        alert("Không thể tải thông tin câu lạc bộ. Vui lòng đăng nhập lại.");
      }
    } else {
      console.error("No managed clubs data found");
      alert("Không tìm thấy thông tin câu lạc bộ. Vui lòng đăng nhập lại.");
    }
    setIsLoading(false);
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const response = await axios.get(`${API_URL}/get-clubs`);
      setClubs(response.data);
    } catch (error) {
      console.error("Error fetching clubs:", error);
    }
  };

  const fetchEvents = async (clubId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/get-events-by-club/${clubId}`);
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEvent = async () => {
    try {
      if (!managedClub) {
        throw new Error("Managed club information is not available");
      }
      
      const eventData = {
        ...newEvent,
        club: managedClub._id
      };
      const response = await axios.post(`${API_URL}/add-event`, eventData);
      setIsDialogOpen(false);
      fetchEvents(managedClub._id);
    } catch (error) {
      console.error("Error adding event:", error);
      alert(`Lỗi khi thêm sự kiện: ${error.message || 'Không xác định'}`);
    }
  };

  const handleUpdateEvent = async () => {
    try {
      const response = await axios.put(`${API_URL}/update-event/${editingEventId}`, newEvent);
      setIsDialogOpen(false);
      setEditingEventId(null);
      fetchEvents(managedClub._id);
    } catch (error) {
      console.error("Error updating event:", error);
      alert(`Lỗi khi cập nhật sự kiện: ${error.response?.data?.message || 'Không xác định'}`);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sự kiện này?")) {
      try {
        const response = await axios.delete(`${API_URL}/delete-event/${eventId}`);
        fetchEvents(managedClub._id);
      } catch (error) {
        console.error("Error deleting event:", error);
        alert(`Lỗi khi xóa sự kiện: ${error.response?.data?.message || 'Không xác định'}`);
      }
    }
  };

  const openEditDialog = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/get-event/${id}`);
      setNewEvent({
        ...response.data,
        ngayToChuc: response.data.ngayToChuc.split('T')[0],
      });
      setEditingEventId(id);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error fetching event details:", error);
      alert(`Lỗi khi lấy thông tin sự kiện: ${error.response?.data?.message || 'Không xác định'}`);
    }
  };

  const openDetailDialog = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/get-event/${id}`);
      setDetailEvent(response.data);
      setIsDetailDialogOpen(true);

      if (clubs.length === 0) {
        await fetchClubs();
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
      alert(`Lỗi khi lấy thông tin sự kiện: ${error.response?.data?.message || 'Không xác định'}`);
    }
  };

  const handleAddGuest = () => {
    if (guestInput.trim() !== "") {
      setNewEvent(prev => ({
        ...prev,
        khachMoi: [...prev.khachMoi, guestInput.trim()]
      }));
      setGuestInput("");
    }
  };

  const handleRemoveGuest = (index) => {
    setNewEvent(prev => ({
      ...prev,
      khachMoi: prev.khachMoi.filter((_, i) => i !== index)
    }));
  };

  const handleEditGuest = (index, newName) => {
    setNewEvent(prev => ({
      ...prev,
      khachMoi: prev.khachMoi.map((guest, i) => i === index ? newName : guest)
    }));
  };

  const fetchEventDetails = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/get-event/${id}`);
      setDetailEvent(response.data);
      setIsDetailDialogOpen(true);
    } catch (error) {
      console.error("Error fetching event details:", error);
      alert(`Lỗi khi lấy thông tin sự kiện: ${error.response?.data?.message || 'Không xác định'}`);
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="cyan" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Quản lý sự kiện
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <div className="flex justify-end p-4">
            <Button className="flex items-center gap-3" color="cyan" size="sm" onClick={() => {
              setNewEvent({
                ten: "",
                ngayToChuc: "",
                thoiGianBatDau: "00:00",
                thoiGianKetThuc: "00:00",
                diaDiem: "",
                noiDung: "",
                nganSachChiTieu: 0,
                nguoiPhuTrach: "",
                khachMoi: [],
                club: "",
              });
              setEditingEventId(null);
              setIsDialogOpen(true);
            }}>
              <PlusIcon strokeWidth={2} className="h-4 w-4" /> Thêm sự kiện
            </Button>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner className="h-12 w-12" color="cyan" />
            </div>
          ) : (
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Tên sự kiện", "Ngày tổ chức", "Địa điểm", "Người phụ trách", "Thao tác"].map((el) => (
                    <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                      <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {events.map(({ _id, ten, ngayToChuc, diaDiem, nguoiPhuTrach }, index) => {
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
                        <div className="flex items-center gap-2">
                          <Button size="sm" color="green" className="flex items-center gap-2" onClick={() => openDetailDialog(_id)}>
                            <EyeIcon strokeWidth={2} className="h-4 w-4" /> Chi tiết
                          </Button>
                          <Button size="sm" color="blue" className="flex items-center gap-2" onClick={() => openEditDialog(_id)}>
                            <PencilIcon strokeWidth={2} className="h-4 w-4" /> Sửa
                          </Button>
                          <Button size="sm" color="red" className="flex items-center gap-2" onClick={() => handleDeleteEvent(_id)}>
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

      {/* Dialog thêm/sửa sự kiện */}
      <Dialog open={isDialogOpen} handler={() => setIsDialogOpen(false)} size="xl">
        <DialogHeader>{editingEventId ? "Chỉnh sửa Sự kiện" : "Thêm Sự kiện Mới"}</DialogHeader>
        <DialogBody divider className="grid grid-cols-2 gap-4">
          <Input label="Tên sự kiện" value={newEvent.ten} onChange={(e) => setNewEvent({ ...newEvent, ten: e.target.value })} />
          <Input type="date" label="Ngày tổ chức" value={newEvent.ngayToChuc} onChange={(e) => setNewEvent({ ...newEvent, ngayToChuc: e.target.value })} />
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
              Thời gian bắt đầu
            </Typography>
            <TimePicker
              onChange={(value) => setNewEvent({ ...newEvent, thoiGianBatDau: value })}
              value={newEvent.thoiGianBatDau}
              clearIcon={null}
              clockIcon={null}
              format="HH:mm"
              disableClock={true}
              className="w-full"
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
              Thời gian kết thúc
            </Typography>
            <TimePicker
              onChange={(value) => setNewEvent({ ...newEvent, thoiGianKetThuc: value })}
              value={newEvent.thoiGianKetThuc}
              clearIcon={null}
              clockIcon={null}
              format="HH:mm"
              disableClock={true}
              className="w-full"
            />
          </div>
          <Input label="Địa điểm" value={newEvent.diaDiem} onChange={(e) => setNewEvent({ ...newEvent, diaDiem: e.target.value })} />
          <Textarea label="Nội dung" value={newEvent.noiDung} onChange={(e) => setNewEvent({ ...newEvent, noiDung: e.target.value })} className="col-span-2" />
          <Input type="number" label="Ngân sách chi tiêu" value={newEvent.nganSachChiTieu} onChange={(e) => setNewEvent({ ...newEvent, nganSachChiTieu: e.target.value })} />
          <Input label="Người phụ trách" value={newEvent.nguoiPhuTrach} onChange={(e) => setNewEvent({ ...newEvent, nguoiPhuTrach: e.target.value })} />
          <div className="col-span-2">
            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
              Khách mời
            </Typography>
            <div className="flex items-center gap-2 mb-2">
              <Input
                label="Tên khách mời"
                value={guestInput}
                onChange={(e) => setGuestInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddGuest()}
              />
              <Button onClick={handleAddGuest} className="flex-shrink-0">
                <PlusIcon className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {newEvent.khachMoi.map((guest, index) => (
                <div key={index} className="flex items-center bg-blue-gray-50 rounded-full px-3 py-1">
                  <Input
                    value={guest}
                    onChange={(e) => handleEditGuest(index, e.target.value)}
                    className="border-none bg-transparent p-0 text-sm"
                  />
                  <IconButton variant="text" color="red" onClick={() => handleRemoveGuest(index)}>
                    <XCircleIcon className="h-5 w-5" />
                  </IconButton>
                </div>
              ))}
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={() => setIsDialogOpen(false)} className="mr-1">
            Hủy
          </Button>
          <Button variant="gradient" color="green" onClick={editingEventId ? handleUpdateEvent : handleAddEvent}>
            {editingEventId ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Dialog xem chi tiết sự kiện */}
      <Dialog open={isDetailDialogOpen} handler={() => setIsDetailDialogOpen(false)} size="xl">
        <DialogHeader>Chi tiết Sự kiện</DialogHeader>
        {detailEvent && (
          <DialogBody divider className="grid grid-cols-2 gap-4">
            <Typography>Tên sự kiện: {detailEvent.ten}</Typography>
            <Typography>Ngày tổ chức: {new Date(detailEvent.ngayToChuc).toLocaleDateString()}</Typography>
            <Typography>Thời gian bắt đầu: {detailEvent.thoiGianBatDau}</Typography>
            <Typography>Thời gian kết thúc: {detailEvent.thoiGianKetThuc}</Typography>
            <Typography>Địa điểm: {detailEvent.diaDiem}</Typography>
            <Typography className="col-span-2">Nội dung: {detailEvent.noiDung}</Typography>
            <Typography>Ngân sách chi tiêu: {detailEvent.nganSachChiTieu}</Typography>
            <Typography>Người phụ trách: {detailEvent.nguoiPhuTrach}</Typography>
            <Typography>Khách mời: {detailEvent.khachMoi.join(', ')}</Typography>
            <Typography>Câu lạc bộ: {detailEvent.club.ten}</Typography>
            <Typography>Trạng thái: {detailEvent.trangThai}</Typography>
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

export default ManageEvents;
