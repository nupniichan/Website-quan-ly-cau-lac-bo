import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
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
    Textarea,
    Tooltip,
    Typography,
} from "@material-tailwind/react";
import axios from "axios";
import React, { useEffect, useState, useMemo, useRef } from "react";
import { FaPlus } from "react-icons/fa6";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [errors, setErrors] = useState({});
    const [memberSearch, setMemberSearch] = useState("");
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState({
        startDate: '',
        endDate: ''
    });
    const [showMemberDropdown, setShowMemberDropdown] = useState(false);
    const [memberValidationError, setMemberValidationError] = useState("");

    const filteredPrizes = useMemo(() => {
        return prizes.filter(prize => {
            const matchesSearch = prize.tenGiaiThuong.toLowerCase().includes(searchTerm.toLowerCase()) ||
                members.find(m => m._id === prize.thanhVienDatGiai)?.hoTen.toLowerCase().includes(searchTerm.toLowerCase());

            const prizeDate = new Date(prize.ngayDatGiai);
            const matchesDateRange = (!dateFilter.startDate || prizeDate >= new Date(dateFilter.startDate)) &&
                (!dateFilter.endDate || prizeDate <= new Date(dateFilter.endDate));

            return matchesSearch && matchesDateRange;
        });
    }, [prizes, members, searchTerm, dateFilter]);

    useEffect(() => {
        const managedClubsString = localStorage.getItem("managedClubs");
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
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const fetchPrizes = async (clubId) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_URL}/get-prizes-by-club/${clubId}`);
            if (response.data) {
                console.log('Response data:', response.data);

                const formattedPrizes = response.data.map(prize => ({
                    ...prize,
                    ngayDatGiai: new Date(prize.ngayDatGiai).toISOString().split('T')[0],
                    thanhVienHoTen: prize.thanhVienDatGiai?.hoTen || 
                                   (typeof prize.thanhVienDatGiai === 'string' ? prize.thanhVienDatGiai : 'N/A')
                }));
                setPrizes(formattedPrizes);
            }
        } catch (error) {
            console.error("Error fetching prizes:", error);
            setPrizes([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMembers = async (clubId) => {
        try {
            const response = await axios.get(
                `${API_URL}/get-members-by-club/${clubId}`,
            );
            setMembers(response.data);
        } catch (error) {
            console.error("Error fetching members:", error);
        }
    };

    const handleAddPrize = async () => {
        if (!validateForm()) return;
        
        try {
            const formData = new FormData();
            
            // Thêm các trường dữ liệu vào formData
            Object.keys(newPrize).forEach(key => {
                if (key === 'anhDatGiai' && newPrize[key] instanceof File) {
                    formData.append('anhDatGiai', newPrize[key]);
                } else {
                    formData.append(key, newPrize[key]);
                }
            });
            
            // Thêm club ID
            formData.append('club', managedClub._id);

            const response = await axios.post(
                `${API_URL}/add-prize`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            );

            setIsDialogOpen(false);
            fetchPrizes(managedClub._id);
        } catch (error) {
            console.error('Error adding prize:', error);
            alert(`Lỗi khi thêm giải thưởng: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleUpdatePrize = async () => {
        if (!validateForm()) return;

        try {
            const formData = new FormData();
            
            // Loại bỏ các trường không cần thiết
            const { _id, createdAt, updatedAt, __v, ...prizeData } = newPrize;

            // Thêm các trường dữ liệu vào formData
            Object.keys(prizeData).forEach((key) => {
                if (key === "anhDatGiai") {
                    if (prizeData.anhDatGiai instanceof File) {
                        formData.append("anhDatGiai", prizeData.anhDatGiai);
                    }
                } else if (key === 'club') {
                    // Đảm bảo club ID là string
                    formData.append('club', managedClub._id.toString());
                } else if (key === 'thanhVienDatGiai') {
                    // Xử lý thanhVienDatGiai
                    const memberId = typeof prizeData.thanhVienDatGiai === 'object' 
                        ? prizeData.thanhVienDatGiai._id 
                        : prizeData.thanhVienDatGiai;
                    formData.append('thanhVienDatGiai', memberId);
                } else {
                    formData.append(key, prizeData[key]);
                }
            });

            const response = await axios.put(
                `${API_URL}/update-prize/${editingPrizeId}`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            setIsDialogOpen(false);
            setEditingPrizeId(null);
            fetchPrizes(managedClub._id);
            alert('Cập nhật giải thưởng thành công!');
        } catch (error) {
            console.error("Error updating prize:", error);
            alert(
                `Lỗi khi cập nhật giải thưởng: ${
                    error.response?.data?.message || error.message ||
                    "Không xác định"
                }`
            );
        }
    };

    const handleDeletePrize = async (prizeId) => {
        if (window.confirm("Bạn có chắc chắn muốn x��a giải thưởng này?")) {
            try {
                // Kiểm tra xem giải thưởng có trong báo cáo không
                const checkResponse = await axios.get(`${API_URL}/check-prize-in-reports/${prizeId}`);
                
                if (checkResponse.data.exists) {
                    alert("Không thể xóa giải thưởng này vì nó đã được sử dụng trong báo cáo!");
                    return;
                }

                const response = await axios.delete(
                    `${API_URL}/delete-prize/${prizeId}/${managedClub._id}`,
                );
                fetchPrizes(managedClub._id);
            } catch (error) {
                console.error("Error deleting prize:", error);
                alert(
                    `Lỗi khi xóa giải thưởng: ${
                        error.response?.data?.message || "Không xác định"
                    }`,
                );
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
        setPreviewImage(null);
    };

    const openEditDialog = (id) => {
        const prizeToEdit = prizes.find((prize) => prize._id === id);
        if (prizeToEdit) {
            // Tìm thông tin thành viên
            const member = members.find(m => 
                m._id === (typeof prizeToEdit.thanhVienDatGiai === 'string' 
                    ? prizeToEdit.thanhVienDatGiai 
                    : prizeToEdit.thanhVienDatGiai?._id)
            );

            setNewPrize({
                ...prizeToEdit,
                anhDatGiai: null, // Giữ input file trống
            });
            
            // Set giá trị tìm kiếm thành viên
            setMemberSearch(member ? member.hoTen : '');
            
            setCurrentImage(
                prizeToEdit.anhDatGiai
                    ? `${API_URL}/uploads/${prizeToEdit.anhDatGiai}`
                    : null,
            );
            setPreviewImage(null);
            setEditingPrizeId(id);
            setIsDialogOpen(true);
        }
    };

    const openDetailDialog = (id) => {
        const prizeDetail = prizes.find((prize) => prize._id === id);
        if (prizeDetail) {
            // Tìm thông tin thành viên
            const memberName = prizeDetail.thanhVienDatGiai?.hoTen || 
                              members.find(m => m._id === prizeDetail.thanhVienDatGiai)?._id || 
                              'Không xác định';

            setDetailPrize({
                ...prizeDetail,
                thanhVienHoTen: memberName // Thêm tên thành viên vào object
            });
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

    // Tính toán prizes cho trang hiện tại
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPrizes = filteredPrizes.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredPrizes.length / itemsPerPage);

    // Thêm hàm để xử lý chuyển trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleMemberSearch = (searchTerm) => {
        setMemberSearch(searchTerm);
        setShowMemberDropdown(true);
        setMemberValidationError("");
        setErrors(prev => ({ ...prev, thanhVienDatGiai: "" }));
        
        // Nếu input trống, hiển thị 5 thành viên ngẫu nhiên
        if (searchTerm.trim() === '') {
            const shuffled = [...members].sort(() => 0.5 - Math.random());
            setFilteredMembers(shuffled.slice(0, 5));
            return;
        }

        // Nếu có nhập text, lọc theo tên
        const filtered = members.filter(member => 
            member.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.mssv?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMembers(filtered.slice(0, 5));
    };

    const validateMember = () => {
        const selectedMemberId = newPrize.thanhVienDatGiai;
        
        // Kiểm tra xem thành viên có tồn tại trong danh sách không
        const isValidMember = members.some(member => 
            member._id === selectedMemberId || 
            (typeof selectedMemberId === 'object' && member._id === selectedMemberId._id)
        );
        
        if (!isValidMember) {
            setMemberValidationError("Vui lòng chọn thành viên từ danh sách câu lạc bộ");
            return false;
        }
        return true;
    };

    const validateForm = () => {
        const newErrors = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (!newPrize.tenGiaiThuong?.trim()) {
            newErrors.tenGiaiThuong = "Vui lòng nhập tên giải thưởng";
        }

        if (!newPrize.ngayDatGiai) {
            newErrors.ngayDatGiai = "Vui lòng chọn ngày đạt giải";
        } else {
            const prizeDate = new Date(newPrize.ngayDatGiai);
            if (prizeDate > today) {
                newErrors.ngayDatGiai = "Ngày đạt giải không thể là ngày tương lai";
            }
        }

        if (!newPrize.loaiGiai?.trim()) {
            newErrors.loaiGiai = "Vui lòng nhập loại giải";
        }

        if (!newPrize.thanhVienDatGiai) {
            newErrors.thanhVienDatGiai = "Vui lòng chọn thành viên đạt giải";
        } else if (!validateMember()) {
            newErrors.thanhVienDatGiai = memberValidationError;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Thêm refs để xử lý click outside
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    // Thêm useEffect để xử lý click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && 
                !dropdownRef.current.contains(event.target) && 
                !inputRef.current.contains(event.target)) {
                setShowMemberDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex flex-col gap-12 mt-12 mb-8">
            <Card>
                <CardHeader
                    variant="gradient"
                    color="blue"
                    className="p-6 mb-8"
                >
                    <Typography variant="h6" color="white">
                        Quản lý Giải thưởng
                    </Typography>
                </CardHeader>

                <CardBody className="px-0 pt-0 pb-2 overflow-auto">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-4 px-6 gap-4">
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full lg:w-auto">
                            <div className="w-full sm:w-96">
                                <Input
                                    label="Tìm kiếm theo tên giải hoặc người đạt giải"
                                    icon={<i className="fas fa-search" />}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full sm:w-auto">
                                <div className="relative w-full sm:w-40">
                                    <Input
                                        type="date"
                                        label="T ngày"
                                        value={dateFilter.startDate}
                                        onChange={(e) => setDateFilter(prev => ({
                                            ...prev,
                                            startDate: e.target.value
                                        }))}
                                        max={dateFilter.endDate || new Date().toISOString().split('T')[0]}
                                        className="w-full"
                                        containerProps={{
                                            className: "!min-w-0"
                                        }}
                                    />
                                </div>
                                <div className="relative w-full sm:w-40">
                                    <Input
                                        type="date"
                                        label="Đến ngày"
                                        value={dateFilter.endDate}
                                        onChange={(e) => setDateFilter(prev => ({
                                            ...prev,
                                            endDate: e.target.value
                                        }))}
                                        min={dateFilter.startDate}
                                        max={new Date().toISOString().split('T')[0]}
                                        className="w-full"
                                        containerProps={{
                                            className: "!min-w-0"
                                        }}
                                    />
                                </div>
                                {(dateFilter.startDate || dateFilter.endDate) && (
                                    <Button
                                        variant="text"
                                        color="red"
                                        className="p-2"
                                        onClick={() => setDateFilter({ startDate: '', endDate: '' })}
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="w-full sm:w-auto">
                            <Tooltip
                                content="Thêm"
                                animate={{
                                    mount: { scale: 1, y: 0 },
                                    unmount: { scale: 0, y: 25 },
                                }}
                                className="bg-gradient-to-r from-black to-transparent opacity-70"
                            >
                                <Button
                                    className="flex items-center gap-3 w-full sm:w-auto justify-center"
                                    color="blue"
                                    size="sm"
                                    onClick={openAddDialog}
                                >
                                    <FaPlus className="w-4 h-4" strokeWidth={"2rem"} />
                                </Button>
                            </Tooltip>
                        </div>
                    </div>

                    {(searchTerm || dateFilter.startDate || dateFilter.endDate) && (
                        <div className="px-6 mb-4">
                            <Typography variant="small" color="blue-gray">
                                Tìm thấy {filteredPrizes.length} kết quả
                                {searchTerm && ` cho từ khóa "${searchTerm}"`}
                                {dateFilter.startDate && ` từ ngày ${new Date(dateFilter.startDate).toLocaleDateString('vi-VN')}`}
                                {dateFilter.endDate && ` đến ngày ${new Date(dateFilter.endDate).toLocaleDateString('vi-VN')}`}
                            </Typography>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <Spinner className="w-16 h-16 text-blue-500/10" />
                        </div>
                    ) : filteredPrizes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 gap-4">
                            <Typography variant="h6" color="blue-gray">
                                {searchTerm || dateFilter.startDate || dateFilter.endDate
                                    ? "Không tìm thấy giải thưởng nào phù hợp với điều kiện tìm kiếm"
                                    : "Chưa có giải thưởng nào trong hệ thống"}
                            </Typography>
                            <Button
                                className="flex items-center gap-3"
                                color="blue"
                                onClick={openAddDialog}
                            >
                                <FaPlus className="w-4 h-4" /> Thêm giải thưởng mới
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[640px] table-auto">
                                    <thead>
                                        <tr>
                                            {[
                                                "STT",
                                                "Tên giải thưởng",
                                                "Ngày đạt giải",
                                                "Loại giải",
                                                "Thành viên đạt giải",
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
                                        {currentPrizes.map((prize, index) => {
                                            const className = `py-3 px-5 ${
                                                index === currentPrizes.length - 1
                                                    ? ""
                                                    : "border-b border-blue-gray-50"
                                            }`;

                                            return (
                                                <tr key={prize._id}>
                                                    <td className={className}>
                                                        <Typography className="text-xs font-semibold text-blue-gray-600">
                                                            {indexOfFirstItem + index + 1}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <Tooltip
                                                            content={prize.tenGiaiThuong}
                                                            animate={{
                                                                mount: { scale: 1, y: 0 },
                                                                unmount: { scale: 0, y: 25 },
                                                            }}
                                                            className="bg-black bg-opacity-80"
                                                        >
                                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                                {prize.tenGiaiThuong.length > 30 
                                                                    ? `${prize.tenGiaiThuong.substring(0, 30)}...` 
                                                                    : prize.tenGiaiThuong}
                                                            </Typography>
                                                        </Tooltip>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography className="text-xs font-semibold text-blue-gray-600">
                                                            {new Date(prize.ngayDatGiai).toLocaleDateString('vi-VN')}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography className="text-xs font-semibold text-blue-gray-600">
                                                            {prize.loaiGiai}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography className="text-xs font-semibold text-blue-gray-600">
                                                            {prize.thanhVienDatGiai?.hoTen || 
                                                             (typeof prize.thanhVienDatGiai === 'string' ? 
                                                              members.find(m => m._id === prize.thanhVienDatGiai)?.hoTen : 'N/A')}
                                                        </Typography>
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
                                                                            prize._id,
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
                                                                            prize._id,
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
                                                                        handleDeletePrize(
                                                                            prize._id,
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
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mt-4 px-4">
                                <Button
                                    variant="text"
                                    className="flex items-center gap-2"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeftIcon strokeWidth={2} className="h-4 w-4" /> Trước
                                </Button>
                                
                                <div className="flex items-center gap-2 overflow-x-auto py-2">
                                    {[...Array(totalPages)].map((_, index) => (
                                        <Button
                                            key={index + 1}
                                            variant={currentPage === index + 1 ? "gradient" : "text"}
                                            color="blue"
                                            onClick={() => handlePageChange(index + 1)}
                                            className="w-10 h-10 min-w-[2.5rem]"
                                        >
                                            {index + 1}
                                        </Button>
                                    ))}
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

            {/* Dialog thêm/sửa giải thưởng */}
            <Dialog
                open={isDialogOpen}
                handler={() => setIsDialogOpen(false)}
                size="lg"
                className="overflow-visible"
            >
                <DialogHeader className="lg:text-2xl md:text-xl sm:text-base">
                    {editingPrizeId
                        ? "Chỉnh sửa Giải thưởng"
                        : "Thêm Giải thưởng Mới"}
                </DialogHeader>

                        {/* NOTE Responsiveness for Dialog */}
                <DialogBody divider className="grid lg:grid-cols-2 gap-4 overflow-y-auto max-h-[80vh] sm:max-h-[47vh]">
                    <div>
                        <Input
                            label="Tên giải thưởng"
                            value={newPrize.tenGiaiThuong}
                            onChange={(e) => {
                                setNewPrize({
                                    ...newPrize,
                                    tenGiaiThuong: e.target.value,
                                });
                                setErrors({ ...errors, tenGiaiThuong: "" });
                            }}
                            error={!!errors.tenGiaiThuong}
                        />
                        {errors.tenGiaiThuong && (
                            <Typography color="red" className="mt-1 text-xs">
                                {errors.tenGiaiThuong}
                            </Typography>
                        )}
                    </div>

                    <div>
                        <Input
                            type="date"
                            label="Ngày đạt giải"
                            value={newPrize.ngayDatGiai?.split("T")[0]}
                            onChange={(e) => {
                                setNewPrize({
                                    ...newPrize,
                                    ngayDatGiai: e.target.value,
                                });
                                setErrors({ ...errors, ngayDatGiai: "" });
                            }}
                            error={!!errors.ngayDatGiai}
                            max={new Date().toISOString().split("T")[0]}
                        />
                        {errors.ngayDatGiai && (
                            <Typography color="red" className="mt-1 text-xs">
                                {errors.ngayDatGiai}
                            </Typography>
                        )}
                    </div>

                    <div>
                        <Input
                            label="Loại giải"
                            value={newPrize.loaiGiai}
                            onChange={(e) => {
                                setNewPrize({
                                    ...newPrize,
                                    loaiGiai: e.target.value,
                                });
                                setErrors({ ...errors, loaiGiai: "" });
                            }}
                            error={!!errors.loaiGiai}
                        />
                        {errors.loaiGiai && (
                            <Typography color="red" className="mt-1 text-xs">
                                {errors.loaiGiai}
                            </Typography>
                        )}
                    </div>

                    <div className="relative mb-4">
                        <Input
                            ref={inputRef}
                            id="member-input"
                            type="text"
                            label="Thành viên đạt giải"
                            value={memberSearch}
                            onChange={(e) => handleMemberSearch(e.target.value)}
                            onFocus={() => {
                                setShowMemberDropdown(true);
                                const shuffled = [...members].sort(() => 0.5 - Math.random());
                                setFilteredMembers(shuffled.slice(0, 5));
                            }}
                            error={!!errors.thanhVienDatGiai || !!memberValidationError}
                            className="pr-10"
                        />
                        
                        {showMemberDropdown && (
                            <div 
                                ref={dropdownRef}
                                className="absolute z-[9999] w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {filteredMembers.length > 0 ? (
                                    filteredMembers.map((member) => (
                                        <div
                                            key={member._id}
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                            onClick={() => {
                                                setNewPrize(prev => ({
                                                    ...prev,
                                                    thanhVienDatGiai: member._id
                                                }));
                                                setMemberSearch(member.hoTen);
                                                setShowMemberDropdown(false);
                                                setMemberValidationError("");
                                                setErrors(prev => ({ ...prev, thanhVienDatGiai: "" }));
                                            }}
                                        >
                                            <div className="text-sm font-medium">
                                                {member.hoTen}
                                            </div>
                                            {member.mssv && (
                                                <div className="text-xs text-gray-600">
                                                    MSSV: {member.mssv}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-2 text-gray-500 text-sm">
                                        Không tìm thấy thành viên phù hợp
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {(errors.thanhVienDatGiai || memberValidationError) && (
                            <Typography variant="small" color="red" className="mt-1">
                                {errors.thanhVienDatGiai || memberValidationError}
                            </Typography>
                        )}
                    </div>

                    <Textarea
                        label="Ghi chú"
                        value={newPrize.ghiChu}
                        onChange={(e) => setNewPrize({
                            ...newPrize,
                            ghiChu: e.target.value,
                        })}
                    />
                    <div className="flex flex-col gap-2">
                        <Button
                            variant="gradient"
                            className="flex items-center gap-3 w-[10.6rem]"
                            color="blue"
                        >
                            <CloudArrowUpIcon className="w-5 h-5 stroke-2" />
                            Upload Image
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </Button>
                        <div className="grid gap-4">
                            {editingPrizeId && currentImage && (
                                <div className="bg-blue-gray-50 p-4 rounded">
                                    <Typography className="text-gray-700 text-sm font-medium mb-2">
                                        Ảnh hiện tại:
                                    </Typography>
                                    <div className="relative group">
                                        <img
                                            src={currentImage}
                                            alt="Ảnh đạt giải hiện tại"
                                            className="w-full h-auto rounded-lg object-contain max-h-[200px]"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center">
                                            <Button
                                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                variant="text"
                                                color="white"
                                                onClick={() => window.open(currentImage, '_blank')}
                                            >
                                                <EyeIcon className="h-6 w-6" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {previewImage && (
                                <div className="bg-blue-gray-50 p-4 rounded">
                                    <Typography className="text-gray-700 text-sm font-medium mb-2">
                                        Ảnh mới:
                                    </Typography>
                                    <img
                                        src={previewImage}
                                        alt="Ảnh đạt giải mới"
                                        className="w-full h-auto rounded-lg object-contain max-h-[200px]"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
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
                        onClick={editingPrizeId
                            ? handleUpdatePrize
                            : handleAddPrize}
                    >
                        {editingPrizeId ? "Cập nhật" : "Thêm"}
                    </Button>
                </DialogFooter>
            </Dialog>

            {/* Dialog xem chi tiết giải thưởng */}
            <Dialog
                open={isDetailDialogOpen}
                handler={() => setIsDetailDialogOpen(false)}
                size="xl"
            >
                <DialogHeader className="lg:text-2xl md:text-xl sm:text-base">
                    Chi tiết Giải thưởng
                </DialogHeader>
                {detailPrize && (
                    <DialogBody divider className="overflow-y-auto lg:max-h-[65vh] sm:max-h-[50vh] p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Cột trái - Thông tin cơ bản */}
                            <div className="flex-1">
                                <Typography variant="h6" color="blue" className="mb-4">
                                    Thông tin chung
                                </Typography>
                                
                                <div className="bg-blue-gray-50 p-6 rounded-lg flex flex-col gap-5">
                                    <div>
                                        <Typography 
                                            variant="h4"
                                            className="text-center bg-white p-4 rounded border-2 border-dashed border-blue-500 text-blue-500 font-bold"
                                        >
                                            {detailPrize.tenGiaiThuong}
                                        </Typography>
                                    </div>

                                    <div className="flex items-center justify-center gap-2">
                                        <Typography variant="h5" className="text-blue-500 font-bold">
                                            {detailPrize.loaiGiai}
                                        </Typography>
                                    </div>

                                    <div className="text-center bg-white p-3 rounded">
                                        <Typography className="font-medium">
                                            Đạt bởi: {detailPrize.thanhVienDatGiai?.hoTen || 
                                                     members.find(m => 
                                                         m._id === (typeof detailPrize.thanhVienDatGiai === 'string' 
                                                             ? detailPrize.thanhVienDatGiai 
                                                             : detailPrize.thanhVienDatGiai?._id
                                                         )
                                                     )?.hoTen || 'Không xác định'}
                                        </Typography>
                                    </div>
                                </div>
                            </div>

                            {/* Cột phải - Thông tin chi tiết */}
                            <div className="flex-1 lg:flex-[1.5]">
                                <Typography variant="h6" color="blue" className="mb-4">
                                    Chi tiết giải thưởng
                                </Typography>

                                <div className="grid gap-4">
                                    <div className="bg-blue-gray-50 p-4 rounded flex justify-between items-center">
                                        <Typography className="text-gray-700 text-sm font-medium">
                                            Ngày đạt giải
                                        </Typography>
                                        <Typography className="font-medium">
                                            {new Date(detailPrize.ngayDatGiai).toLocaleDateString('vi-VN', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </Typography>
                                    </div>

                                    <div className="bg-blue-gray-50 p-4 rounded">
                                        <Typography className="text-gray-700 text-sm font-medium mb-2">
                                            Ghi chú
                                        </Typography>
                                        <Typography className="font-medium whitespace-pre-line">
                                            {detailPrize.ghiChu || "Không có ghi chú"}
                                        </Typography>
                                    </div>

                                    {detailPrize?.anhDatGiai && (
                                        <div className="bg-blue-gray-50 p-4 rounded">
                                            <Typography className="text-gray-700 text-sm font-medium mb-2">
                                                Ảnh đạt giải
                                            </Typography>
                                            <div className="relative group">
                                                <img
                                                    src={`${API_URL}/uploads/${detailPrize.anhDatGiai}`}
                                                    alt="Ảnh đạt giải"
                                                    className="w-full h-auto rounded-lg object-contain max-h-[300px]"
                                                    onError={(e) => {
                                                        console.error('Image load error:', e);
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="bg-orange-50 p-4 rounded border border-orange-200">
                                        <Typography variant="small" className="text-orange-800">
                                            <strong>Lưu ý:</strong> Thông tin giải thưởng này đã được xác nhận và lưu trữ trong hệ thống.
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                        </div>
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

export default ManagePrizes;
