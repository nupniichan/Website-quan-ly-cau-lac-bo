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
    const [validationErrors, setValidationErrors] = useState({});
    const [editValidationErrors, setEditValidationErrors] = useState({});
    const [allMembers, setAllMembers] = useState([]); // State to store all members
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
        fetchAllMembers();
    }, []);

    useEffect(() => {
        if (selectedClubId) {
            fetchMembers(selectedClubId);
        } else {
            setMembers([]); // Clear members if no club is selected
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
    const fetchAllMembers = async () => {
        try {
            const response = await axios.get(`${API_URL}/get-members`); // Use your existing endpoint
            setAllMembers(response.data); // Store the fetched members in state
        } catch (error) {
            console.error("Error fetching all members:", error);
        }
    };
    const fetchMembers = async (clubId) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_URL}/get-members-by-club/${clubId}`);
            setMembers(response.data);
            console.log("Fetched members:", response.data); // Log fetched members
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.warn(`No members found for club ID: ${clubId}`); // Handle 404 specifically
                setMembers([]); // Clear members if no members found
            } else {
                console.error("Error fetching members:", error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddMember = async () => {
        // Validation
        const errors = {};
        if (!newMember.maSoHocSinh) errors.maSoHocSinh = "Mã số học sinh is required.";
        if (!newMember.hoTen) errors.hoTen = "Họ tên is required.";
        if (!newMember.gioiTinh) errors.gioiTinh = "Giới tính is required.";
        if (!newMember.lop) errors.lop = "Lớp is required.";
        if (!newMember.toHopHocTap) errors.toHopHocTap = "Tổ hợp học tập is required.";
        if (!newMember.thongTinLienLac) errors.thongTinLienLac = "Thông tin liên lạc is required.";
        if (!newMember.vaiTro) errors.vaiTro = "Vai trò is required.";
        if (!newMember.tinhTrang) errors.tinhTrang = "Tình trạng is required.";
        // Check if the student already exists in another club
        const studentInAnotherClub = allMembers.some(member => 
            member.maSoHocSinh === newMember.maSoHocSinh && member.club !== selectedClubId
        );
    
        if (studentInAnotherClub) {
            errors.maSoHocSinh = "Học sinh này đã là thành viên của câu lạc bộ khác."; // "This student is already a member of another club."
        }
    
        const memberExists = members.some(
            (member) => member.maSoHocSinh === newMember.maSoHocSinh
        );
        if (memberExists) errors.maSoHocSinh = "Học sinh đã tồn tại trong câu lạc bộ này."; // "Student already exists in this club."
    
        setValidationErrors(errors);
    
        if (Object.keys(errors).length > 0) {
            return; // Don't proceed if there are validation errors
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
        const errors = {};
        if (!editMember.maSoHocSinh) errors.maSoHocSinh = "Mã số học sinh is required.";
        if (!editMember.hoTen) errors.hoTen = "Họ tên is required.";
        if (!editMember.gioiTinh) errors.gioiTinh = "Giới tính is required.";
        if (!editMember.lop) errors.lop = "Lớp is required.";
        if (!editMember.toHopHocTap) errors.toHopHocTap = "Tổ hợp học tập is required.";
        if (!editMember.thongTinLienLac) errors.thongTinLienLac = "Thông tin liên lạc is required.";
        if (!editMember.vaiTro) errors.vaiTro = "Vai trò is required.";
        if (!editMember.tinhTrang) errors.tinhTrang = "Tình trạng is required.";
        const studentInAnotherClub = allMembers.some(member => 
            member.maSoHocSinh === editMember.maSoHocSinh && member.club !== selectedClubId
        );
    
        if (studentInAnotherClub) {
            errors.maSoHocSinh = "Học sinh này đã là thành viên của câu lạc bộ khác."; // "This student is already a member of another club."
        }
        setEditValidationErrors(errors);

        if (Object.keys(errors).length > 0) {
            return;
        }

        try {
            await axios.put(`${API_URL}/update-member/${editMember.maSoHocSinh}`, editMember);
            setMembers((prev) => prev.map(member => (member.maSoHocSinh === editMember.maSoHocSinh ? editMember : member)));
            setIsEditDialogOpen(false);
            setEditValidationErrors({});
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
            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <DialogHeader>Thêm thành viên mới</DialogHeader>
                <DialogBody>
                    <div className="space-y-4">
                        <Input
                            label="Mã số học sinh"
                            value={newMember.maSoHocSinh}
                            onChange={(e) => setNewMember({ ...newMember, maSoHocSinh: e.target.value })}
                        />
                        {validationErrors.maSoHocSinh && <Typography color="red">{validationErrors.maSoHocSinh}</Typography>}

                        <Input
                            label="Họ tên"
                            value={newMember.hoTen}
                            onChange={(e) => setNewMember({ ...newMember, hoTen: e.target.value })}
                        />
                        {validationErrors.hoTen && <Typography color="red">{validationErrors.hoTen}</Typography>}

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                            <select
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={newMember.gioiTinh}
                                onChange={(e) => setNewMember({ ...newMember, gioiTinh: e.target.value })}
                            >
                                <option value="">Chọn giới tính</option>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                            </select>
                            {validationErrors.gioiTinh && <Typography color="red">{validationErrors.gioiTinh}</Typography>}
                        </div>

                        <Input
                            label="Lớp"
                            value={newMember.lop}
                            onChange={(e) => setNewMember({ ...newMember, lop: e.target.value })}
                        />
                        {validationErrors.lop && <Typography color="red">{validationErrors.lop}</Typography>}

                        <Input
                            label="Tổ hợp học tập"
                            value={newMember.toHopHocTap}
                            onChange={(e) => setNewMember({ ...newMember, toHopHocTap: e.target.value })}
                        />
                        {validationErrors.toHopHocTap && <Typography color="red">{validationErrors.toHopHocTap}</Typography>}

                        <Input
                            label="Thông tin liên lạc"
                            value={newMember.thongTinLienLac}
                            onChange={(e) => setNewMember({ ...newMember, thongTinLienLac: e.target.value })}
                        />
                        {validationErrors.thongTinLienLac && <Typography color="red">{validationErrors.thongTinLienLac}</Typography>}

                        <Input
                            label="Vai trò"
                            value={newMember.vaiTro}
                            onChange={(e) => setNewMember({ ...newMember, vaiTro: e.target.value })}
                        />
                        {validationErrors.vaiTro && <Typography color="red">{validationErrors.vaiTro}</Typography>}

                        <Input
                            label="Tình trạng"
                            value={newMember.tinhTrang}
                            onChange={(e) => setNewMember({ ...newMember, tinhTrang: e.target.value })}
                        />
                        {validationErrors.tinhTrang && <Typography color="red">{validationErrors.tinhTrang}</Typography>}
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button color="red" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
                    <Button color="green" onClick={handleAddMember}>Thêm</Button>
                </DialogFooter>
            </Dialog>

            {/* Edit Member Dialog */}
            <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
                <DialogHeader>Chỉnh sửa thông tin thành viên</DialogHeader>
                <DialogBody>
                    <div className="space-y-4">
                        <Input
                            label="Mã số học sinh"
                            value={editMember.maSoHocSinh}
                            onChange={(e) => setEditMember({ ...editMember, maSoHocSinh: e.target.value })}
                        />
                        {editValidationErrors.maSoHocSinh && <Typography color="red">{editValidationErrors.maSoHocSinh}</Typography>}

                        <Input
                            label="Họ tên"
                            value={editMember.hoTen}
                            onChange={(e) => setEditMember({ ...editMember, hoTen: e.target.value })}
                        />
                        {editValidationErrors.hoTen && <Typography color="red">{editValidationErrors.hoTen}</Typography>}

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                            <select
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={editMember.gioiTinh}
                                onChange={(e) => setEditMember({ ...editMember, gioiTinh: e.target.value })}
                            >
                                <option value="">Chọn giới tính</option>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                            </select>
                            {editValidationErrors.gioiTinh && <Typography color="red">{editValidationErrors.gioiTinh}</Typography>}
                        </div>

                        <Input
                            label="Lớp"
                            value={editMember.lop}
                            onChange={(e) => setEditMember({ ...editMember, lop: e.target.value })}
                        />
                        {editValidationErrors.lop && <Typography color="red">{editValidationErrors.lop}</Typography>}

                        <Input
                            label="Tổ hợp học tập"
                            value={editMember.toHopHocTap}
                            onChange={(e) => setEditMember({ ...editMember, toHopHocTap: e.target.value })}
                        />
                        {editValidationErrors.toHopHocTap && <Typography color="red">{editValidationErrors.toHopHocTap}</Typography>}

                        <Input
                            label="Thông tin liên lạc"
                            value={editMember.thongTinLienLac}
                            onChange={(e) => setEditMember({ ...editMember, thongTinLienLac: e.target.value })}
                        />
                        {editValidationErrors.thongTinLienLac && <Typography color="red">{editValidationErrors.thongTinLienLac}</Typography>}

                        <Input
                            label="Vai trò"
                            value={editMember.vaiTro}
                            onChange={(e) => setEditMember({ ...editMember, vaiTro: e.target.value })}
                        />
                        {editValidationErrors.vaiTro && <Typography color="red">{editValidationErrors.vaiTro}</Typography>}

                        <Input
                            label="Tình trạng"
                            value={editMember.tinhTrang}
                            onChange={(e) => setEditMember({ ...editMember, tinhTrang: e.target.value })}
                        />
                        {editValidationErrors.tinhTrang && <Typography color="red">{editValidationErrors.tinhTrang}</Typography>}
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button color="red" onClick={() => setIsEditDialogOpen(false)}>Hủy</Button>
                    <Button color="green" onClick={handleEditMember}>Lưu</Button>
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
