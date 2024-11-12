import {
    EyeIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
    XCircleIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "@heroicons/react/24/solid";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader,
    IconButton,
    Input,
    Spinner,
    Textarea,
    Tooltip,
    Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";

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
        thoiGianBatDau: "00:00",
        thoiGianKetThuc: "00:00",
        diaDiem: "",
        noiDung: "",
        nganSachChiTieu: 0,
        nguoiPhuTrach: "",
        khachMoi: [],
        club: "",
    });
    const [detailEvent, setDetailEvent] = useState(null);
    const [editingEventId, setEditingEventId] = useState(null);
    const [managedClub, setManagedClub] = useState(null);
    const [guestInput, setGuestInput] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [errors, setErrors] = useState({});
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const managedClubsString = localStorage.getItem("managedClubs");
        if (managedClubsString) {
            try {
                const managedClubs = JSON.parse(managedClubsString);
                if (managedClubs && managedClubs.length > 0) {
                    setManagedClub(managedClubs[0]);
                    fetchEvents(managedClubs[0]._id);
                } else {
                    throw new Error("No managed clubs found");
                }
            } catch (error) {
                console.error("Error parsing managed clubs data:", error);
                alert(
                    "Không thể tải thông tin câu lạc bộ. Vui lng đăng nhập lại.",
                );
            }
        } else {
            console.error("No managed clubs data found");
            alert(
                "Không tìm thấy thông tin câu lạc bộ. Vui lòng đăng nhập lại.",
            );
        }
        setIsLoading(false);
        fetchClubs();
    }, []);

    const fetchClubs = async () => {
        try {
            const response = await axios.get(`${API_URL}/get-clubs`);
            setClubs(response.data);
        } catch (error) {
            console.error("Error fetching clubs:", error);
        }
    };

    const fetchEvents = async (clubId) => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `${API_URL}/get-events-by-club/${clubId}`,
            );
            setEvents(response.data);
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddEvent = async () => {
        console.log("Handling add event...");
        
        if (!validateForm()) {
            console.log("Form validation failed");
            return;
        }

        try {
            if (!managedClub) {
                throw new Error("Managed club information is not available");
            }

            const eventData = {
                ...newEvent,
                club: managedClub._id,
            };
            
            console.log("Submitting event data:", eventData);
            
            await axios.post(`${API_URL}/add-event`, eventData);
            setIsDialogOpen(false);
            fetchEvents(managedClub._id);
        } catch (error) {
            console.error("Error adding event:", error);
            alert(`Lỗi khi thêm sự kiện: ${error.message || "Không xác định"}`);
        }
    };

    const handleUpdateEvent = async () => {
        console.log("Handling update event...");
        
        if (!validateForm()) {
            console.log("Form validation failed");
            return;
        }

        try {
            await axios.put(
                `${API_URL}/update-event/${editingEventId}`,
                newEvent
            );
            setIsDialogOpen(false);
            setEditingEventId(null);
            fetchEvents(managedClub._id);
        } catch (error) {
            console.error("Error updating event:", error);
            alert(
                `Lỗi khi cập nhật sự kiện: ${
                    error.response?.data?.message || "Không xác định"
                }`
            );
        }
    };

    const handleDeleteEvent = async (eventId, trangThai) => {
        // Kiểm tra trạng thái
        if (trangThai === "Đã duyệt") {
            alert("Không thể xóa sự kiện đã được duyệt!");
            return;
        }

        if (window.confirm("Bạn có chắc chắn muốn xóa sự kiện này?")) {
            try {
                // Kiểm tra xem sự kiện có trong báo cáo nào không
                const checkResponse = await axios.get(`${API_URL}/check-event-in-reports/${eventId}`);
                
                if (checkResponse.data.exists) {
                    alert("Không thể xóa sự kiện này vì nó đã được sử dụng trong báo cáo!");
                    return;
                }

                const response = await axios.delete(
                    `${API_URL}/delete-event/${eventId}`,
                );
                fetchEvents(managedClub._id);
            } catch (error) {
                console.error("Error deleting event:", error);
                alert(
                    `Lỗi khi xóa sự kiện: ${
                        error.response?.data?.message || "Không xác định"
                    }`,
                );
            }
        }
    };

    const openEditDialog = async (id) => {
        try {
            setErrors({});
            const response = await axios.get(`${API_URL}/get-event/${id}`);
            setNewEvent({
                ...response.data,
                ngayToChuc: response.data.ngayToChuc.split('T')[0],
            });
            setEditingEventId(id);
            setIsDialogOpen(true);
        } catch (error) {
            console.error("Error fetching event details:", error);
            alert(
                `Lỗi khi lấy thông tin sự kiện: ${
                    error.response?.data?.message || "Không xác định"
                }`
            );
        }
    };

    const openDetailDialog = (id) => {
        const eventDetail = events.find((event) => event._id === id);
        if (eventDetail) {
            setDetailEvent(eventDetail);
            setIsDetailDialogOpen(true);
        }
    };

    const handleAddGuest = () => {
        if (guestInput.trim() !== "") {
            setNewEvent((prev) => ({
                ...prev,
                khachMoi: [...prev.khachMoi, guestInput.trim()],
            }));
            setGuestInput("");
        }
    };

    const handleRemoveGuest = (index) => {
        setNewEvent((prev) => ({
            ...prev,
            khachMoi: prev.khachMoi.filter((_, i) => i !== index),
        }));
    };

    const handleEditGuest = (index, newName) => {
        setNewEvent((prev) => ({
            ...prev,
            khachMoi: prev.khachMoi.map((guest, i) =>
                i === index ? newName : guest
            ),
        }));
    };

    const fetchEventDetails = async (id) => {
        try {
            const response = await axios.get(`${API_URL}/get-event/${id}`);
            setDetailEvent(response.data);
            setIsDetailDialogOpen(true);
        } catch (error) {
            console.error("Error fetching event details:", error);
            alert(
                `Lỗi khi lấy thông tin sự kiện: ${
                    error.response?.data?.message || "Không xác định"
                }`,
            );
        }
    };

    const filteredEvents = useMemo(() => {
        let filtered = events;
        
        // Lọc theo trạng thái
        if (statusFilter !== "all") {
            filtered = filtered.filter((event) => event.trangThai === statusFilter);
        }
        
        // Lọc theo tên sự kiện
        if (searchTerm.trim()) {
            filtered = filtered.filter((event) =>
                event.ten.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        return filtered;
    }, [events, statusFilter, searchTerm]);

    // Tính toán events cho trang hiện tại
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEvents = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

    // Thêm hàm để xử lý chuyển trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Reset trang về 1 khi thay đổi bộ lọc
    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter]);

    // Reset trang về 1 khi thay đổi tìm kiếm
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const validateForm = () => {
        const newErrors = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        console.log("Validating form data:", newEvent);

        // Validate tên sự kiện
        if (!newEvent.ten?.trim()) {
            newErrors.ten = "Vui lòng nhập tên sự kiện";
        }

        // Validate ngày tổ chức
        if (!newEvent.ngayToChuc) {
            newErrors.ngayToChuc = "Vui lòng chọn ngày tổ chức";
        } else {
            const eventDate = new Date(newEvent.ngayToChuc);
            eventDate.setHours(0, 0, 0, 0);
            if (eventDate.getTime() <= today.getTime()) {
                newErrors.ngayToChuc = "Ngày tổ chức phải là ngày trong tương lai";
            }
        }

        // Validate thời gian
        if (!newEvent.thoiGianBatDau || !newEvent.thoiGianKetThuc) {
            newErrors.thoiGianBatDau = "Vui lòng chọn thời gian";
        } else {
            const startTime = newEvent.thoiGianBatDau.split(':');
            const endTime = newEvent.thoiGianKetThuc.split(':');
            const startHour = parseInt(startTime[0]);
            const startMinute = parseInt(startTime[1]);
            const endHour = parseInt(endTime[0]);
            const endMinute = parseInt(endTime[1]);

            // Chuyển đổi thời gian sang phút đ dễ so sánh
            const startTotalMinutes = startHour * 60 + startMinute;
            const endTotalMinutes = endHour * 60 + endMinute;
            const timeDifference = endTotalMinutes - startTotalMinutes;

            // Kiểm tra giờ bắt đầu
            if (startHour < 6 || startHour > 20) {
                newErrors.thoiGianBatDau = "Thời gian bắt đầu phải từ 6:00 đến 20:00";
            }

            // Kiểm tra giờ kết thúc
            if (endHour < 6 || endHour > 20) {
                newErrors.thoiGianKetThuc = "Thời gian kết thúc phải từ 6:00 đến 20:00";
            }

            // Kiểm tra thời gian kết thúc phải sau thời gian bắt đầu
            if (timeDifference <= 0) {
                newErrors.thoiGianKetThuc = "Thời gian kết thúc phải sau thời gian bắt đầu";
            }
            // Kiểm tra khoảng cách tối thiểu 45 phút
            else if (timeDifference < 45) {
                newErrors.thoiGianKetThuc = "Thời gian tổ chức phải kéo dài ít nhất 45 phút";
            }
        }

        // Validate địa điểm
        if (!newEvent.diaDiem?.trim()) {
            newErrors.diaDiem = "Vui lòng nhập địa điểm";
        }

        // Validate nội dung
        if (!newEvent.noiDung?.trim()) {
            newErrors.noiDung = "Vui lòng nhập nội dung";
        }

        // Validate ngân sách chi tiêu
        const budget = Number(newEvent.nganSachChiTieu);
        if (isNaN(budget) || budget < 0) {
            newErrors.nganSachChiTieu = "Ngân sách chi tiêu không được âm";
        }

        // Validate người phụ trách
        if (!newEvent.nguoiPhuTrach?.trim()) {
            newErrors.nguoiPhuTrach = "Vui lòng nhập người phụ trách";
        }

        console.log("Validation errors:", newErrors);

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return (
        <div className="flex flex-col gap-12 mt-12 mb-8">
            <Card>
                <CardHeader
                    variant="gradient"
                    color="cyan"
                    className="p-6 mb-8"
                >
                    <Typography variant="h6" color="white">
                        Quản lý sự kiện
                    </Typography>
                </CardHeader>
                <CardBody className="px-0 pt-0 pb-2 overflow-auto">
                    <div className="flex items-center justify-between p-4">
                        {/* Cột bên trái chứa tìm kiếm và các bộ lọc */}
                        <div className="flex items-center gap-4">
                            {/* Ô tìm kiếm */}
                            <div className="w-72">
                                <Input
                                    label="Tìm kiếm sự kiện"
                                    icon={<i className="fas fa-search" />}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            
                            {/* Các nút filter */}
                            <div className="flex gap-2">
                                <Button
                                    variant={statusFilter === "all" ? "gradient" : "outlined"}
                                    color="cyan"
                                    size="sm"
                                    onClick={() => setStatusFilter("all")}
                                >
                                    Tất cả
                                </Button>

                                <Button
                                    variant={statusFilter === "choDuyet" ? "gradient" : "outlined"}
                                    color="cyan"
                                    size="sm"
                                    onClick={() => setStatusFilter("choDuyet")}
                                >
                                    Chờ duyệt
                                </Button>

                                <Button
                                    variant={statusFilter === "daDuyet" ? "gradient" : "outlined"}
                                    color="cyan"
                                    size="sm"
                                    onClick={() => setStatusFilter("daDuyet")}
                                >
                                    Đã duyệt
                                </Button>

                                <Button
                                    variant={statusFilter === "tuChoi" ? "gradient" : "outlined"}
                                    color="cyan"
                                    size="sm"
                                    onClick={() => setStatusFilter("tuChoi")}
                                >
                                    Đã từ chối
                                </Button>
                            </div>

                            {/* Hiển thị kết quả tìm kiếm nếu có */}
                            {searchTerm && (
                                <Typography variant="small" color="blue-gray">
                                    Tìm thấy {filteredEvents.length} kết quả
                                </Typography>
                            )}
                        </div>

                        {/* Nút thêm bên phải */}
                        <div className="pr-6">
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
                                    color="cyan"
                                    size="sm"
                                    onClick={() => {
                                        setNewEvent({
                                            ten: "",
                                            ngayToChuc: "",
                                            thoiGianBatDau: "00:00",
                                            thoiGianKetThuc: "00:00",
                                            diaDiem: "",
                                            noiDung: "",
                                            nganSachChiTieu: 0,
                                            nguoiPhuTrach: "",
                                            khachMoi: [],
                                            club: "",
                                        });
                                        setEditingEventId(null);
                                        setIsDialogOpen(true);
                                    }}
                                >
                                    <FaPlus className="w-4 h-4" strokeWidth={"2rem"} />
                                </Button>
                            </Tooltip>
                        </div>
                    </div>

                    {isLoading
                        ? (
                            <div className="flex items-center justify-center h-64">
                                <Spinner className="w-12 h-12" color="cyan" />
                            </div>
                        )
                        : (
                            <>
                                <table className="w-full min-w-[640px] table-auto">
                                    <thead>
                                        <tr>
                                            {[
                                                "Tên sự kiện",
                                                "Ngày tổ chức",
                                                "Địa điểm",
                                                "Người phụ trách",
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
                                        {currentEvents.map(({
                                            _id,
                                            ten,
                                            ngayToChuc,
                                            thoiGianBatDau,
                                            thoiGianKetThuc,
                                            diaDiem,
                                            nguoiPhuTrach,
                                            trangThai,
                                        }, index) => {
                                            const className =
                                                index === currentEvents.length - 1
                                                    ? "p-4"
                                                    : "p-4 border-b border-blue-gray-50";

                                            return (
                                                <tr key={_id}>
                                                    <td className={className}>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-semibold"
                                                        >
                                                            {ten}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <div className="flex flex-col">
                                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                                {new Date(
                                                                    ngayToChuc,
                                                                ).toLocaleDateString(
                                                                    "vi-VN",
                                                                )}
                                                            </Typography>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <div className="w-1 h-1 rounded-full bg-blue-gray-300">
                                                                </div>
                                                                <Typography className="text-xs text-blue-gray-500">
                                                                    {thoiGianBatDau}
                                                                    {" "}
                                                                    -{" "}
                                                                    {thoiGianKetThuc}
                                                                </Typography>
                                                            </div>
                                                        </div>
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
                                                        <div className="flex items-center gap-2">
                                                            {trangThai ===
                                                                    "choDuyet" && (
                                                                <Typography className="text-xs font-semibold text-orange-500">
                                                                    Chờ duyệt
                                                                </Typography>
                                                            )}
                                                            {trangThai ===
                                                                    "daDuyet" && (
                                                                <Typography className="text-xs font-semibold text-green-500">
                                                                    Đã duyệt
                                                                </Typography>
                                                            )}
                                                            {trangThai ===
                                                                    "tuChoi" && (
                                                                <Typography className="text-xs font-semibold text-red-500">
                                                                    Đã từ chối
                                                                </Typography>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className={className}>
                                                        <div className="flex items-center gap-2">
                                                            <Tooltip
                                                                content="Xem"
                                                                animate={{
                                                                    mount: {
                                                                        scale: 1,
                                                                        y: 0,
                                                                    },
                                                                    unmount: {
                                                                        scale: 0,
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
                                                                            _id,
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
                                                                        scale: 1,
                                                                        y: 0,
                                                                    },
                                                                    unmount: {
                                                                        scale: 0,
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
                                                                            _id,
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
                                                                        scale: 1,
                                                                        y: 0,
                                                                    },
                                                                    unmount: {
                                                                        scale: 0,
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
                                                                        handleDeleteEvent(
                                                                            _id,
                                                                            trangThai
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

                                {/* Thêm phân trang */}
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
                                            // Hiển thị tất cả các trang nếu tổng số trang <= 5
                                            [...Array(totalPages)].map((_, index) => (
                                                <Button
                                                    key={index + 1}
                                                    variant={currentPage === index + 1 ? "gradient" : "text"}
                                                    color="cyan"
                                                    onClick={() => handlePageChange(index + 1)}
                                                    className="w-10 h-10"
                                                >
                                                    {index + 1}
                                                </Button>
                                            ))
                                        ) : (
                                            // Hiển thị phân trang với dấu ... nếu tổng số trang > 5
                                            <>
                                                {/* Trang đầu */}
                                                <Button
                                                    variant={currentPage === 1 ? "gradient" : "text"}
                                                    color="cyan"
                                                    onClick={() => handlePageChange(1)}
                                                    className="w-10 h-10"
                                                >
                                                    1
                                                </Button>

                                                {/* Dấu ... bên trái */}
                                                {currentPage > 3 && (
                                                    <span className="mx-2">...</span>
                                                )}

                                                {/* Các trang ở giữa */}
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
                                                            color="cyan"
                                                            onClick={() => handlePageChange(pageNumber)}
                                                            className="w-10 h-10"
                                                        >
                                                            {pageNumber}
                                                        </Button>
                                                    );
                                                })}

                                                {/* Dấu ... bên phải */}
                                                {currentPage < totalPages - 2 && (
                                                    <span className="mx-2">...</span>
                                                )}

                                                {/* Trang cuối */}
                                                <Button
                                                    variant={currentPage === totalPages ? "gradient" : "text"}
                                                    color="cyan"
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

            {/* Dialog thêm/sửa sự kiện */}
            <Dialog
                open={isDialogOpen}
                handler={() => setIsDialogOpen(false)}
                size="lg"
            >
                <DialogHeader className="lg:text-2xl md:text-xl sm:text-base">
                    {editingEventId ? "Chỉnh sửa Sự kiện" : "Thêm Sự kiện Mới"}
                </DialogHeader>
                <DialogBody divider className="grid grid-cols-2 gap-4 overflow-y-auto max-h-[80vh]">
                    <div>
                        <Input
                            label="Tên sự kiện"
                            value={newEvent.ten}
                            onChange={(e) => {
                                setNewEvent({ ...newEvent, ten: e.target.value });
                                setErrors({ ...errors, ten: "" });
                            }}
                            error={!!errors.ten}
                        />
                        {errors.ten && (
                            <Typography color="red" className="mt-1 text-xs">
                                {errors.ten}
                            </Typography>
                        )}
                    </div>

                    <div>
                        <Input
                            type="date"
                            label="Ngày tổ chức"
                            value={newEvent.ngayToChuc}
                            onChange={(e) => {
                                setNewEvent({ ...newEvent, ngayToChuc: e.target.value });
                                setErrors({ ...errors, ngayToChuc: "" });
                            }}
                            error={!!errors.ngayToChuc}
                            min={new Date(Date.now() + 86400000).toISOString().split("T")[0]} // Ngày mai
                        />
                        {errors.ngayToChuc && (
                            <Typography color="red" className="mt-1 text-xs">
                                {errors.ngayToChuc}
                            </Typography>
                        )}
                    </div>

                    <div>
                        <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                            Thời gian bắt đầu
                        </Typography>
                        <TimePicker
                            onChange={(value) => {
                                setNewEvent({ ...newEvent, thoiGianBatDau: value });
                                setErrors({ ...errors, thoiGianBatDau: "" });
                            }}
                            value={newEvent.thoiGianBatDau}
                            clearIcon={null}
                            clockIcon={null}
                            format="HH:mm"
                            disableClock={true}
                            className={errors.thoiGianBatDau ? "border-red-500" : ""}
                        />
                        {errors.thoiGianBatDau && (
                            <Typography color="red" className="mt-1 text-xs">
                                {errors.thoiGianBatDau}
                            </Typography>
                        )}
                    </div>

                    <div>
                        <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                            Thời gian kết thúc
                        </Typography>
                        <TimePicker
                            onChange={(value) => {
                                setNewEvent({ ...newEvent, thoiGianKetThuc: value });
                                setErrors({ ...errors, thoiGianKetThuc: "" });
                            }}
                            value={newEvent.thoiGianKetThuc}
                            clearIcon={null}
                            clockIcon={null}
                            format="HH:mm"
                            disableClock={true}
                            className={errors.thoiGianKetThuc ? "border-red-500" : ""}
                        />
                        {errors.thoiGianKetThuc && (
                            <Typography color="red" className="mt-1 text-xs">
                                {errors.thoiGianKetThuc}
                            </Typography>
                        )}
                    </div>

                    <div>
                        <Input
                            type="number"
                            label="Ngân sách chi tiêu"
                            value={newEvent.nganSachChiTieu}
                            onChange={(e) => {
                                setNewEvent({ ...newEvent, nganSachChiTieu: e.target.value });
                                setErrors({ ...errors, nganSachChiTieu: "" });
                            }}
                            error={!!errors.nganSachChiTieu}
                        />
                        {errors.nganSachChiTieu && (
                            <Typography color="red" className="mt-1 text-xs">
                                {errors.nganSachChiTieu}
                            </Typography>
                        )}
                    </div>

                    <div>
                        <Input
                            label="Người phụ trách"
                            value={newEvent.nguoiPhuTrach}
                            onChange={(e) => {
                                setNewEvent({ ...newEvent, nguoiPhuTrach: e.target.value });
                                setErrors({ ...errors, nguoiPhuTrach: "" });
                            }}
                            error={!!errors.nguoiPhuTrach}
                        />
                        {errors.nguoiPhuTrach && (
                            <Typography color="red" className="mt-1 text-xs">
                                {errors.nguoiPhuTrach}
                            </Typography>
                        )}
                    </div>

                    <div>
                        <Input
                            label="Địa điểm tổ chức"
                            value={newEvent.diaDiem}
                            onChange={(e) => {
                                setNewEvent({ ...newEvent, diaDiem: e.target.value });
                                setErrors({ ...errors, diaDiem: "" });
                            }}
                            error={!!errors.diaDiem}
                        />
                        {errors.diaDiem && (
                            <Typography color="red" className="mt-1 text-xs">
                                {errors.diaDiem}
                            </Typography>
                        )}
                    </div>

                    <div className="col-span-2">
                        <Typography
                            variant="small"
                            color="blue-gray"
                            className="mb-2 font-medium"
                        >
                            Khách mời
                        </Typography>
                        <div className="flex items-center gap-2 mb-2">
                            <Input
                                label="Tên khách mời"
                                value={guestInput}
                                onChange={(e) => setGuestInput(e.target.value)}
                                onKeyPress={(e) =>
                                    e.key === "Enter" && handleAddGuest()}
                            />
                            <Button
                                onClick={handleAddGuest}
                                className="flex-shrink-0"
                            >
                                <PlusIcon className="w-5 h-5" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {newEvent.khachMoi.map((guest, index) => (
                                <div
                                    key={index}
                                    className="flex items-center px-3 py-1 rounded-full bg-blue-gray-50"
                                >
                                    <Input
                                        value={guest}
                                        onChange={(e) =>
                                            handleEditGuest(
                                                index,
                                                e.target.value,
                                            )}
                                        className="p-0 text-sm bg-transparent border-none"
                                    />
                                    <IconButton
                                        variant="text"
                                        color="red"
                                        onClick={() => handleRemoveGuest(index)}
                                    >
                                        <XCircleIcon className="w-5 h-5" />
                                    </IconButton>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-2">
                        <Textarea
                            label="Nội dung"
                            value={newEvent.noiDung}
                            onChange={(e) => {
                                setNewEvent({ ...newEvent, noiDung: e.target.value });
                                setErrors({ ...errors, noiDung: "" });
                            }}
                            error={!!errors.noiDung}
                            rows={4}
                        />
                        {errors.noiDung && (
                            <Typography color="red" className="mt-1 text-xs">
                                {errors.noiDung}
                            </Typography>
                        )}
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
                        onClick={() => {
                            console.log("Submit button clicked");
                            if (editingEventId) {
                                handleUpdateEvent();
                            } else {
                                handleAddEvent();
                            }
                        }}
                    >
                        {editingEventId ? "Cập nhật" : "Thêm"}
                    </Button>
                </DialogFooter>
            </Dialog>

            {/* Dialog xem chi tiết sự kiện */}
            <Dialog
                open={isDetailDialogOpen}
                handler={() => setIsDetailDialogOpen(false)}
                size="xl"
            >
                <DialogHeader className="flex items-center gap-4">
                    <Typography variant="h6">Chi tiết sự kiện</Typography>
                    <Typography 
                        variant="small" 
                        className={`
                            px-3 py-1 rounded-full font-bold uppercase
                            ${detailEvent?.trangThai === 'daDuyet' && 'bg-green-500 text-white'}
                            ${detailEvent?.trangThai === 'choDuyet' && 'bg-orange-500 text-white'}
                            ${detailEvent?.trangThai === 'tuChoi' && 'bg-red-500 text-white'}
                        `}
                    >
                        {detailEvent?.trangThai === 'daDuyet' && 'Đã duyệt'}
                        {detailEvent?.trangThai === 'choDuyet' && 'Chờ duyệt'}
                        {detailEvent?.trangThai === 'tuChoi' && 'Đã từ chối'}
                    </Typography>
                </DialogHeader>

                {detailEvent && (
                    <DialogBody divider className="overflow-y-auto lg:max-h-[65vh] sm:max-h-[50vh] p-6">
                        <div className="grid gap-6">
                            {/* Thông tin cơ bản */}
                            <div className="bg-blue-gray-50 p-6 rounded-lg">
                                {/* Tên sự kiện */}
                                <div className="text-center mb-6">
                                    <Typography variant="h4" color="blue" className="font-bold mb-2">
                                        {detailEvent.ten}
                                    </Typography>
                                    <Typography 
                                        variant="small" 
                                        className="bg-white px-4 py-2 rounded-full text-blue-900 inline-block font-medium"
                                    >
                                        {clubs.find(c => c._id === detailEvent.club)?.ten}
                                    </Typography>
                                </div>

                                {/* Thông tin thời gian */}
                                <div className="grid gap-4">
                                    <div className="bg-white p-4 rounded-lg">
                                        <Typography className="text-sm text-gray-600 mb-2">Thời gian tổ chức</Typography>
                                        <div className="flex flex-col gap-1">
                                            <Typography className="font-medium">
                                                {new Date(detailEvent.ngayToChuc).toLocaleDateString('vi-VN', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </Typography>
                                            <Typography className="text-blue-900">
                                                {detailEvent.thoiGianBatDau} - {detailEvent.thoiGianKetThuc}
                                            </Typography>
                                        </div>
                                    </div>

                                    <div className="bg-white p-4 rounded-lg">
                                        <Typography className="text-sm text-gray-600 mb-1">Địa điểm</Typography>
                                        <Typography className="font-medium">{detailEvent.diaDiem}</Typography>
                                    </div>

                                    <div className="bg-white p-4 rounded-lg">
                                        <Typography className="text-sm text-gray-600 mb-1">Người phụ trách</Typography>
                                        <Typography className="font-medium">{detailEvent.nguoiPhuTrach}</Typography>
                                    </div>
                                </div>
                            </div>

                            {/* Nội dung sự kiện */}
                            <div className="bg-blue-gray-50 p-4 rounded-lg">
                                <Typography className="text-sm text-gray-600 mb-2">Nội dung sự kiện</Typography>
                                <Typography className="font-medium whitespace-pre-line">
                                    {detailEvent.noiDung}
                                </Typography>
                            </div>

                            {/* Thông tin khác */}
                            <div className="bg-blue-gray-50 p-4 rounded-lg">
                                <Typography className="text-sm text-gray-600 mb-2">Ngân sách chi tiêu</Typography>
                                <Typography className="font-medium text-blue-900">
                                    {detailEvent.nganSachChiTieu?.toLocaleString('vi-VN')} đồng
                                </Typography>
                            </div>

                            <div className="bg-blue-gray-50 p-4 rounded-lg">
                                <Typography className="text-sm text-gray-600 mb-2">Danh sách khách mời</Typography>
                                <div className="flex flex-wrap gap-2">
                                    {detailEvent.khachMoi.map((guest, index) => (
                                        <div 
                                            key={index}
                                            className="bg-white px-3 py-1 rounded-full text-sm font-medium"
                                        >
                                            {guest}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Lý do từ chối */}
                            {detailEvent && detailEvent.trangThai === "tuChoi" && (
                                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                    <Typography className="text-sm text-red-800 font-medium mb-2">
                                        Lý do từ chối
                                    </Typography>
                                    <Typography className="text-red-700">
                                        {detailEvent.lyDoTuChoi}
                                    </Typography>
                                </div>
                            )}
                        </div>
                    </DialogBody>
                )}
                <DialogFooter>
                    <Button
                        variant="gradient"
                        color="blue"
                        onClick={() => setIsDetailDialogOpen(false)}
                    >
                        Đóng
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default ManageEvents;
