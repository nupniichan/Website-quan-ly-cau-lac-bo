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
  Select,
  Option,
  Spinner,
} from "@material-tailwind/react";
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/solid";

const API_URL = "http://localhost:5500/api";

const ManageMembers = () => {
  const [members, setMembers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    maSoHocSinh: "",
    hoTen: "",
    gioiTinh: "",
    lop: "",
    toHopHocTap: "",
    thongTinLienLac: "",
    ngayThamGia: "",
    vaiTro: "",
    tinhTrang: "",
    club: "",
  });
  const [detailMember, setDetailMember] = useState(null);
  const [editingMemberId, setEditingMemberId] = useState(null);

  useEffect(() => {
    fetchMembers();
    fetchClubs();
  }, []);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/get-members`);
      console.log('Dữ liệu thành viên:', response.data);
      setMembers(response.data);
    } catch (error) {
      console.error("Error fetching members:", error);
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

  const handleAddMember = async () => {
    try {
      const memberData = {
        ...newMember,
        club: Number(newMember.club) // Chuyển đổi club thành số
      };
      const response = await axios.post(`${API_URL}/add-member`, memberData);
      console.log('Phản hồi từ server:', response.data);
      setIsDialogOpen(false);
      fetchMembers();
    } catch (error) {
      console.error("Error adding member:", error);
      alert(`Lỗi khi thêm thành viên: ${error.response?.data?.message || 'Không xác định'}`);
    }
  };

  const handleUpdateMember = async () => {
    try {
      const memberData = {
        ...newMember,
        club: Number(newMember.club) // Chuyển đổi club thành số
      };
      const response = await axios.put(`${API_URL}/update-member/${editingMemberId}`, memberData);
      console.log('Phản hồi từ server:', response.data);
      setIsDialogOpen(false);
      setEditingMemberId(null);
      fetchMembers();
    } catch (error) {
      console.error("Error updating member:", error);
      alert(`Lỗi khi cập nhật thành viên: ${error.response?.data?.message || 'Không xác định'}`);
    }
  };

  const handleDeleteMember = async (maSoHocSinh) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thành viên này?")) {
      try {
        const response = await axios.delete(`${API_URL}/delete-member/${maSoHocSinh}`);
        console.log('Phản hồi từ server:', response.data);
        fetchMembers();
      } catch (error) {
        console.error("Error deleting member:", error);
        alert(`Lỗi khi xóa thành viên: ${error.response?.data?.message || 'Không xác định'}`);
      }
    }
  };

  const openAddDialog = () => {
    setNewMember({
      maSoHocSinh: "",
      hoTen: "",
      gioiTinh: "",
      lop: "",
      toHopHocTap: "",
      thongTinLienLac: "",
      ngayThamGia: "",
      vaiTro: "",
      tinhTrang: "",
      club: "",
    });
    setEditingMemberId(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = async (maSoHocSinh) => {
    try {
      const response = await axios.get(`${API_URL}/get-member/${maSoHocSinh}`);
      console.log('Thông tin thành viên nhận được:', response.data);
      setNewMember({
        ...response.data,
        ngayThamGia: response.data.ngayThamGia.split('T')[0],
      });
      setEditingMemberId(maSoHocSinh);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error fetching member details:", error);
      alert(`Lỗi khi lấy thông tin thành viên: ${error.response?.data?.message || 'Không xác định'}`);
    }
  };

  const openDetailDialog = async (maSoHocSinh) => {
    try {
      const response = await axios.get(`${API_URL}/get-member/${maSoHocSinh}`);
      console.log('Thông tin chi tiết thành viên nhận được:', response.data);
      setDetailMember(response.data);
      setIsDetailDialogOpen(true);
    } catch (error) {
      console.error("Error fetching member details:", error);
      alert(`Lỗi khi lấy thông tin thành viên: ${error.response?.data?.message || 'Không xác định'}`);
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Quản lý thành viên
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <div className="flex justify-end mb-4 px-6">
            <Button
              className="flex items-center gap-3"
              color="blue"
              size="sm"
              onClick={openAddDialog}
            >
              <PlusIcon strokeWidth={2} className="h-4 w-4" /> Thêm thành viên
            </Button>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner className="h-12 w-12" color="blue" />
            </div>
          ) : members.length === 0 ? (
            <Typography className="text-center py-4">
              Chưa có thành viên nào.
            </Typography>
          ) : (
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Mã số học sinh", "Họ tên", "Giới tính", "Lớp", "Câu lạc bộ", "Thao tác"].map((el) => (
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
                {members.map(({ maSoHocSinh, hoTen, gioiTinh, lop, club }, key) => {
                  const className = `py-3 px-5 ${
                    key === members.length - 1 ? "" : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={maSoHocSinh}>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {maSoHocSinh}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {hoTen}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {gioiTinh}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {lop}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {clubs.find(c => c._id === club)?.ten || 'N/A'}
                        </Typography>
                      </td>
                      <td className={className}>
                        <div className="flex items-center gap-2">
                          <Button size="sm" color="green" className="flex items-center gap-2" onClick={() => openDetailDialog(maSoHocSinh)}>
                            <EyeIcon strokeWidth={2} className="h-4 w-4" /> Chi tiết
                          </Button>
                          <Button size="sm" color="blue" className="flex items-center gap-2" onClick={() => openEditDialog(maSoHocSinh)}>
                            <PencilIcon strokeWidth={2} className="h-4 w-4" /> Sửa
                          </Button>
                          <Button size="sm" color="red" className="flex items-center gap-2" onClick={() => handleDeleteMember(maSoHocSinh)}>
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

      {/* Dialog thêm/sửa thành viên */}
      <Dialog open={isDialogOpen} handler={() => setIsDialogOpen(false)} size="xl">
        <DialogHeader>{editingMemberId ? "Chỉnh sửa Thành viên" : "Thêm Thành viên Mới"}</DialogHeader>
        <DialogBody divider className="grid grid-cols-2 gap-4">
          <Input label="Mã số học sinh" value={newMember.maSoHocSinh} onChange={(e) => setNewMember({ ...newMember, maSoHocSinh: e.target.value })} />
          <Input label="Họ tên" value={newMember.hoTen} onChange={(e) => setNewMember({ ...newMember, hoTen: e.target.value })} />
          <Select label="Giới tính" value={newMember.gioiTinh} onChange={(value) => setNewMember({ ...newMember, gioiTinh: value })}>
            <Option value="Nam">Nam</Option>
            <Option value="Nữ">Nữ</Option>
          </Select>
          <Input label="Lớp" value={newMember.lop} onChange={(e) => setNewMember({ ...newMember, lop: e.target.value })} />
          <Input label="Tổ hợp học tập" value={newMember.toHopHocTap} onChange={(e) => setNewMember({ ...newMember, toHopHocTap: e.target.value })} />
          <Input label="Thông tin liên lạc" value={newMember.thongTinLienLac} onChange={(e) => setNewMember({ ...newMember, thongTinLienLac: e.target.value })} />
          <Input type="date" label="Ngày tham gia" value={newMember.ngayThamGia} onChange={(e) => setNewMember({ ...newMember, ngayThamGia: e.target.value })} />
          <Input label="Vai trò" value={newMember.vaiTro} onChange={(e) => setNewMember({ ...newMember, vaiTro: e.target.value })} />
          <Select label="Tình trạng" value={newMember.tinhTrang} onChange={(value) => setNewMember({ ...newMember, tinhTrang: value })}>
            <Option value="Đang hoạt động">Đang hoạt động</Option>
            <Option value="Đã nghỉ">Đã nghỉ</Option>
          </Select>
          <Select 
            label="Câu lạc bộ" 
            value={newMember.club.toString()} // Chuyển đổi thành chuỗi để hiển thị
            onChange={(value) => setNewMember({ ...newMember, club: value })}
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
          <Button variant="gradient" color="green" onClick={editingMemberId ? handleUpdateMember : handleAddMember}>
            {editingMemberId ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Dialog xem chi tiết thành viên */}
      <Dialog open={isDetailDialogOpen} handler={() => setIsDetailDialogOpen(false)} size="xl">
        <DialogHeader>Chi tiết Thành viên</DialogHeader>
        {detailMember ? (
          <DialogBody divider className="grid grid-cols-2 gap-4">
            <Typography>Mã số học sinh: {detailMember.maSoHocSinh}</Typography>
            <Typography>Họ tên: {detailMember.hoTen}</Typography>
            <Typography>Giới tính: {detailMember.gioiTinh}</Typography>
            <Typography>Lớp: {detailMember.lop}</Typography>
            <Typography>Tổ hợp học tập: {detailMember.toHopHocTap}</Typography>
            <Typography>Thông tin liên lạc: {detailMember.thongTinLienLac}</Typography>
            <Typography>Ngày tham gia: {new Date(detailMember.ngayThamGia).toLocaleDateString()}</Typography>
            <Typography>Vai trò: {detailMember.vaiTro}</Typography>
            <Typography>Tình trạng: {detailMember.tinhTrang}</Typography>
            <Typography>Câu lạc bộ: {clubs.find(c => c._id === detailMember.club)?.ten || 'N/A'}</Typography>
          </DialogBody>
        ) : (
          <Spinner />
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

export default ManageMembers;