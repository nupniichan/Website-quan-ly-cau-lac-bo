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
import { useEffect, useMemo, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { message, notification } from "antd";
import { useMaterialTailwindController } from "@/context/useMaterialTailwindController";

const API_URL = "http://4.242.20.80:5500/api";

// Thêm hàm validate chung
const validateClubData = async (clubData, editingClubId) => {
    // Kiểm tra các trường bắt buộc không được null hoặc rỗng
    const requiredFields = [
        { key: "ten", label: "Tên CLB" },
        { key: "linhVucHoatDong", label: "Lĩnh vực hoạt động" },
        { key: "ngayThanhLap", label: "Ngày thành lập" },
        { key: "giaoVienPhuTrach", label: "Giáo viên phụ trách" },
        { key: "truongBanCLB", label: "Trưởng ban CLB" },
        { key: "tinhTrang", label: "Tình trạng" },
    ];

    // Kiểm tra trường rỗng
    const emptyFields = requiredFields.filter(
        (field) => !clubData[field.key]?.trim(),
    );

    if (emptyFields.length > 0) {
        throw new Error(
            `Vui lòng điền đầy đủ thông tin: ${
                emptyFields.map((f) => f.label).join(", ")
            }`,
        );
    }

    // Kiểm tra ngày thành lập không được là ngày tương lai
    const ngayThanhLap = new Date(clubData.ngayThanhLap);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time để so sánh chỉ theo ngày

    if (ngayThanhLap > today) {
        throw new Error("Ngày thành lập không được là ngày tương lai");
    }

    try {
        // Kiểm tra tài khoản trưởng ban có tồn tại
        const accountResponse = await axios.get(`${API_URL}/get-accounts`);
        const accountExists = accountResponse.data.some(
            account => account.userId === clubData.truongBanCLB && account.role === 'student'
        );
        
        if (!accountExists) {
            throw new Error("Tài khoản trưởng ban CLB không tồn tại hoặc không phải là học sinh");
        }

        // Kiểm tra xem account đã quản lý câu lạc bộ nào chưa
        const clubResponse = await axios.get(`${API_URL}/get-clubs`);
        const existingClub = clubResponse.data.find(
            club => club.truongBanCLB === clubData.truongBanCLB && club.clubId !== editingClubId
        );
        
        if (existingClub) {
            throw new Error(`Tài khoản này đã là trưởng ban của câu lạc bộ "${existingClub.ten}"`);
        }
    } catch (error) {
        if (error.message) throw error;
        throw new Error("Lỗi khi kiểm tra thông tin trưởng ban CLB");
    }
};

// Thêm hàm helper để format ngày
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

const ManageClubs = () => {
    const [clubs, setClubs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [newClub, setNewClub] = useState({
        ten: "",
        linhVucHoatDong: "",
        ngayThanhLap: "",
        giaoVienPhuTrach: "",
        truongBanCLB: "",
        mieuTa: "",
        quyDinh: "",
        logo: null,
        tinhTrang: "Còn hoạt động",
    });
    const [detailClub, setDetailClub] = useState(null);
    const [editingClubId, setEditingClubId] = useState(null);
    const [currentLogo, setCurrentLogo] = useState(null);
    const [previewLogo, setPreviewLogo] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState({
        startDate: "",
        endDate: "",
    });
    const [fieldFilter, setFieldFilter] = useState("");
    const [showStudentDropdown, setShowStudentDropdown] = useState(false);
    const [studentAccounts, setStudentAccounts] = useState([]);
    const [studentSearch, setStudentSearch] = useState("");
    const dropdownRef = useRef(null);

    // Lấy controller từ context & màu hiện tại của sidenav
    const [controller] = useMaterialTailwindController();
    const { sidenavColor } = controller;

    useEffect(() => {
        fetchClubs();
    }, []);

    // Fetch student accounts khi component mount
    useEffect(() => {
        const fetchStudentAccounts = async () => {
            try {
                const response = await axios.get(`${API_URL}/get-accounts`);
                const students = response.data
                    .filter((account) => account.role === "student")
                    .slice(0, 10);
                setStudentAccounts(students);
            } catch (error) {
                console.error("Error fetching student accounts:", error);
            }
        };
        fetchStudentAccounts();
    }, []);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowStudentDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Thêm hàm lọc students
    const getFilteredStudents = (searchValue) => {
        // Lọc ra các account đã là trưởng ban của các CLB khác
        const existingLeaders = clubs
            .filter(club => club.clubId !== editingClubId) // Bỏ qua CLB đang edit
            .map(club => club.truongBanCLB);

        return studentAccounts
            .filter(student => 
                // Lọc theo tên và mã số
                (student.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                student.userId.toLowerCase().includes(searchValue.toLowerCase())) &&
                // Loại bỏ các account đã là trưởng ban
                !existingLeaders.includes(student.userId)
            );
    };

    const fetchClubs = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_URL}/get-clubs`);
            setClubs(response.data);
        } catch (error) {
            console.error("Error fetching clubs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddClub = async () => {
        try {
            await validateClubData(newClub, null);

            const formData = new FormData();
            Object.keys(newClub).forEach((key) => {
                if (key === "logo") {
                    if (newClub.logo) {
                        formData.append("logo", newClub.logo);
                    }
                } else {
                    formData.append(key, newClub[key]);
                }
            });

            const response = await axios.post(`${API_URL}/add-club`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setIsDialogOpen(false);
            fetchClubs();
        } catch (error) {
            // Xử lý lỗi validation
            if (error.message) {
                // alert(error.message);
                message.error({ content: error.message });
                return;
            }
            // Xử lý lỗi API
            console.error("Error adding club:", error);
            if (error.response) {
                // alert(
                //     `Lỗi khi thêm câu lạc bộ: ${
                //         error.response.data.message || "Không xác định"
                //     }`
                // );
                notification.error({
                    message: "Lỗi khi thêm câu lạc bộ",
                    description: error.response.data.message ||
                        "Không xác định",
                });
            } else {
                // alert("Không thể kết nối đến server. Vui lòng thử lại sau.");
                message.error({
                    content:
                        "Không thể kết nối đến server. Vui lòng thử lại sau.",
                });
            }
        }
    };

    const handleUpdateClub = async () => {
        try {
            await validateClubData(newClub, editingClubId);

            const formData = new FormData();
            Object.keys(newClub).forEach((key) => {
                if (key === "logo") {
                    if (newClub.logo && newClub.logo instanceof File) {
                        formData.append("logo", newClub.logo);
                    }
                } else {
                    formData.append(key, newClub[key]);
                }
            });

            const response = await axios.put(
                `${API_URL}/update-club/${editingClubId}`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                },
            );
            setIsDialogOpen(false);
            setEditingClubId(null);
            fetchClubs();
        } catch (error) {
            // Xử lý lỗi validation
            if (error.message) {
                // alert(error.message);
                message.error({ content: error.message });
                return;
            }
            // Xử lý lỗi API
            console.error("Error updating club:", error);
            if (error.response) {
                // alert(
                //     `Lỗi khi cập nhật câu lạc bộ: ${
                //         error.response.data.message || "Không xác định"
                //     }`
                // );
                notification.error({
                    message: "Lỗi khi cập nhật câu lạc bộ",
                    description: error.response.data.message ||
                        "Không xác định",
                });
            } else {
                // alert("Không thể kết nối đến server. Vui lòng thử lại sau.");
                message.error({
                    content:
                        "Không thể kết nối đến server. Vui lòng thử lại sau.",
                });
            }
        }
    };

    const handleDeleteClub = async (clubId) => {
        // Tìm club cần xóa
        const clubToDelete = clubs.find((club) => club.clubId === clubId);

        // Kiểm tra tình trạng
        if (clubToDelete.tinhTrang === "Còn hoạt động") {
            // alert("Không thể xóa câu lạc bộ đang hoạt động!");
            message.warning({
                content: "Không thể xóa câu lạc bộ đang hoạt động!",
            });
            return;
        }

        if (window.confirm("Bạn có chắc chắn muốn xóa câu lạc bộ này?")) {
            try {
                const response = await axios.delete(
                    `${API_URL}/delete-club/${clubId}`,
                );
                fetchClubs();
            } catch (error) {
                console.error("Error deleting club:", error);
                if (error.response) {
                    // alert(
                    //     `Lỗi khi xóa câu lạc bộ: ${error.response.data.message}`,
                    // );
                    notification.error({
                        message: "Lỗi khi xóa câu lạc bộ",
                        description: error.response.data.message,
                    });
                } else {
                    // alert(
                    //     "Không thể kết nối đến server. Vui lòng thử lại sau.",
                    // );
                    message.error({
                        content:
                            "Không thể kết nối đến server. Vui lòng thử lại sau.",
                    });
                }
            }
        }
    };

    const openAddDialog = () => {
        setNewClub({
            ten: "",
            linhVucHoatDong: "",
            ngayThanhLap: "",
            giaoVienPhuTrach: "",
            truongBanCLB: "",
            mieuTa: "",
            quyDinh: "",
            logo: null,
            tinhTrang: "Còn hoạt động",
        });
        setEditingClubId(null);
        setIsDialogOpen(true);
        setPreviewLogo(null);
    };

    const openEditDialog = async (clubId) => {
        const clubToEdit = clubs.find((club) => club.clubId === clubId);
        try {
            const response = await axios.get(`${API_URL}/get-club/${clubId}`);
            const date = new Date(response.data.ngayThanhLap);
            const formattedDate = date.toISOString().split("T")[0]; // Format YYYY-MM-DD cho input

            setNewClub({
                ...response.data,
                ngayThanhLap: formattedDate,
            });
            if (clubToEdit) {
                setCurrentLogo(
                    clubToEdit.logo ? `${API_URL}/${clubToEdit.logo}` : null,
                );
            }
            setEditingClubId(clubId);
            setIsDialogOpen(true);
            setPreviewLogo(null);
        } catch (error) {
            console.error("Error fetching club details:", error);
            if (error.response) {
                // alert(
                //     `Lỗi khi lấy thông tin câu lạc bộ: ${
                //         error.response.data.message || "Không xác định"
                //     }`,
                // );
                notification.error({
                    message: "Lỗi khi lấy thông tin câu lạc bộ",
                    description: error.response.data.message ||
                        "Không xác định",
                });
            } else {
                // alert("Không thể kết nối đến server. Vui lòng thử lại sau.");
                message.error({
                    content:
                        "Không thể kết nối đến server. Vui lòng thử lại sau.",
                })
            }
        }
    };

    const openDetailDialog = async (clubId) => {
        try {
            const response = await axios.get(`${API_URL}/get-club/${clubId}`);
            setDetailClub(response.data);
            setIsDetailDialogOpen(true);
        } catch (error) {
            console.error("Error fetching club details:", error);
            // alert(
            //     `Lỗi khi lấy thông tin câu lạc bộ: ${
            //         error.response?.data?.message || "Không xác định"
            //     }`,
            // );
            notification.error({
                message: "Lỗi khi lấy thông tin câu lạc bộ",
                description: error.response?.data?.message || "Không xác định",
            });
        }
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        setNewClub({ ...newClub, logo: file });

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewLogo(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewLogo(null);
        }
    };

    // Tạo danh sách lĩnh vực hoạt động duy nhất từ clubs
    const uniqueFields = useMemo(() => {
        const fields = clubs.map((club) => club.linhVucHoatDong);
        return [...new Set(fields)].filter((field) => field); // Lọc bỏ giá trị null/undefined/empty
    }, [clubs]);

    // Cập nhật hàm lọc clubs
    const filteredClubs = useMemo(() => {
        return clubs.filter((club) => {
            // Lọc theo tên CLB hoặc lĩnh vực hoạt động hoặc giáo viên phụ trách hoặc trưởng ban CLB
            const matchesSearch =
                club.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
                club.linhVucHoatDong.toLowerCase().includes(
                    searchTerm.toLowerCase(),
                ) ||
                club.giaoVienPhuTrach.toLowerCase().includes(
                    searchTerm.toLowerCase(),
                ) ||
                club.truongBanCLB.toLowerCase().includes(
                    searchTerm.toLowerCase(),
                );

            // Lọc theo khoảng thời gian thành lập
            const clubDate = new Date(club.ngayThanhLap);
            const matchesDateRange =
                (!dateFilter.startDate ||
                    new Date(dateFilter.startDate) <= clubDate) &&
                (!dateFilter.endDate ||
                    new Date(dateFilter.endDate) >= clubDate);

            // Lọc theo lĩnh vực hoạt động
            const matchesField = !fieldFilter ||
                club.linhVucHoatDong === fieldFilter;

            return matchesSearch && matchesDateRange && matchesField;
        });
    }, [clubs, searchTerm, dateFilter, fieldFilter]);

    // Reset trang khi thay đổi bộ lọc
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, dateFilter, fieldFilter]);

    // Cập nhật phân trang
    const currentClubs = filteredClubs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );
    const totalPages = Math.ceil(filteredClubs.length / itemsPerPage);

    return (
        <div className="flex flex-col gap-12 mt-12 mb-8">
            <Card>
                <CardHeader
                    variant="gradient"
                    color={sidenavColor}
                    className="p-6 mb-8"
                >
                    <Typography variant="h6" color="white">
                        Quản lý câu lạc bộ
                    </Typography>
                </CardHeader>
                <CardBody className="px-0 pt-0 pb-2">
                    <div className="flex flex-wrap items-center justify-between gap-4 p-4 px-6">
                        {/* Cột trái - Tìm kiếm và bộ lọc */}
                        <div className="flex flex-wrap items-center gap-4">
                            {/* Thanh tìm kiếm */}
                            <div className="w-96">
                                <Input
                                    label="Tìm kiếm theo tên CLB, lĩnh vực, giáo viên, trưởng ban"
                                    icon={<i className="fas fa-search" />}
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Bộ lọc lĩnh vực hoạt động */}
                            <div className="w-72">
                                <Select
                                    label="Lọc theo lĩnh vực"
                                    value={fieldFilter}
                                    onChange={(value) => setFieldFilter(value)}
                                >
                                    <Option value="">Tất cả lĩnh vực</Option>
                                    {uniqueFields.map((field) => (
                                        <Option key={field} value={field}>
                                            {field}
                                        </Option>
                                    ))}
                                </Select>
                            </div>

                            {/* Bộ lọc ngày thành lập */}
                            <div className="flex items-center gap-2">
                                <div>
                                    <Input
                                        type="date"
                                        label="Từ ngày"
                                        value={dateFilter.startDate}
                                        onChange={(e) =>
                                            setDateFilter((prev) => ({
                                                ...prev,
                                                startDate: e.target.value,
                                            }))}
                                    />
                                </div>
                                <div>
                                    <Input
                                        type="date"
                                        label="Đến ngày"
                                        value={dateFilter.endDate}
                                        onChange={(e) =>
                                            setDateFilter((prev) => ({
                                                ...prev,
                                                endDate: e.target.value,
                                            }))}
                                    />
                                </div>

                                {/* Nút reset bộ lọc - cập nhật để xóa cả fieldFilter */}
                                {(dateFilter.startDate || dateFilter.endDate ||
                                    searchTerm || fieldFilter) && (
                                    <Button
                                        variant="text"
                                        color="red"
                                        className="p-2"
                                        onClick={() => {
                                            setDateFilter({
                                                startDate: "",
                                                endDate: "",
                                            });
                                            setSearchTerm("");
                                            setFieldFilter("");
                                        }}
                                    >
                                        <XMarkIcon className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Cột phải - Nút thêm */}
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
                                    color={sidenavColor}
                                    size="sm"
                                    onClick={openAddDialog}
                                >
                                    <FaPlus
                                        className="w-4 h-4"
                                        strokeWidth={"2rem"}
                                    />
                                </Button>
                            </Tooltip>
                        </div>
                    </div>

                    {/* Hiển thị kết quả tìm kiếm và lọc */}
                    {(searchTerm || dateFilter.startDate ||
                        dateFilter.endDate || fieldFilter) && (
                        <div className="px-6 mb-4">
                            <Typography variant="small" color="blue-gray">
                                Tìm thấy {filteredClubs.length} kết quả
                                {searchTerm && ` cho "${searchTerm}"`}
                                {fieldFilter &&
                                    ` trong lĩnh vực "${fieldFilter}"`}
                                {dateFilter.startDate &&
                                    ` từ ${formatDate(dateFilter.startDate)}`}
                                {dateFilter.endDate &&
                                    ` đến ${formatDate(dateFilter.endDate)}`}
                            </Typography>
                        </div>
                    )}

                    <div className="overflow-auto lg:max-h-[56vh] md:max-h-[75vh] sm:max-h-[85vh]">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-64">
                                <Spinner className="w-12 h-12" color="pink" />
                            </div>
                        ) : filteredClubs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 gap-4">
                                <Typography variant="h6" color="blue-gray">
                                    {searchTerm || dateFilter.startDate || dateFilter.endDate || fieldFilter
                                        ? "Không tìm thấy câu lạc bộ nào phù hợp với điều kiện tìm kiếm"
                                        : "Chưa có câu lạc bộ nào trong hệ thống"}
                                </Typography>
                                <Button
                                    className="flex items-center gap-3"
                                    color={sidenavColor}
                                    onClick={openAddDialog}
                                >
                                    <FaPlus className="w-4 h-4" /> Thêm câu lạc bộ mới
                                </Button>
                            </div>
                        ) : (
                            <>
                                <table className="w-full min-w-[640px] table-auto">
                                    <thead>
                                        <tr>
                                            {[
                                                "STT",
                                                "Logo",
                                                "Tên CLB",
                                                "Lĩnh vực hoạt động",
                                                "Ngày thành lập",
                                                "Giáo viên phụ trách",
                                                "Trưởng ban CLB",
                                                "Tình trạng",
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
                                        {currentClubs.map(
                                            ({ clubId, ten, linhVucHoatDong, ngayThanhLap, giaoVienPhuTrach, truongBanCLB, logo, tinhTrang }, key) => {
                                                const className = `py-3 px-5 ${
                                                    key === currentClubs.length - 1
                                                        ? ""
                                                        : "border-b border-blue-gray-50"
                                                }`;

                                                    return (
                                                        <tr key={clubId}>
                                                            <td
                                                                className={className}
                                                            >
                                                                <Typography className="text-xs font-semibold text-blue-gray-600">
                                                                    {(currentPage -
                                                                                1) *
                                                                            itemsPerPage +
                                                                        key + 1}
                                                                </Typography>
                                                            </td>
                                                            <td
                                                                className={className}
                                                            >
                                                                <img
                                                                    src={logo
                                                                        ? `${API_URL}/${logo}`
                                                                        : "/img/default-club-logo.png"}
                                                                    alt={ten}
                                                                    className="object-cover w-10 h-10 rounded-full"
                                                                    onError={(
                                                                        e,
                                                                    ) => {
                                                                        e.target
                                                                            .onerror =
                                                                                null;
                                                                        e.target
                                                                            .src =
                                                                                "/img/default-club-logo.png";
                                                                    }}
                                                                />
                                                            </td>
                                                            <td
                                                                className={className}
                                                            >
                                                                <Typography className="text-xs font-semibold text-blue-gray-600">
                                                                    {ten}
                                                                </Typography>
                                                            </td>
                                                            <td
                                                                className={className}
                                                            >
                                                                <Typography className="text-xs font-semibold text-blue-gray-600">
                                                                    {linhVucHoatDong}
                                                                </Typography>
                                                            </td>
                                                            <td
                                                                className={className}
                                                            >
                                                                <Typography className="text-xs font-semibold text-blue-gray-600">
                                                                    {formatDate(
                                                                        ngayThanhLap,
                                                                    )}
                                                                </Typography>
                                                            </td>
                                                            <td
                                                                className={className}
                                                            >
                                                                <Typography className="text-xs font-semibold text-blue-gray-600">
                                                                    {giaoVienPhuTrach}
                                                                </Typography>
                                                            </td>
                                                            <td
                                                                className={className}
                                                            >
                                                                <Typography className="text-xs font-semibold text-blue-gray-600">
                                                                    {studentAccounts
                                                                        .find(
                                                                            (s) =>
                                                                                s.userId ===
                                                                                    truongBanCLB
                                                                        )?.name ||
                                                                        truongBanCLB}
                                                                </Typography>
                                                            </td>
                                                            <td
                                                                className={className}
                                                            >
                                                                <Typography
                                                                    className={`text-xs font-semibold ${
                                                                        tinhTrang ===
                                                                                "Còn hoạt động"
                                                                            ? "text-green-600"
                                                                            : "text-red-600"
                                                                    }`}
                                                                >
                                                                    {tinhTrang ||
                                                                        "Còn hoạt động"}
                                                                </Typography>
                                                            </td>
                                                            <td
                                                                className={className}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <Tooltip
                                                                        content="Xem"
                                                                        animate={{
                                                                            mount:
                                                                                {
                                                                                    scale:
                                                                                        1,
                                                                                    y: 0,
                                                                                },
                                                                            unmount:
                                                                                {
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
                                                                                    clubId,
                                                                                )}
                                                                        >
                                                                            <EyeIcon
                                                                                strokeWidth={2}
                                                                                className="w-4 h-4"
                                                                            />
                                                                            {" "}
                                                                        </Button>
                                                                    </Tooltip>
                                                                    <Tooltip
                                                                        content="Sửa"
                                                                        animate={{
                                                                            mount:
                                                                                {
                                                                                    scale:
                                                                                        1,
                                                                                    y: 0,
                                                                                },
                                                                            unmount:
                                                                                {
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
                                                                                    clubId,
                                                                                )}
                                                                        >
                                                                            <PencilIcon
                                                                                strokeWidth={2}
                                                                                className="w-4 h-4"
                                                                            />
                                                                            {" "}
                                                                        </Button>
                                                                    </Tooltip>
                                                                    <Tooltip
                                                                        content="Xoá"
                                                                        animate={{
                                                                            mount:
                                                                                {
                                                                                    scale:
                                                                                        1,
                                                                                    y: 0,
                                                                                },
                                                                            unmount:
                                                                                {
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
                                                                                handleDeleteClub(
                                                                                    clubId,
                                                                                )}
                                                                        >
                                                                            <TrashIcon
                                                                                strokeWidth={2}
                                                                                className="w-4 h-4"
                                                                            />
                                                                            {" "}
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

                                    {/* Thêm phân trang */}
                                    <div className="flex items-center gap-4 justify-center mt-6 mb-4">
                                        <Button
                                            variant="text"
                                            className="flex items-center gap-2"
                                            onClick={() =>
                                                setCurrentPage((prev) =>
                                                    prev - 1
                                                )}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeftIcon
                                                strokeWidth={2}
                                                className="h-4 w-4"
                                            />{" "}
                                            Trước
                                        </Button>

                                        <div className="flex items-center gap-2">
                                            {totalPages <= 5
                                                ? (
                                                    [...Array(totalPages)].map((
                                                        _,
                                                        index,
                                                    ) => (
                                                        <Button
                                                            key={index + 1}
                                                            variant={currentPage ===
                                                                    index + 1
                                                                ? "gradient"
                                                                : "text"}
                                                            color={sidenavColor}
                                                            onClick={() =>
                                                                setCurrentPage(
                                                                    index + 1,
                                                                )}
                                                            className="w-10 h-10"
                                                        >
                                                            {index + 1}
                                                        </Button>
                                                    ))
                                                )
                                                : (
                                                    <>
                                                        <Button
                                                            variant={currentPage ===
                                                                    1
                                                                ? "gradient"
                                                                : "text"}
                                                            color={sidenavColor}
                                                            onClick={() =>
                                                                setCurrentPage(
                                                                    1,
                                                                )}
                                                            className="w-10 h-10"
                                                        >
                                                            1
                                                        </Button>

                                                        {currentPage > 3 && (
                                                            <span className="mx-2">
                                                                ...
                                                            </span>
                                                        )}

                                                        {[...Array(3)].map(
                                                            (_, index) => {
                                                                const pageNumber =
                                                                    Math.min(
                                                                        Math.max(
                                                                            currentPage -
                                                                                1 +
                                                                                index,
                                                                            2,
                                                                        ),
                                                                        totalPages -
                                                                            1,
                                                                    );
                                                                if (
                                                                    pageNumber <=
                                                                        1 ||
                                                                    pageNumber >=
                                                                        totalPages
                                                                ) return null;
                                                                return (
                                                                    <Button
                                                                        key={pageNumber}
                                                                        variant={currentPage ===
                                                                                pageNumber
                                                                            ? "gradient"
                                                                            : "text"}
                                                                        color={sidenavColor}
                                                                        onClick={() =>
                                                                            setCurrentPage(
                                                                                pageNumber,
                                                                            )}
                                                                        className="w-10 h-10"
                                                                    >
                                                                        {pageNumber}
                                                                    </Button>
                                                                );
                                                            },
                                                        )}

                                                        {currentPage <
                                                                totalPages -
                                                                    2 && (
                                                            <span className="mx-2">
                                                                ...
                                                            </span>
                                                        )}

                                                        <Button
                                                            variant={currentPage ===
                                                                    totalPages
                                                                ? "gradient"
                                                                : "text"}
                                                            color={sidenavColor}
                                                            onClick={() =>
                                                                setCurrentPage(
                                                                    totalPages,
                                                                )}
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
                                            onClick={() =>
                                                setCurrentPage((prev) =>
                                                    prev + 1
                                                )}
                                            disabled={currentPage ===
                                                totalPages}
                                        >
                                            Sau{" "}
                                            <ChevronRightIcon
                                                strokeWidth={2}
                                                className="h-4 w-4"
                                            />
                                        </Button>
                                    </div>
                                </>
                            )}
                    </div>
                </CardBody>
            </Card>

            {/* Dialog thêm/sửa câu lạc bộ */}
            <Dialog
                open={isDialogOpen}
                handler={() => setIsDialogOpen(false)}
                size="lg"
            >
                <DialogHeader className="lg:text-2xl md:text-xl sm:text-base">
                    {editingClubId
                        ? "Chỉnh sửa Câu Lạc Bộ"
                        : "Thêm Câu Lạc Bộ Mới"}
                </DialogHeader>
                <DialogBody
                    divider
                    className="grid grid-cols-2 gap-4 overflow-y-auto lg:max-h-[60vh] sm:max-h-[45vh]"
                >
                    <Input
                        label="Tên CLB"
                        value={newClub.ten}
                        onChange={(e) =>
                            setNewClub({ ...newClub, ten: e.target.value })}
                    />
                    <Input
                        label="Lĩnh vực hoạt động"
                        value={newClub.linhVucHoatDong}
                        onChange={(e) => setNewClub({
                            ...newClub,
                            linhVucHoatDong: e.target.value,
                        })}
                    />
                    <Input
                        type="date"
                        label="Ngày thành lập"
                        value={newClub.ngayThanhLap}
                        onChange={(e) => setNewClub({
                            ...newClub,
                            ngayThanhLap: e.target.value,
                        })}
                    />
                    <Input
                        label="Giáo viên phụ trách"
                        value={newClub.giaoVienPhuTrach}
                        onChange={(e) => setNewClub({
                            ...newClub,
                            giaoVienPhuTrach: e.target.value,
                        })}
                    />
                    <div className="relative" ref={dropdownRef}>
                        <Input
                            label="Trưởng ban CLB"
                            value={studentAccounts.find((s) =>
                                s.userId === newClub.truongBanCLB
                            )?.name || newClub.truongBanCLB}
                            onFocus={() => setShowStudentDropdown(true)}
                            onChange={(e) => {
                                setNewClub({
                                    ...newClub,
                                    truongBanCLB: e.target.value,
                                });
                                setStudentSearch(e.target.value);
                            }}
                        />
                        {showStudentDropdown && (
                            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                {getFilteredStudents(studentSearch).map((
                                    student,
                                ) => (
                                    <div
                                        key={student.userId}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            setNewClub({
                                                ...newClub,
                                                truongBanCLB: student.userId,
                                            });
                                            setShowStudentDropdown(false);
                                            setStudentSearch("");
                                        }}
                                    >
                                        <Typography className="text-sm">
                                            {student.name} ({student.userId})
                                        </Typography>
                                    </div>
                                ))}
                                {getFilteredStudents(studentSearch).length ===
                                        0 && (
                                    <div className="px-4 py-2 text-gray-500">
                                        Không tìm thấy kết quả
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <Select
                        label="Tình trạng"
                        value={newClub.tinhTrang}
                        onChange={(value) =>
                            setNewClub({ ...newClub, tinhTrang: value })}
                    >
                        <Option value="Còn hoạt động">Còn hoạt động</Option>
                        <Option value="Ngừng hoạt động">Ngừng hoạt động</Option>
                    </Select>
                    <Textarea
                        label="Miêu tả"
                        value={newClub.mieuTa}
                        onChange={(e) =>
                            setNewClub({ ...newClub, mieuTa: e.target.value })}
                        className="col-span-2"
                    />
                    <Textarea
                        label="Quy định"
                        value={newClub.quyDinh}
                        onChange={(e) =>
                            setNewClub({ ...newClub, quyDinh: e.target.value })}
                        className="col-span-2"
                    />
                    {/* Phần tải logo */}
                    <div className="col-span-2">
                        <div className="flex flex-col gap-4">
                            <Button
                                variant="gradient"
                                className="flex items-center gap-3 w-[10.6rem] h-[3rem]"
                                color={sidenavColor}
                            >
                                <CloudArrowUpIcon className="w-5 h-5 stroke-2" />
                                Tải logo lên
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </Button>
                            <div className="grid grid-cols-2 gap-4">
                                {editingClubId && currentLogo && (
                                    <div className="flex flex-col gap-2">
                                        <p className="font-semibold">
                                            Ảnh hiện tại:
                                        </p>
                                        <div className="w-32 h-32 relative">
                                            <img
                                                src={currentLogo}
                                                alt="Ảnh clb hiện tại"
                                                className="absolute w-full h-full object-cover rounded-lg shadow-md"
                                            />
                                        </div>
                                    </div>
                                )}
                                {previewLogo && (
                                    <div className="flex flex-col gap-2">
                                        <p className="font-semibold">
                                            Ảnh mới:
                                        </p>
                                        <div className="w-32 h-32 relative">
                                            <img
                                                src={previewLogo}
                                                alt="Ảnh clb mới"
                                                className="absolute w-full h-full object-cover rounded-lg shadow-md"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
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
                        onClick={editingClubId
                            ? handleUpdateClub
                            : handleAddClub}
                    >
                        {editingClubId ? "Cập nhật" : "Thêm"}
                    </Button>
                </DialogFooter>
            </Dialog>

            {/* Dialog xem chi tiết câu lạc bộ */}
            <Dialog
                open={isDetailDialogOpen}
                handler={() => setIsDetailDialogOpen(false)}
                size="lg"
                className="min-w-[80%]"
            >
                <DialogHeader className="text-2xl font-bold">
                    Chi tiết Câu Lạc Bộ
                </DialogHeader>
                {detailClub && (
                    <DialogBody divider className="h-[70vh] overflow-y-auto">
                        <div className="grid gap-6">
                            {/* Logo và thông tin cơ bản */}
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="flex justify-center items-center">
                                    <img
                                        src={detailClub.logo
                                            ? `${API_URL}/${detailClub.logo}`
                                            : "/img/default-club-logo.png"}
                                        alt={detailClub.ten}
                                        className="w-48 h-48 object-cover rounded-lg shadow-lg"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src =
                                                "/img/default-club-logo.png";
                                        }}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr>
                                                <th
                                                    colSpan="2"
                                                    className="bg-brown-50 p-3 text-left text-lg font-bold text-brown-900"
                                                >
                                                    Thông tin cơ bản
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <th className="border p-3 bg-gray-50 w-1/3">
                                                    Tên CLB
                                                </th>
                                                <td className="border p-3">
                                                    {detailClub.ten}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="border p-3 bg-gray-50">
                                                    Lĩnh vực hoạt động
                                                </th>
                                                <td className="border p-3">
                                                    {detailClub.linhVucHoatDong}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="border p-3 bg-gray-50">
                                                    Ngày thành lập
                                                </th>
                                                <td className="border p-3">
                                                    {formatDate(
                                                        detailClub.ngayThanhLap,
                                                    )}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="border p-3 bg-gray-50">
                                                    Giáo viên phụ trách
                                                </th>
                                                <td className="border p-3">
                                                    {detailClub
                                                        .giaoVienPhuTrach}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="border p-3 bg-gray-50">
                                                    Trưởng ban CLB
                                                </th>
                                                <td className="border p-3">
                                                    {detailClub.truongBanCLB}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="border p-3 bg-gray-50">
                                                    Tình trạng
                                                </th>
                                                <td className="border p-3">
                                                    <span
                                                        className={`font-semibold ${
                                                            detailClub
                                                                    .tinhTrang ===
                                                                    "Còn hoạt động"
                                                                ? "text-green-600"
                                                                : "text-red-600"
                                                        }`}
                                                    >
                                                        {detailClub.tinhTrang ||
                                                            "Còn hoạt động"}
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Miêu tả */}
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="bg-brown-50 p-3 text-left text-lg font-bold text-brown-900">
                                            Miêu tả
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border p-3 whitespace-pre-line">
                                            {detailClub.mieuTa ||
                                                "Chưa có miêu tả"}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Quy định */}
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="bg-brown-50 p-3 text-left text-lg font-bold text-brown-900">
                                            Quy định
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border p-3 whitespace-pre-line">
                                            {detailClub.quyDinh ||
                                                "Chưa có quy định"}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </DialogBody>
                )}
                <DialogFooter>
                    <Button
                        variant="gradient"
                        color={sidenavColor}
                        onClick={() => setIsDetailDialogOpen(false)}
                    >
                        Đóng
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default ManageClubs;
