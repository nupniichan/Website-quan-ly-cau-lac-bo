import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa6";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Dialog,
    DialogBody,
    DialogHeader,
    DialogFooter,
    Input,
    Tooltip,
    Spinner,
    Typography,
} from "@material-tailwind/react";
import {
    EyeIcon,
    PencilIcon,
    TrashIcon,
} from "@heroicons/react/24/solid";

const API_URL = "http://localhost:5500/api";

const ManageClubMembersPR = () => {
    const [members, setMembers] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [selectedClubId, setSelectedClubId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [detailMember, setDetailMember] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editMember, setEditMember] = useState({});

    // State for new member details
    const [newMember, setNewMember] = useState({
        maSoHocSinh: '',
        hoTen: '',
        gioiTinh: '',
        lop: '',
        toHopHocTap: '',
        thongTinLienLac: '',
        vaiTro: '',
        tinhTrang: '',
    });

    useEffect(() => {
        fetchClubs();
    }, []);

    useEffect(() => {
        if (selectedClubId) {
            fetchMembers(selectedClubId);
        }
    }, [selectedClubId]);

    const fetchClubs = async () => {
        try {
            const response = await axios.get(`${API_URL}/get-clubs`);
            setClubs(response.data);
        } catch (error) {
            console.error("Error fetching clubs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMembers = async (clubId) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_URL}/get-members-by-club/${clubId}`);
            setMembers(response.data);
        } catch (error) {
            console.error("Error fetching members:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddMember = async () => {
        if (!newMember.maSoHocSinh || !newMember.hoTen || !newMember.gioiTinh || !newMember.lop) {
            alert("Please fill in all fields.");
            return;
        }

        const memberToAdd = {
            ...newMember,
            club: selectedClubId,
            ngayThamGia: new Date().toISOString(),
        };

        try {
            const response = await axios.post(`${API_URL}/add-member`, memberToAdd);
            setMembers((prev) => [...prev, response.data]);
            setIsDialogOpen(false);
            setNewMember({ maSoHocSinh: '', hoTen: '', gioiTinh: '', lop: '', toHopHocTap: '', thongTinLienLac: '', vaiTro: '', tinhTrang: '' });
        } catch (error) {
            console.error("Error adding member:", error);
        }
    };

    const handleDeleteMember = async (maSoHocSinh) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa thành viên này khỏi câu lạc bộ?")) {
            try {
                await axios.delete(`${API_URL}/delete-member/${maSoHocSinh}/${selectedClubId}`);
                setMembers((prev) => prev.filter(member => member.maSoHocSinh !== maSoHocSinh));
            } catch (error) {
                console.error("Error deleting member:", error);
            }
        }
    };

    const openAddDialog = () => {
        setIsDialogOpen(true);
    };

    const openDetailDialog = async (maSoHocSinh) => {
        try {
            const response = await axios.get(`${API_URL}/get-member/${maSoHocSinh}`);
            setDetailMember(response.data);
            setIsDetailDialogOpen(true);
        } catch (error) {
            console.error("Error fetching member details:", error);
        }
    };

    const openEditDialog = async (maSoHocSinh) => {
        try {
            const response = await axios.get(`${API_URL}/get-member/${maSoHocSinh}`);
            setEditMember(response.data);
            setIsEditDialogOpen(true);
        } catch (error) {
            console.error("Error fetching member for editing:", error);
        }
    };

    const handleEditMember = async () => {
        try {
            await axios.put(`${API_URL}/update-member/${editMember.maSoHocSinh}`, editMember);
            setMembers((prev) => prev.map(member => (member.maSoHocSinh === editMember.maSoHocSinh ? editMember : member)));
            setIsEditDialogOpen(false);
        } catch (error) {
            console.error("Error updating member:", error);
        }
    };

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            {isLoading ? (
                <div className="flex justify-center"><Spinner /></div>
            ) : (
                <Card>
                    <CardHeader variant="gradient" color="blue" className="p-6 mb-8">
                        <Typography variant="h6" color="white">
                            Quản lý thành viên
                        </Typography>
                    </CardHeader>
                    <CardBody className="px-0 pt-0 pb-2 overflow-auto">
                        <div className="flex justify-between items-center p-4 px-6 pr-10 mb-4">
                            <select
                                onChange={(e) => setSelectedClubId(e.target.value)}
                                value={selectedClubId || ""}
                                className="p-2 border border-gray-300 rounded-lg transition duration-300 ease-in-out transform hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                            >
                                <option value="" disabled hidden>Chọn câu lạc bộ</option>
                                {clubs.map((club) => (
                                    <option key={club._id} value={club._id}>{club.ten}</option>
                                ))}
                            </select>

                            <Tooltip
                                content="Thêm"
                                animate={{
                                    mount: { scale: 1, y: 0 },
                                    unmount: { scale: 0, y: 25 },
                                }}
                                className="bg-gradient-to-r from-black to-transparent opacity-70"
                            >
                                <Button
                                    className="flex items-center gap-3"
                                    color="blue"
                                    size="sm"
                                    onClick={openAddDialog}
                                >
                                    <FaPlus className="w-4 h-4" strokeWidth={"2rem"} />
                                </Button>
                            </Tooltip>
                        </div>

                        {isLoading ? (
                            <div className="flex items-center justify-center h-64">
                                <Spinner className="w-12 h-12" color="blue" />
                            </div>
                        ) : members.length === 0 ? (
                            <Typography className="py-4 text-center">
                                Chưa có thành viên nào.
                            </Typography>
                        ) : (
                            <table className="w-full min-w-[640px] table-auto">
                                <thead>
                                    <tr>
                                        {["Mã số học sinh", "Họ tên", "Giới tính", "Lớp", "Thao tác"].map((el) => (
                                            <th key={el} className="px-5 py-3 text-left border-b border-blue-gray-50">
                                                <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                                                    {el}
                                                </Typography>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {members.map(({ maSoHocSinh, hoTen, gioiTinh, lop, club }, key) => {
                                        const className = `py-3 px-5 ${key === members.length - 1 ? "" : "border-b border-blue-gray-50"}`;
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
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            color="blue"
                                                            onClick={() => openDetailDialog(maSoHocSinh)}
                                                        >
                                                            <EyeIcon className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            color="green"
                                                            onClick={() => openEditDialog(maSoHocSinh)}
                                                        >
                                                            <PencilIcon className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            color="red"
                                                            onClick={() => handleDeleteMember(maSoHocSinh)}
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
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
            )}

            {/* Add Member Dialog */}
            <Dialog open={isDialogOpen} handler={setIsDialogOpen}>
                <DialogHeader>Add New Member</DialogHeader>
                <DialogBody>
                    <div className="flex flex-col space-y-4">
                        <Input
                            label="Mã Số Học Sinh"
                            value={newMember.maSoHocSinh}
                            onChange={(e) => setNewMember({ ...newMember, maSoHocSinh: e.target.value })}
                            className="border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Input
                            label="Họ Tên"
                            value={newMember.hoTen}
                            onChange={(e) => setNewMember({ ...newMember, hoTen: e.target.value })}
                            className="border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Input
                            label="Giới Tính"
                            value={newMember.gioiTinh}
                            onChange={(e) => setNewMember({ ...newMember, gioiTinh: e.target.value })}
                            className="border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Input
                            label="Lớp"
                            value={newMember.lop}
                            onChange={(e) => setNewMember({ ...newMember, lop: e.target.value })}
                            className="border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Input
                            label="Tổ Học Tập"
                            value={newMember.toHopHocTap}
                            onChange={(e) => setNewMember({ ...newMember, toHopHocTap: e.target.value })}
                            className="border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Input
                            label="Thông Tin Liên Lạc"
                            value={newMember.thongTinLienLac}
                            onChange={(e) => setNewMember({ ...newMember, thongTinLienLac: e.target.value })}
                            className="border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Input
                            label="Vai Trò"
                            value={newMember.vaiTro}
                            onChange={(e) => setNewMember({ ...newMember, vaiTro: e.target.value })}
                            className="border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Input
                            label="Tình Trạng"
                            value={newMember.tinhTrang}
                            onChange={(e) => setNewMember({ ...newMember, tinhTrang: e.target.value })}
                            className="border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button color="red" onClick={() => setIsDialogOpen(false)}>
                        Hủy
                    </Button>
                    <Button color="green" onClick={handleAddMember}>
                        Thêm
                    </Button>
                </DialogFooter>
            </Dialog>

            {/* Edit Member Dialog */}
            <Dialog open={isEditDialogOpen} handler={setIsEditDialogOpen}>
                <DialogHeader>Edit Member</DialogHeader>
                <DialogBody>
                    <div className="flex flex-col space-y-4">
                        <Input
                            label="Mã Số Học Sinh"
                            value={editMember.maSoHocSinh}
                            disabled // Disable editing for student ID
                            className="border border-gray-300 rounded-lg shadow-sm focus:outline-none bg-gray-100"
                        />
                        <Input
                            label="Họ Tên"
                            value={editMember.hoTen}
                            onChange={(e) => setEditMember({ ...editMember, hoTen: e.target.value })}
                            className="border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Input
                            label="Giới Tính"
                            value={editMember.gioiTinh}
                            onChange={(e) => setEditMember({ ...editMember, gioiTinh: e.target.value })}
                            className="border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Input
                            label="Lớp"
                            value={editMember.lop}
                            onChange={(e) => setEditMember({ ...editMember, lop: e.target.value })}
                            className="border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Input
                            label="Tổ Học Tập"
                            value={editMember.toHopHocTap}
                            onChange={(e) => setEditMember({ ...editMember, toHopHocTap: e.target.value })}
                            className="border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Input
                            label="Thông Tin Liên Lạc"
                            value={editMember.thongTinLienLac}
                            onChange={(e) => setEditMember({ ...editMember, thongTinLienLac: e.target.value })}
                            className="border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Input
                            label="Vai Trò"
                            value={editMember.vaiTro}
                            onChange={(e) => setEditMember({ ...editMember, vaiTro: e.target.value })}
                            className="border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Input
                            label="Tình Trạng"
                            value={editMember.tinhTrang}
                            onChange={(e) => setEditMember({ ...editMember, tinhTrang: e.target.value })}
                            className="border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button color="red" onClick={() => setIsEditDialogOpen(false)}>
                        Hủy
                    </Button>
                    <Button color="green" onClick={handleEditMember}>
                        Cập Nhật
                    </Button>
                </DialogFooter>
            </Dialog>


            {/* Detail Member Dialog */}
            <Dialog open={isDetailDialogOpen} handler={setIsDetailDialogOpen}>
                <DialogHeader>Member Details</DialogHeader>
                <DialogBody>
                    {detailMember && (
                        <div>
                            <Typography><strong>Mã Số Học Sinh:</strong> {detailMember.maSoHocSinh}</Typography>
                            <Typography><strong>Họ Tên:</strong> {detailMember.hoTen}</Typography>
                            <Typography><strong>Giới Tính:</strong> {detailMember.gioiTinh}</Typography>
                            <Typography><strong>Lớp:</strong> {detailMember.lop}</Typography>
                            <Typography><strong>Tổ Học Tập:</strong> {detailMember.toHopHocTap}</Typography>
                            <Typography><strong>Thông Tin Liên Lạc:</strong> {detailMember.thongTinLienLac}</Typography>
                            <Typography><strong>Vai Trò:</strong> {detailMember.vaiTro}</Typography>
                            <Typography><strong>Tình Trạng:</strong> {detailMember.tinhTrang}</Typography>
                            <Typography>
                                <strong>Ngày Tham Gia:</strong> {detailMember.ngayThamGia ? new Date(detailMember.ngayThamGia).toLocaleDateString('vi-VN') : 'Chưa có dữ liệu'}
                            </Typography>

                        </div>
                    )}
                </DialogBody>
                <DialogFooter>
                    <Button color="red" onClick={() => setIsDetailDialogOpen(false)}>
                        Đóng
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default ManageClubMembersPR;
