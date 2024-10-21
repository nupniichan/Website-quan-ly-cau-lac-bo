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

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    ten: "",
    ngayToChuc: "",
    thoiGianToChuc: "",
    diaDiem: "",
    noiDung: "",
    nganSachChiTieu: 0,
    nguoiPhuTrach: "",
    khachMoi: "",
    club: "",
  });
  const [detailEvent, setDetailEvent] = useState(null);
  const [editingEventId, setEditingEventId] = useState(null);

  useEffect(() => {
    fetchClubs().then(() => fetchEvents());
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/get-events`);
      console.log('Dữ liệu sự kiện từ server:', response.data);
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClubs = async () => {
    try {
      const response = await axios.get(`${API_URL}/get-clubs`);
      console.log('Dữ liệu câu lạc bộ từ server:', response.data);
      setClubs(response.data);
    } catch (error) {
      console.error("Error fetching clubs:", error);
    }
  };

  const handleAddEvent = async () => {
    try {
      const eventData = {
        ...newEvent,
        club: Number(newEvent.club)
      };
      console.log('Dữ liệu sự kiện trước khi gửi:', eventData);
      const response = await axios.post(`${API_URL}/add-event`, eventData);
      console.log('Phản hồi từ server sau khi thêm:', response.data);
      setIsDialogOpen(false);
      fetchEvents();
    } catch (error) {
      console.error("Error adding event:", error);
      alert(`Lỗi khi thêm sự kiện: ${error.response?.data?.message || 'Không xác định'}`);
    }
  };

  const handleUpdateEvent = async () => {
    try {
      const eventData = {
        ...newEvent,
        club: Number(newEvent.club)
      };
      console.log('Dữ liệu sự kiện trước khi cập nhật:', eventData);
      const response = await axios.put(`${API_URL}/update-event/${editingEventId}`, eventData);
      console.log('Phản hồi từ server sau khi cập nhật:', response.data);
      setIsDialogOpen(false);
      setEditingEventId(null);
      fetchEvents();
    } catch (error) {
      console.error("Error updating event:", error);
      alert(`Lỗi khi cập nhật sự kiện: ${error.response?.data?.message || 'Không xác định'}`);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sự kiện này?")) {
      try {
        await axios.delete(`${API_URL}/delete-event/${id}`);
        fetchEvents();
      } catch (error) {
        console.error("Error deleting event:", error);
        alert(`Lỗi khi xóa sự kiện: ${error.response?.data?.message || 'Không xác định'}`);
      }
    }
  };

  const openEditDialog = (id) => {
    const eventToEdit = events.find(event => event._id === id);
    if (eventToEdit) {
      console.log('Sự kiện cần chỉnh sửa:', eventToEdit);
      setNewEvent({
        ...eventToEdit,
        club: eventToEdit.club.toString()
      });
      setEditingEventId(id);
      setIsDialogOpen(true);
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
                thoiGianToChuc: "",
                diaDiem: "",
                noiDung: "",
                nganSachChiTieu: 0,
                nguoiPhuTrach: "",
                khachMoi: "",
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
                          {(() => {
                            console.log('Club ID:', club);
                            console.log('Clubs:', clubs);
                            const foundClub = clubs.find(c => c._id === Number(club));
                            console.log('Found club:', foundClub);
                            return foundClub ? foundClub.ten : 'N/A';
                          })()}
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
          <Input label="Thời gian tổ chức" value={newEvent.thoiGianToChuc} onChange={(e) => setNewEvent({ ...newEvent, thoiGianToChuc: e.target.value })} />
          <Input label="Địa điểm" value={newEvent.diaDiem} onChange={(e) => setNewEvent({ ...newEvent, diaDiem: e.target.value })} />
          <Textarea label="Nội dung" value={newEvent.noiDung} onChange={(e) => setNewEvent({ ...newEvent, noiDung: e.target.value })} className="col-span-2" />
          <Input type="number" label="Ngân sách chi tiêu" value={newEvent.nganSachChiTieu} onChange={(e) => setNewEvent({ ...newEvent, nganSachChiTieu: e.target.value })} />
          <Input label="Người phụ trách" value={newEvent.nguoiPhuTrach} onChange={(e) => setNewEvent({ ...newEvent, nguoiPhuTrach: e.target.value })} />
          <Input label="Khách mời" value={newEvent.khachMoi} onChange={(e) => setNewEvent({ ...newEvent, khachMoi: e.target.value })} />
          <Select 
            label="Câu lạc bộ" 
            value={newEvent.club.toString()} 
            onChange={(value) => {
              console.log('Selected club value:', value);
              setNewEvent({ ...newEvent, club: value });
            }}
          >
            {clubs.map((club) => (
              <Option key={club._id} value={club._id.toString()}>{club.ten}</Option>
            ))}
          </Select>
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
            <Typography>Thời gian tổ chức: {detailEvent.thoiGianToChuc}</Typography>
            <Typography>Địa điểm: {detailEvent.diaDiem}</Typography>
            <Typography className="col-span-2">Nội dung: {detailEvent.noiDung}</Typography>
            <Typography>Ngân sách chi tiêu: {detailEvent.nganSachChiTieu}</Typography>
            <Typography>Người phụ trách: {detailEvent.nguoiPhuTrach}</Typography>
            <Typography>Khách mời: {detailEvent.khachMoi}</Typography>
            <Typography>
              Câu lạc bộ: {(() => {
                console.log('Detail event club:', detailEvent.club);
                console.log('Clubs in detail:', clubs);
                const foundClub = clubs.find(c => c._id === Number(detailEvent.club));
                console.log('Found club in detail:', foundClub);
                return foundClub ? foundClub.ten : 'N/A';
              })()}
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

export default ManageEvents;
