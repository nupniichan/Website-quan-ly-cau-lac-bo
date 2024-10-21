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
  Textarea,
  Spinner,
} from "@material-tailwind/react";
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/solid";

const API_URL = "http://localhost:5500/api";

const ManagePrizes = () => {
  const [prizes, setPrizes] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [newPrize, setNewPrize] = useState({
    tenGiaiThuong: "",
    ngayDatGiai: "",
    loaiGiai: "",
    thanhVienDatGiai: "",
    club: "",
    ghiChu: "",
    anhDatGiai: null,
  });
  const [detailPrize, setDetailPrize] = useState(null);
  const [editingPrizeId, setEditingPrizeId] = useState(null);

  useEffect(() => {
    fetchPrizes();
    fetchClubs();
    fetchMembers();
  }, []);

  const fetchPrizes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/get-prizes`);
      setPrizes(response.data);
    } catch (error) {
      console.error("Error fetching prizes:", error);
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

  const fetchMembers = async () => {
    try {
      const response = await axios.get(`${API_URL}/get-members`);
      setMembers(response.data);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const handleAddPrize = async () => {
    try {
      const formData = new FormData();
      Object.keys(newPrize).forEach(key => {
        if (key === 'anhDatGiai') {
          if (newPrize.anhDatGiai) {
            formData.append('anhDatGiai', newPrize.anhDatGiai);
          }
        } else {
          formData.append(key, newPrize[key]);
        }
      });

      const response = await axios.post(`${API_URL}/add-prize`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setIsDialogOpen(false);
      fetchPrizes();
    } catch (error) {
      console.error("Error adding prize:", error);
      alert(`Lỗi khi thêm giải thưởng: ${error.response?.data?.message || 'Không xác định'}`);
    }
  };

  const handleUpdatePrize = async () => {
    try {
      const formData = new FormData();
      Object.keys(newPrize).forEach(key => {
        if (key === 'anhDatGiai') {
          if (newPrize.anhDatGiai) {
            formData.append('anhDatGiai', newPrize.anhDatGiai);
          }
        } else {
          formData.append(key, newPrize[key]);
        }
      });

      const response = await axios.put(`${API_URL}/update-prize/${editingPrizeId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setIsDialogOpen(false);
      setEditingPrizeId(null);
      fetchPrizes();
    } catch (error) {
      console.error("Error updating prize:", error);
      alert(`Lỗi khi cập nhật giải thưởng: ${error.response?.data?.message || 'Không xác định'}`);
    }
  };

  const handleDeletePrize = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa giải thưởng này?")) {
      try {
        await axios.delete(`${API_URL}/delete-prize/${id}`);
        fetchPrizes();
      } catch (error) {
        console.error("Error deleting prize:", error);
        alert(`Lỗi khi xóa giải thưởng: ${error.response?.data?.message || 'Không xác định'}`);
      }
    }
  };

  const openAddDialog = () => {
    setNewPrize({
      tenGiaiThuong: "",
      ngayDatGiai: "",
      loaiGiai: "",
      thanhVienDatGiai: "",
      club: "",
      ghiChu: "",
      anhDatGiai: null,
    });
    setEditingPrizeId(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (id) => {
    const prizeToEdit = prizes.find(prize => prize._id === id);
    if (prizeToEdit) {
      setNewPrize({ ...prizeToEdit, anhDatGiai: null });
      setEditingPrizeId(id);
      setIsDialogOpen(true);
    }
  };

  const openDetailDialog = (id) => {
    const prizeDetail = prizes.find(prize => prize._id === id);
    if (prizeDetail) {
      setDetailPrize(prizeDetail);
      setIsDetailDialogOpen(true);
    }
  };

  const handleImageChange = (e) => {
    setNewPrize({ ...newPrize, anhDatGiai: e.target.files[0] });
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Quản lý Giải thưởng
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <div className="flex justify-end p-4">
            <Button className="flex items-center gap-3" color="blue" size="sm" onClick={openAddDialog}>
              <PlusIcon strokeWidth={2} className="h-4 w-4" /> Thêm Giải thưởng
            </Button>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner className="h-16 w-16 text-blue-500/10" />
            </div>
          ) : (
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Tên giải thưởng", "Ngày đạt giải", "Loại giải", "Thành viên đạt giải", "CLB", "Thao tác"].map((el) => (
                    <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                      <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {prizes.map(({ _id, tenGiaiThuong, ngayDatGiai, loaiGiai, thanhVienDatGiai, club }, index) => {
                  const className = `py-3 px-5 ${index === prizes.length - 1 ? "" : "border-b border-blue-gray-50"}`;

                  return (
                    <tr key={_id}>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {tenGiaiThuong}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {new Date(ngayDatGiai).toLocaleDateString()}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {loaiGiai}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {members.find(m => m._id === thanhVienDatGiai)?.hoTen || 'N/A'}
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
                          <Button size="sm" color="red" className="flex items-center gap-2" onClick={() => handleDeletePrize(_id)}>
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

      {/* Dialog thêm/sửa giải thưởng */}
      <Dialog open={isDialogOpen} handler={() => setIsDialogOpen(false)} size="xl">
        <DialogHeader>{editingPrizeId ? "Chỉnh sửa Giải thưởng" : "Thêm Giải thưởng Mới"}</DialogHeader>
        <DialogBody divider className="grid grid-cols-2 gap-4">
          <Input label="Tên giải thưởng" value={newPrize.tenGiaiThuong} onChange={(e) => setNewPrize({ ...newPrize, tenGiaiThuong: e.target.value })} />
          <Input type="date" label="Ngày đạt giải" value={newPrize.ngayDatGiai} onChange={(e) => setNewPrize({ ...newPrize, ngayDatGiai: e.target.value })} />
          <Input label="Loại giải" value={newPrize.loaiGiai} onChange={(e) => setNewPrize({ ...newPrize, loaiGiai: e.target.value })} />
          <Select 
            label="Thành viên đạt giải" 
            value={newPrize.thanhVienDatGiai} 
            onChange={(value) => setNewPrize({ ...newPrize, thanhVienDatGiai: value })}
          >
            {members.map((member) => (
              <Option key={member._id} value={member._id}>{member.hoTen}</Option>
            ))}
          </Select>
          <Select 
            label="Câu lạc bộ" 
            value={newPrize.club} 
            onChange={(value) => setNewPrize({ ...newPrize, club: value })}
          >
            {clubs.map((club) => (
              <Option key={club._id} value={club._id}>{club.ten}</Option>
            ))}
          </Select>
          <Textarea label="Ghi chú" value={newPrize.ghiChu} onChange={(e) => setNewPrize({ ...newPrize, ghiChu: e.target.value })} />
          <Input type="file" label="Ảnh đạt giải" onChange={handleImageChange} accept="image/*" />
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={() => setIsDialogOpen(false)} className="mr-1">
            Hủy
          </Button>
          <Button variant="gradient" color="green" onClick={editingPrizeId ? handleUpdatePrize : handleAddPrize}>
            {editingPrizeId ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Dialog xem chi tiết giải thưởng */}
      <Dialog open={isDetailDialogOpen} handler={() => setIsDetailDialogOpen(false)} size="xl">
        <DialogHeader>Chi tiết Giải thưởng</DialogHeader>
        {detailPrize && (
          <DialogBody divider className="grid grid-cols-2 gap-4">
            <Typography>Tên giải thưởng: {detailPrize.tenGiaiThuong}</Typography>
            <Typography>Ngày đạt giải: {new Date(detailPrize.ngayDatGiai).toLocaleDateString()}</Typography>
            <Typography>Loại giải: {detailPrize.loaiGiai}</Typography>
            <Typography>Thành viên đạt giải: {members.find(m => m._id === detailPrize.thanhVienDatGiai)?.hoTen || 'N/A'}</Typography>
            <Typography>Câu lạc bộ: {clubs.find(c => c._id === detailPrize.club)?.ten || 'N/A'}</Typography>
            <Typography>Ghi chú: {detailPrize.ghiChu}</Typography>
            {detailPrize.anhDatGiai && (
              <img src={`${API_URL}/${detailPrize.anhDatGiai}`} alt="Ảnh đạt giải" className="col-span-2 max-w-full h-auto" />
            )}
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

export default ManagePrizes;
