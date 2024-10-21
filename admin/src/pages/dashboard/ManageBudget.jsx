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

const ManageBudget = () => {
  const [budgets, setBudgets] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [newBudget, setNewBudget] = useState({
    ten: "",
    khoanChiTieu: 0,
    nguonThu: 0,
    ngay: "",
    thanhVienChiuTrachNhiem: "",
    noiDung: "",
    club: "",
  });
  const [detailBudget, setDetailBudget] = useState(null);
  const [editingBudgetId, setEditingBudgetId] = useState(null);

  useEffect(() => {
    fetchBudgets();
    fetchClubs();
  }, []);

  const fetchBudgets = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/get-budgets`);
      console.log('Dữ liệu ngân sách:', response.data);
      setBudgets(response.data);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClubs = async () => {
    try {
      const response = await axios.get(`${API_URL}/get-clubs`);
      console.log('Danh sách CLB:', response.data); // Log để kiểm tra
      setClubs(response.data);
    } catch (error) {
      console.error("Error fetching clubs:", error);
    }
  };

  const handleAddBudget = async () => {
    try {
      const budgetData = {
        ...newBudget,
        clubId: Number(newBudget.club),
        khoanChiTieu: Number(newBudget.khoanChiTieu),
        nguonThu: Number(newBudget.nguonThu),
      };
      console.log('Dữ liệu gửi đi:', budgetData);
      const response = await axios.post(`${API_URL}/add-budget`, budgetData);
      console.log('Phản hồi từ server:', response.data);
      setIsDialogOpen(false);
      fetchBudgets();
    } catch (error) {
      console.error("Error adding budget:", error);
      alert(`Lỗi khi thêm ngân sách: ${error.response?.data?.message || 'Không xác định'}`);
    }
  };

  const handleUpdateBudget = async () => {
    try {
      const budgetData = {
        ...newBudget,
        club: Number(newBudget.club),
        khoanChiTieu: Number(newBudget.khoanChiTieu),
        nguonThu: Number(newBudget.nguonThu),
      };
      const response = await axios.put(`${API_URL}/update-budget/${editingBudgetId}`, budgetData);
      console.log('Phản hồi từ server:', response.data);
      setIsDialogOpen(false);
      setEditingBudgetId(null);
      fetchBudgets();
    } catch (error) {
      console.error("Error updating budget:", error);
      alert(`Lỗi khi cập nhật ngân sách: ${error.response?.data?.message || 'Không xác định'}`);
    }
  };

  const handleDeleteBudget = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa ngân sách này?")) {
      try {
        const response = await axios.delete(`${API_URL}/delete-budget/${id}`);
        console.log('Phản hồi từ server:', response.data);
        fetchBudgets();
      } catch (error) {
        console.error("Error deleting budget:", error);
        alert(`Lỗi khi xóa ngân sách: ${error.response?.data?.message || 'Không xác định'}`);
      }
    }
  };

  const openAddDialog = () => {
    setNewBudget({
      ten: "",
      khoanChiTieu: 0,
      nguonThu: 0,
      ngay: "",
      thanhVienChiuTrachNhiem: "",
      noiDung: "",
      club: "",
    });
    setEditingBudgetId(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (id) => {
    const budgetToEdit = budgets.find(budget => budget._id === id);
    if (budgetToEdit) {
      setNewBudget({
        ...budgetToEdit,
        ngay: budgetToEdit.ngay.split('T')[0],
      });
      setEditingBudgetId(id);
      setIsDialogOpen(true);
    }
  };

  const openDetailDialog = (id) => {
    const budgetToView = budgets.find(budget => budget._id === id);
    if (budgetToView) {
      setDetailBudget(budgetToView);
      setIsDetailDialogOpen(true);
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Quản lý ngân sách
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
              <PlusIcon strokeWidth={2} className="h-4 w-4" /> Thêm ngân sách
            </Button>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner className="h-12 w-12" color="blue" />
            </div>
          ) : budgets.length === 0 ? (
            <Typography className="text-center py-4">
              Chưa có ngân sách nào.
            </Typography>
          ) : (
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Tên ngân sách", "Khoản chi tiêu", "Nguồn thu", "Ngày", "Thành viên chịu trách nhiệm", "Câu lạc bộ", "Thao tác"].map((el) => (
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
                {budgets.map(({ _id, ten, khoanChiTieu, nguonThu, ngay, thanhVienChiuTrachNhiem, club }, key) => {
                  const className = `py-3 px-5 ${
                    key === budgets.length - 1 ? "" : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={_id}>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {ten}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {khoanChiTieu.toLocaleString()} VND
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {nguonThu.toLocaleString()} VND
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {new Date(ngay).toLocaleDateString()}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {thanhVienChiuTrachNhiem}
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
                          <Button size="sm" color="red" className="flex items-center gap-2" onClick={() => handleDeleteBudget(_id)}>
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

      {/* Dialog thêm/sửa ngân sách */}
      <Dialog open={isDialogOpen} handler={() => setIsDialogOpen(false)} size="xl">
        <DialogHeader>{editingBudgetId ? "Chỉnh sửa Ngân sách" : "Thêm Ngân sách Mới"}</DialogHeader>
        <DialogBody divider className="grid grid-cols-2 gap-4">
          <Input label="Tên ngân sách" value={newBudget.ten} onChange={(e) => setNewBudget({ ...newBudget, ten: e.target.value })} />
          <Input type="number" label="Khoản chi tiêu" value={newBudget.khoanChiTieu} onChange={(e) => setNewBudget({ ...newBudget, khoanChiTieu: e.target.value })} />
          <Input type="number" label="Nguồn thu" value={newBudget.nguonThu} onChange={(e) => setNewBudget({ ...newBudget, nguonThu: e.target.value })} />
          <Input type="date" label="Ngày" value={newBudget.ngay} onChange={(e) => setNewBudget({ ...newBudget, ngay: e.target.value })} />
          <Input label="Thành viên chịu trách nhiệm" value={newBudget.thanhVienChiuTrachNhiem} onChange={(e) => setNewBudget({ ...newBudget, thanhVienChiuTrachNhiem: e.target.value })} />
          <Input label="Nội dung" value={newBudget.noiDung} onChange={(e) => setNewBudget({ ...newBudget, noiDung: e.target.value })} />
          <Select 
            label="Câu lạc bộ" 
            value={newBudget.club ? newBudget.club.toString() : ''} 
            onChange={(value) => setNewBudget({ ...newBudget, club: value })}
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
          <Button variant="gradient" color="green" onClick={editingBudgetId ? handleUpdateBudget : handleAddBudget}>
            {editingBudgetId ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Dialog xem chi tiết ngân sách */}
      <Dialog open={isDetailDialogOpen} handler={() => setIsDetailDialogOpen(false)} size="xl">
        <DialogHeader>Chi tiết Ngân sách</DialogHeader>
        {detailBudget ? (
          <DialogBody divider className="grid grid-cols-2 gap-4">
            <Typography>Tên ngân sách: {detailBudget.ten}</Typography>
            <Typography>Khoản chi tiêu: {detailBudget.khoanChiTieu.toLocaleString()} VND</Typography>
            <Typography>Nguồn thu: {detailBudget.nguonThu.toLocaleString()} VND</Typography>
            <Typography>Ngày: {new Date(detailBudget.ngay).toLocaleDateString()}</Typography>
            <Typography>Thành viên chịu trách nhiệm: {detailBudget.thanhVienChiuTrachNhiem}</Typography>
            <Typography>Nội dung: {detailBudget.noiDung}</Typography>
            <Typography>Câu lạc bộ: {clubs.find(c => c._id === detailBudget.club)?.ten || 'N/A'}</Typography>
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

export default ManageBudget;
