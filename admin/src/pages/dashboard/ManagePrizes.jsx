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
  Select,
  Option,
} from "@material-tailwind/react";
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/solid";

const API_URL = "http://localhost:5500/api";

const ManagePrizes = () => {
  const [prizes, setPrizes] = useState([]);
  const [members, setMembers] = useState([]);
  const [managedClub, setManagedClub] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [newPrize, setNewPrize] = useState({
    tenGiaiThuong: "",
    ngayDatGiai: "",
    loaiGiai: "",
    thanhVienDatGiai: "",
    ghiChu: "",
    anhDatGiai: null,
  });
  const [detailPrize, setDetailPrize] = useState(null);
  const [editingPrizeId, setEditingPrizeId] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const managedClubsString = localStorage.getItem('managedClubs');
    if (managedClubsString) {
      try {
        const managedClubs = JSON.parse(managedClubsString);
        if (managedClubs && managedClubs.length > 0) {
          setManagedClub(managedClubs[0]);
          fetchPrizes(managedClubs[0]._id);
          fetchMembers(managedClubs[0]._id);
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
  }, []);

  const fetchPrizes = async (clubId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/get-prizes-by-club/${clubId}`);
      setPrizes(response.data);
    } catch (error) {
      console.error("Error fetching prizes:", error);
      alert("Lỗi khi tải danh sách giải thưởng");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMembers = async (clubId) => {
    try {
      const response = await axios.get(`${API_URL}/get-members-by-club/${clubId}`);
      setMembers(response.data);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const handleAddPrize = async () => {
    try {
      if (!managedClub) {
        throw new Error("Managed club information is not available");
      }
      
      const prizeData = {
        ...newPrize,
        club: managedClub._id,
        anhDatGiai: newPrize.anhDatGiai ? newPrize.anhDatGiai.name : null // Send file name or null
      };

      // If using FormData (for file upload)
      const formData = new FormData();
      Object.keys(prizeData).forEach(key => {
        if (key === 'anhDatGiai' && prizeData[key] instanceof File) {
          formData.append('anhDatGiai', prizeData[key]);
        } else {
          formData.append(key, prizeData[key]);
        }
      });

      const response = await axios.post(`${API_URL}/add-prize`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setIsDialogOpen(false);
      fetchPrizes(managedClub._id);
    } catch (error) {
      console.error("Error adding prize:", error);
      alert(`Lỗi khi thêm giải thưởng: ${error.response?.data?.message || error.message || 'Không xác định'}`);
    }
  };

  const handleUpdatePrize = async () => {
    try {
      const formData = new FormData();
      Object.keys(newPrize).forEach(key => {
        if (key === 'anhDatGiai') {
          if (newPrize.anhDatGiai && newPrize.anhDatGiai instanceof File) {
            formData.append('anhDatGiai', newPrize.anhDatGiai);
          }
        } else if (key !== 'club') { // Không thêm trường 'club' vào formData
          formData.append(key, newPrize[key]);
        }
      });
      // Thêm club ID riêng biệt
      formData.append('club', managedClub._id);

      const response = await axios.put(`${API_URL}/update-prize/${editingPrizeId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setIsDialogOpen(false);
      setEditingPrizeId(null);
      fetchPrizes(managedClub._id);
    } catch (error) {
      console.error("Error updating prize:", error);
      alert(`Lỗi khi cập nhật giải thưởng: ${error.response?.data?.message || error.message || 'Không xác định'}`);
    }
  };

  const handleDeletePrize = async (prizeId) => {
    if (window.confirm("Bạn c chắc chắn muốn xóa giải thưởng này?")) {
      try {
        const response = await axios.delete(`${API_URL}/delete-prize/${prizeId}/${managedClub.clubId}`);
        fetchPrizes(managedClub.clubId);
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
      ghiChu: "",
      anhDatGiai: null,
    });
    setEditingPrizeId(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (id) => {
    const prizeToEdit = prizes.find(prize => prize._id === id);
    if (prizeToEdit) {
      setNewPrize({ 
        ...prizeToEdit, 
        anhDatGiai: null // We'll keep the file input empty, but display the current image separately
      });
      setCurrentImage(prizeToEdit.anhDatGiai ? `${API_URL}/uploads/${prizeToEdit.anhDatGiai}` : null);
      setPreviewImage(null);
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
    const file = e.target.files[0];
    setNewPrize({ ...newPrize, anhDatGiai: file });
    
    // Create a preview of the new image
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
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
                  {["Tên giải thưởng", "Ngày đạt giải", "Loại giải", "Thành viên đạt giải", "Thao tác"].map((el) => (
                    <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                      <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {prizes.map(({ _id, tenGiaiThuong, ngayDatGiai, loaiGiai, thanhVienDatGiai }, index) => {
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
          <Input type="date" label="Ngày đạt giải" value={newPrize.ngayDatGiai?.split('T')[0]} onChange={(e) => setNewPrize({ ...newPrize, ngayDatGiai: e.target.value })} />
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
          <Textarea label="Ghi chú" value={newPrize.ghiChu} onChange={(e) => setNewPrize({ ...newPrize, ghiChu: e.target.value })} />
          <div className="flex flex-col gap-2">
            <Input type="file" label="Ảnh đạt giải mới" onChange={handleImageChange} accept="image/*" />
            {editingPrizeId && currentImage && (
              <div>
                <p>Ảnh hiện tại:</p>
                <img src={currentImage} alt="Ảnh đạt giải hiện tại" className="max-w-full h-auto mt-2" style={{maxHeight: '100px'}} />
              </div>
            )}
            {previewImage && (
              <div>
                <p>Ảnh mới:</p>
                <img src={previewImage} alt="Ảnh đạt giải mới" className="max-w-full h-auto mt-2" style={{maxHeight: '100px'}} />
              </div>
            )}
          </div>
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
            <Typography className="col-span-2">Ghi chú: {detailPrize.ghiChu}</Typography>
            {detailPrize.anhDatGiai && (
              <div className="col-span-2">
                <Typography>Ảnh đạt giải:</Typography>
                <img src={`${API_URL}/uploads/${detailPrize.anhDatGiai}`} alt="Ảnh đạt giải" className="max-w-full h-auto mt-2" style={{maxHeight: '300px'}} />
              </div>
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
