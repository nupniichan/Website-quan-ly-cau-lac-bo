import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader,
    Input,
    Option,
    Select,
    Spinner,
    Tooltip,
    Typography,
} from "@material-tailwind/react";
import {
    EyeIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    XMarkIcon,
} from "@heroicons/react/24/solid";
import { FaPlus } from "react-icons/fa6";

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
    const [managedClub, setManagedClub] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [errors, setErrors] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [studentIdSearch, setStudentIdSearch] = useState("");
    const [genderFilter, setGenderFilter] = useState("all");
    const [roleFilter, setRoleFilter] = useState("all");
    const [joinDateFilter, setJoinDateFilter] = useState({
        from: "",
        to: ""
    });
    const [searchType, setSearchType] = useState("name");

    // Thêm state để lưu trữ danh sách vai trò duy nhất
    const uniqueRoles = useMemo(() => {
        const roles = members
            .map(member => member.vaiTro)
            .filter((role, index, self) => 
                // Lọc ra các vai trò duy nhất và không rỗng
                role && self.indexOf(role) === index
            )
            .sort(); // Sắp xếp theo alphabet
        return roles;
    }, [members]);

    useEffect(() => {
        const managedClubsString = localStorage.getItem("managedClubs");
        if (managedClubsString) {
            try {
                const managedClubs = JSON.parse(managedClubsString);
                if (managedClubs && managedClubs.length > 0) {
                    setManagedClub(managedClubs[0]);
                    fetchMembers(managedClubs[0]._id);
                } else {
                    throw new Error("No managed clubs found");
                }
            } catch (error) {
                console.error("Error parsing managed clubs data:", error);
                alert(
                    "Không thể tải thông tin câu lạc bộ. Vui lòng đăng nhập lại.",
                );
            }
        } else {
            console.error("No managed clubs data found");
            alert(
                "Không tìm thấy thông tin câu lạc bộ. Vui lòng đăng nhập lại.",
            );
        }
        setIsLoading(false);
        fetchClubs(); // Add this line to fetch clubs when component mounts
    }, []);

    const fetchMembers = async (clubId) => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `${API_URL}/get-members-by-club/${clubId}`,
            );
            setMembers(response.data);
        } catch (error) {
            console.error("Error fetching members:", error);
            alert("Lỗi khi tải danh sách thành viên");
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

    const fetchManagedClub = async (clubId) => {
        try {
            const response = await axios.get(
                `http://localhost:5500/api/get-club/${clubId}`,
            );
            setManagedClub(response.data);
            setNewMember((prev) => ({ ...prev, club: clubId }));
        } catch (error) {
            console.error("Error fetching managed club:", error);
        }
    };

    const handleAddMember = async () => {
        try {
            if (!managedClub) {
                throw new Error("Managed club information is not available");
            }

            const memberData = {
                ...newMember,
                club: managedClub._id,
            };
            const response = await axios.post(
                `${API_URL}/add-member`,
                memberData,
            );
            setIsDialogOpen(false);
            fetchMembers(managedClub._id);
        } catch (error) {
            console.error("Error adding member:", error);
            alert(
                `Lỗi khi thêm thành viên: ${error.message || "Không xác định"}`,
            );
        }
    };

    const handleUpdateMember = async () => {
        if (!validateForm()) return;

        try {
            const response = await axios.put(
                `${API_URL}/update-member/${editingMemberId}`,
                newMember,
            );
            setIsDialogOpen(false);
            setEditingMemberId(null);
            fetchMembers(managedClub._id);
        } catch (error) {
            console.error("Error updating member:", error);
            alert(
                `Lỗi khi cập nhật thành viên: ${
                    error.response?.data?.message || "Không xác định"
                }`,
            );
        }
    };

    const handleDeleteMember = async (maSoHocSinh, tinhTrang) => {
        // Kiểm tra tình trạng của thành viên
        if (tinhTrang === "Đang hoạt động") {
            alert("Không thể xóa thành viên đang hoạt động!");
            return;
        }

        if (window.confirm("Bạn có chắc chắn muốn xóa thành viên này?")) {
            try {
                const response = await axios.delete(
                    `${API_URL}/delete-member/${maSoHocSinh}/${managedClub._id}`,
                );
                fetchMembers(managedClub._id);
            } catch (error) {
                console.error("Error deleting member:", error);
                alert(
                    `Lỗi khi xóa thành viên: ${
                        error.response?.data?.message || "Không xác định"
                    }`,
                );
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
            setErrors({});
            const response = await axios.get(
                `${API_URL}/get-member/${maSoHocSinh}`,
            );
            setNewMember({
                ...response.data,
                ngayThamGia: response.data.ngayThamGia.split("T")[0],
            });
            setEditingMemberId(maSoHocSinh);
            setIsDialogOpen(true);
        } catch (error) {
            console.error("Error fetching member details:", error);
            alert(
                `Lỗi khi lấy thông tin thành viên: ${
                    error.response?.data?.message || "Không xác định"
                }`,
            );
        }
    };

    const openDetailDialog = async (maSoHocSinh) => {
        try {
            const response = await axios.get(
                `${API_URL}/get-member/${maSoHocSinh}`,
            );
            setDetailMember(response.data);
            setIsDetailDialogOpen(true);

            if (clubs.length === 0) {
                await fetchClubs();
            }
        } catch (error) {
            console.error("Error fetching member details:", error);
            alert(
                `Lỗi khi lấy thông tin thành viên: ${
                    error.response?.data?.message || "Không xác định"
                }`,
            );
        }
    };

    const filteredMembers = useMemo(() => {
        const filtered = members.filter(member => {
            const searchMatch = searchTerm.toLowerCase().trim() === '' ? true :
                /^\d+$/.test(searchTerm) 
                    ? member.maSoHocSinh.toLowerCase().includes(searchTerm.toLowerCase())
                    : member.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      member.lop.toLowerCase().includes(searchTerm.toLowerCase());
            
            const genderMatch = genderFilter === "all" || 
                member.gioiTinh.toLowerCase() === genderFilter.toLowerCase();
            
            const roleMatch = roleFilter === "all" || 
                (member.vaiTro && member.vaiTro === roleFilter);
            
            const joinDate = new Date(member.ngayThamGia);
            const fromDate = joinDateFilter.from ? new Date(joinDateFilter.from) : null;
            const toDate = joinDateFilter.to ? new Date(joinDateFilter.to) : null;
            
            const dateMatch = (!fromDate || joinDate >= fromDate) && 
                             (!toDate || joinDate <= toDate);

            return searchMatch && genderMatch && roleMatch && dateMatch;
        });

        return filtered.sort((a, b) => new Date(b.ngayThamGia) - new Date(a.ngayThamGia));
    }, [members, searchTerm, genderFilter, roleFilter, joinDateFilter]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentMembers = filteredMembers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const validateForm = () => {
        const newErrors = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Validate mã số học sinh
        if (!newMember.maSoHocSinh?.trim()) {
            newErrors.maSoHocSinh = "Vui lòng nhập mã số học sinh";
        }

        // Validate họ tên
        if (!newMember.hoTen?.trim()) {
            newErrors.hoTen = "Vui lòng nhập họ tên";
        }

        // Validate giới tính
        if (!newMember.gioiTinh) {
            newErrors.gioiTinh = "Vui lòng chọn giới tính";
        }

        // Validate lớp
        if (!newMember.lop?.trim()) {
            newErrors.lop = "Vui lòng nhập lớp";
        }

        // Validate ngày tham gia
        if (!newMember.ngayThamGia) {
            newErrors.ngayThamGia = "Vui lòng chọn ngày tham gia";
        } else {
            const joinDate = new Date(newMember.ngayThamGia);
            joinDate.setHours(0, 0, 0, 0);
            if (joinDate > today) {
                newErrors.ngayThamGia = "Ngày tham gia không thể là ngày tương lai";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return (
        <div className="flex flex-col gap-12 mt-12 mb-8">
            <Card>
                <CardHeader
                    variant="gradient"
                    color="blue"
                    className="p-6 mb-8"
                >
                    <Typography variant="h6" color="white">
                        Quản lý thành viên
                    </Typography>
                </CardHeader>

                <CardBody className="px-0 pt-0 pb-2 overflow-auto">
                    <div className="flex justify-between items-center p-4 px-6">
                        {/* Search input */}
                        <div className="w-96">
                            <Input
                                label="Tìm kiếm theo tên hoặc MSHS hoặc lớp"
                                icon={<i className="fas fa-search" />}
                                value={searchTerm || studentIdSearch}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*$/.test(value)) {
                                        setStudentIdSearch(value);
                                        setSearchTerm("");
                                    } else {
                                        setSearchTerm(value);
                                        setStudentIdSearch("");
                                    }
                                }}
                                // className="!border !border-blue-gray-200 bg-white shadow-lg shadow-blue-gray-900/5 ring-4 ring-transparent placeholder:text-blue-gray-200 focus:!border-blue-500"
                                // labelProps={{
                                //     className: "text-xs font-normal",
                                // }}
                            />
                        </div>

                        {/* Add button */}
                        <div>
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
                    </div>

                    {/* Filter section */}
                    <div className="px-6 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Gender filter */}
                            <div>
                                <Select
                                    label="Giới tính"
                                    value={genderFilter}
                                    onChange={(value) => setGenderFilter(value)}
                                    className="bg-white"
                                >
                                    <Option value="all">Tất cả</Option>
                                    <Option value="nam">Nam</Option>
                                    <Option value="nữ">Nữ</Option>
                                </Select>
                            </div>

                            {/* Role filter */}
                            <div>
                                <Select
                                    label="Vai trò"
                                    value={roleFilter}
                                    onChange={(value) => setRoleFilter(value)}
                                    className="bg-white"
                                >
                                    <Option value="all">Tất cả</Option>
                                    {uniqueRoles.map((role) => (
                                        <Option key={role} value={role}>
                                            {role}
                                        </Option>
                                    ))}
                                </Select>
                            </div>

                            {/* From date filter */}
                            <div>
                                <Input
                                    type="date"
                                    label="Từ ngày"
                                    value={joinDateFilter.from}
                                    onChange={(e) => setJoinDateFilter(prev => ({...prev, from: e.target.value}))}
                                    className="bg-white"
                                />
                            </div>

                            {/* To date filter */}
                            <div>
                                <Input
                                    type="date"
                                    label="Đến ngày"
                                    value={joinDateFilter.to}
                                    onChange={(e) => setJoinDateFilter(prev => ({...prev, to: e.target.value}))}
                                    className="bg-white"
                                />
                            </div>
                        </div>

                        {/* Reset filters button */}
                        {(searchTerm || studentIdSearch || genderFilter !== "all" || roleFilter !== "all" || joinDateFilter.from || joinDateFilter.to) && (
                            <div className="flex justify-center mt-4">
                                <Button
                                    variant="text"
                                    color="red"
                                    className="flex items-center gap-2"
                                    onClick={() => {
                                        setSearchTerm("");
                                        setStudentIdSearch("");
                                        setGenderFilter("all");
                                        setRoleFilter("all");
                                        setJoinDateFilter({ from: "", to: "" });
                                    }}
                                >
                                    <XMarkIcon className="h-4 w-4" />
                                    <span>Xóa bộ lọc</span>
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Search results count */}
                    {(searchTerm || studentIdSearch || genderFilter !== "all" || roleFilter !== "all" || joinDateFilter.from || joinDateFilter.to) && (
                        <div className="px-6 mb-4">
                            <Typography variant="small" color="blue-gray">
                                Tìm thấy {filteredMembers.length} kết quả
                                {searchTerm && ` cho "${searchTerm}"`}
                                {studentIdSearch && ` cho MSSV "${studentIdSearch}"`}
                                {genderFilter !== "all" && ` với giới tính ${genderFilter}`}
                                {roleFilter !== "all" && ` với vai trò ${roleFilter}`}
                                {joinDateFilter.from && ` từ ${new Date(joinDateFilter.from).toLocaleDateString('vi-VN')}`}
                                {joinDateFilter.to && ` đến ${new Date(joinDateFilter.to).toLocaleDateString('vi-VN')}`}
                            </Typography>
                        </div>
                    )}

                    {isLoading
                        ? (
                            <div className="flex items-center justify-center h-64">
                                <Spinner className="w-12 h-12" color="blue" />
                            </div>
                        )
                        : members.length === 0
                        ? (
                            <Typography className="py-4 text-center">
                                Chưa có thành viên nào.
                            </Typography>
                        )
                        : (
                            <>
                                <table className="w-full min-w-[640px] table-auto">
                                    <thead>
                                        <tr>
                                            {[
                                                "STT",
                                                "Mã số học sinh",
                                                "Họ tên",
                                                "Giới tính",
                                                "Lớp",
                                                "Vai trò",
                                                "Ngày tham gia",
                                                "Trạng thái",
                                                "Thao tác",
                                            ].map((el) => (
                                                <th
                                                    key={el}
                                                    className="px-5 py-3 text-left border-b border-blue-gray-50"
                                                >
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
                                        {currentMembers.map(
                                            (
                                                {
                                                    maSoHocSinh,
                                                    hoTen,
                                                    gioiTinh,
                                                    lop,
                                                    vaiTro,
                                                    ngayThamGia,
                                                    tinhTrang,
                                                },
                                                key,
                                            ) => {
                                                const className = `py-3 px-5 ${
                                                    key === currentMembers.length - 1
                                                        ? ""
                                                        : "border-b border-blue-gray-50"
                                                }`;

                                                // Tính s thứ tự dựa trên trang hiện tại
                                                const index = (currentPage - 1) * itemsPerPage + key + 1;

                                                return (
                                                    <tr key={maSoHocSinh}>
                                                        <td className={className}>
                                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                                {index}
                                                            </Typography>
                                                        </td>
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
                                                                {vaiTro || "Chưa phân công"}
                                                            </Typography>
                                                        </td>
                                                        <td className={className}>
                                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                                {new Date(ngayThamGia).toLocaleDateString("vi-VN")}
                                                            </Typography>
                                                        </td>
                                                        <td className={className}>
                                                            <div className={`px-2 py-1 rounded-full text-center text-xs font-semibold ${
                                                                tinhTrang === "Đang hoạt động" 
                                                                    ? "bg-green-100 text-green-800" 
                                                                    : "bg-red-100 text-red-800"
                                                            }`}>
                                                                {tinhTrang}
                                                            </div>
                                                        </td>
                                                        <td className={className}>
                                                            <div className="flex items-center gap-2">
                                                                <Tooltip
                                                                    content="Xem"
                                                                    animate={{
                                                                        mount: {
                                                                            scale:
                                                                                1,
                                                                            y: 0,
                                                                        },
                                                                        unmount: {
                                                                            scale:
                                                                                0,
                                                                            y: 25,
                                                                        },
                                                                    }}
                                                                    className="bg-gradient-to-r from-black to-transparent opacity-70"
                                                                >
                                                                    <Button
                                                                        size="sm"
                                                                        color="blue"
                                                                        className="flex items-center gap-2"
                                                                        onClick={() =>
                                                                            openDetailDialog(
                                                                                maSoHocSinh,
                                                                            )}
                                                                    >
                                                                        <EyeIcon
                                                                            strokeWidth={2}
                                                                            className="w-4 h-4"
                                                                        />
                                                                    </Button>
                                                                </Tooltip>
                                                                <Tooltip
                                                                    content="Sửa"
                                                                    animate={{
                                                                        mount: {
                                                                            scale:
                                                                                1,
                                                                            y: 0,
                                                                        },
                                                                        unmount: {
                                                                            scale:
                                                                                0,
                                                                            y: 25,
                                                                        },
                                                                    }}
                                                                    className="bg-gradient-to-r from-black to-transparent opacity-70"
                                                                >
                                                                    <Button
                                                                        size="sm"
                                                                        color="green"
                                                                        className="flex items-center gap-2"
                                                                        onClick={() =>
                                                                            openEditDialog(
                                                                                maSoHocSinh,
                                                                            )}
                                                                    >
                                                                        <PencilIcon
                                                                            strokeWidth={2}
                                                                            className="w-4 h-4"
                                                                        />
                                                                    </Button>
                                                                </Tooltip>
                                                                <Tooltip
                                                                    content="Xóa"
                                                                    animate={{
                                                                        mount: {
                                                                            scale:
                                                                                1,
                                                                            y: 0,
                                                                        },
                                                                        unmount: {
                                                                            scale:
                                                                                0,
                                                                            y: 25,
                                                                        },
                                                                    }}
                                                                    className="bg-gradient-to-r from-black to-transparent opacity-70"
                                                                >
                                                                    <Button
                                                                        size="sm"
                                                                        color="red"
                                                                        className="flex items-center gap-2"
                                                                        onClick={() =>
                                                                            handleDeleteMember(
                                                                                maSoHocSinh,
                                                                                members.find((m) => m.maSoHocSinh === maSoHocSinh)?.tinhTrang
                                                                            )}
                                                                    >
                                                                        <TrashIcon
                                                                            strokeWidth={2}
                                                                            className="w-4 h-4"
                                                                        />
                                                                    </Button>
                                                                </Tooltip>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            },
                                        )}
                                    </tbody>
                                </table>

                                <div className="flex items-center gap-4 justify-center mt-6 mb-4">
                                    <Button
                                        variant="text"
                                        className="flex items-center gap-2"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeftIcon strokeWidth={2} className="h-4 w-4" /> Trước
                                    </Button>

                                    <div className="flex items-center gap-2">
                                        {totalPages <= 5 ? (
                                            [...Array(totalPages)].map((_, index) => (
                                                <Button
                                                    key={index + 1}
                                                    variant={currentPage === index + 1 ? "gradient" : "text"}
                                                    color="blue"
                                                    onClick={() => handlePageChange(index + 1)}
                                                    className="w-10 h-10"
                                                >
                                                    {index + 1}
                                                </Button>
                                            ))
                                        ) : (
                                            <>
                                                <Button
                                                    variant={currentPage === 1 ? "gradient" : "text"}
                                                    color="blue"
                                                    onClick={() => handlePageChange(1)}
                                                    className="w-10 h-10"
                                                >
                                                    1
                                                </Button>

                                                {currentPage > 3 && (
                                                    <span className="mx-2">...</span>
                                                )}

                                                {[...Array(3)].map((_, index) => {
                                                    const pageNumber = Math.min(
                                                        Math.max(currentPage - 1 + index, 2),
                                                        totalPages - 1
                                                    );
                                                    if (pageNumber <= 1 || pageNumber >= totalPages) return null;
                                                    return (
                                                        <Button
                                                            key={pageNumber}
                                                            variant={currentPage === pageNumber ? "gradient" : "text"}
                                                            color="blue"
                                                            onClick={() => handlePageChange(pageNumber)}
                                                            className="w-10 h-10"
                                                        >
                                                            {pageNumber}
                                                        </Button>
                                                    );
                                                })}

                                                {currentPage < totalPages - 2 && (
                                                    <span className="mx-2">...</span>
                                                )}

                                                <Button
                                                    variant={currentPage === totalPages ? "gradient" : "text"}
                                                    color="blue"
                                                    onClick={() => handlePageChange(totalPages)}
                                                    className="w-10 h-10"
                                                >
                                                    {totalPages}
                                                </Button>
                                            </>
                                        )}
                                    </div>

                                    <Button
                                        variant="text"
                                        className="flex items-center gap-2"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Sau <ChevronRightIcon strokeWidth={2} className="h-4 w-4" />
                                    </Button>
                                </div>
                            </>
                        )}
                </CardBody>
            </Card>

            <Dialog
                open={isDialogOpen}
                handler={() => setIsDialogOpen(false)}
                size="lg"
            >
                <DialogHeader className="lg:text-2xl md:text-xl sm:text-base">
                    {editingMemberId
                        ? "Chỉnh sửa thành viên"
                        : "Thêm thành viên mới"}
                </DialogHeader>
                <DialogBody divider className="grid grid-cols-2 gap-4 overflow-y-auto max-h-[80vh] sm:max-h-[47vh]">
                    <Input
                        label="Mã số học sinh"
                        value={newMember.maSoHocSinh}
                        onChange={(e) => setNewMember({
                            ...newMember,
                            maSoHocSinh: e.target.value,
                        })}
                    />
                    <Input
                        label="Họ tên"
                        value={newMember.hoTen}
                        onChange={(e) => setNewMember({
                            ...newMember,
                            hoTen: e.target.value,
                        })}
                    />
                    <Select
                        label="Giới tính"
                        value={newMember.gioiTinh}
                        onChange={(value) =>
                            setNewMember({ ...newMember, gioiTinh: value })}
                    >
                        <Option value="Nam">Nam</Option>
                        <Option value="Nữ">Nữ</Option>
                    </Select>
                    <Input
                        label="Lớp"
                        value={newMember.lop}
                        onChange={(e) =>
                            setNewMember({ ...newMember, lop: e.target.value })}
                    />
                    <Input
                        label="Tổ hợp học tập"
                        value={newMember.toHopHocTap}
                        onChange={(e) => setNewMember({
                            ...newMember,
                            toHopHocTap: e.target.value,
                        })}
                    />
                    <Input
                        label="Thông tin liên lạc"
                        value={newMember.thongTinLienLac}
                        onChange={(e) => setNewMember({
                            ...newMember,
                            thongTinLienLac: e.target.value,
                        })}
                    />
                    <div>
                        <Input
                            type="date"
                            label="Ngày tham gia"
                            value={newMember.ngayThamGia}
                            onChange={(e) => {
                                setNewMember({
                                    ...newMember,
                                    ngayThamGia: e.target.value,
                                });
                                setErrors({ ...errors, ngayThamGia: "" });
                            }}
                            error={!!errors.ngayThamGia}
                            max={new Date().toISOString().split('T')[0]}
                        />
                        {errors.ngayThamGia && (
                            <Typography color="red" className="mt-1 text-xs">
                                {errors.ngayThamGia}
                            </Typography>
                        )}
                    </div>
                    <Input
                        label="Vai trò"
                        value={newMember.vaiTro}
                        onChange={(e) =>
                            setNewMember({
                                ...newMember,
                                vaiTro: e.target.value,
                            })}
                    />
                    <Select
                        label="Tình trạng"
                        value={newMember.tinhTrang}
                        onChange={(value) =>
                            setNewMember({ ...newMember, tinhTrang: value })}
                    >
                        <Option value="Đang hoạt động">Đang hoạt động</Option>
                        <Option value="Đã nghỉ">Đã nghỉ</Option>
                    </Select>
                    <Input
                        label="Câu lạc bộ"
                        value={managedClub?.ten || ""}
                        disabled
                    />
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={() => setIsDialogOpen(false)}
                        className="mr-1"
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="gradient"
                        color="green"
                        onClick={editingMemberId ? handleUpdateMember : handleAddMember}
                    >
                        {editingMemberId ? "Cập nhật" : "Thêm"}
                    </Button>
                </DialogFooter>
            </Dialog>

            <Dialog
                open={isDetailDialogOpen}
                handler={() => setIsDetailDialogOpen(false)}
                size="xl"
            >
                <DialogHeader className="flex items-center gap-4">
                    <Typography variant="h6">Chi tiết thành viên</Typography>
                    <Typography 
                        variant="small" 
                        className={`
                            px-3 py-1 rounded-full font-bold uppercase
                            ${detailMember?.tinhTrang === 'Đang hoạt động' 
                                ? 'bg-green-500 text-white' 
                                : 'bg-red-500 text-white'}
                        `}
                    >
                        {detailMember?.tinhTrang}
                    </Typography>
                </DialogHeader>

                {detailMember ? (
                    <DialogBody divider className="overflow-y-auto lg:max-h-[65vh] sm:max-h-[50vh] p-6">
                        <div className="flex gap-6">
                            <div className="flex-1">
                                <div className="bg-blue-gray-50 p-6 rounded-lg">
                                    <div className="text-center mb-6">
                                        <Typography variant="h4" color="blue" className="font-bold mb-2">
                                            {detailMember.hoTen}
                                        </Typography>
                                        <Typography 
                                            variant="small" 
                                            className="bg-white px-4 py-2 rounded-full text-blue-900 inline-block font-medium"
                                        >
                                            MSHS: {detailMember.maSoHocSinh}
                                        </Typography>
                                    </div>

                                    <div className="grid gap-4">
                                        <div className="bg-white p-4 rounded-lg">
                                            <Typography className="text-sm text-gray-600 mb-1">Câu lạc bộ</Typography>
                                            <Typography className="font-medium text-blue-900">
                                                {clubs.find((c) => c._id === detailMember.club)?.ten || "Đang tải..."}
                                            </Typography>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white p-4 rounded-lg">
                                                <Typography className="text-sm text-gray-600 mb-1">Lớp</Typography>
                                                <Typography className="font-medium">{detailMember.lop}</Typography>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg">
                                                <Typography className="text-sm text-gray-600 mb-1">Giới tính</Typography>
                                                <Typography className="font-medium">{detailMember.gioiTinh}</Typography>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-[1.5]">
                                <div className="grid gap-4">
                                    <div className="info-item bg-blue-gray-50 p-4 rounded-lg">
                                        <Typography className="text-sm text-gray-600 mb-1">Tổ hợp học tập</Typography>
                                        <Typography className="font-medium">
                                            {detailMember.toHopHocTap || "Chưa cập nhật"}
                                        </Typography>
                                    </div>

                                    <div className="info-item bg-blue-gray-50 p-4 rounded-lg">
                                        <Typography className="text-sm text-gray-600 mb-1">Thông tin liên lạc</Typography>
                                        <Typography className="font-medium">
                                            {detailMember.thongTinLienLac || "Chưa cập nhật"}
                                        </Typography>
                                    </div>

                                    <div className="info-item bg-blue-gray-50 p-4 rounded-lg">
                                        <Typography className="text-sm text-gray-600 mb-1">Ngày tham gia</Typography>
                                        <Typography className="font-medium">
                                            {new Date(detailMember.ngayThamGia).toLocaleDateString('vi-VN', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </Typography>
                                    </div>

                                    <div className="info-item bg-blue-gray-50 p-4 rounded-lg">
                                        <Typography className="text-sm text-gray-600 mb-1">Vai trò</Typography>
                                        <Typography className="font-medium">
                                            {detailMember.vaiTro || "Chưa phân công"}
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DialogBody>
                ) : (
                    <DialogBody className="flex justify-center items-center h-64">
                        <Spinner className="h-12 w-12" color="blue" />
                    </DialogBody>
                )}
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={() => setIsDetailDialogOpen(false)}
                        className="mr-1"
                    >
                        Đóng
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default ManageMembers;
