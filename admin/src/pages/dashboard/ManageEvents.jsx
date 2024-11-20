import {
    ChevronLeftIcon,
    ChevronRightIcon,
    EyeIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
    XCircleIcon,
    XMarkIcon,
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
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useMaterialTailwindController } from "@/context/useMaterialTailwindController";
import { message, notification } from "antd";

const API_URL = "http://4.242.20.80:5500/api";

const ManageEvents = () => {
    // Định nghĩa các hàm helper trước các state
    const getStatusText = (status) => {
        switch (status) {
            case "daDuyet":
                return "Đã duyệt";
            case "tuChoi":
                return "Đã từ chối";
            case "choDuyet":
                return "Chờ duyệt";
            default:
                return "Không xác định";
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "daDuyet":
                return "green";
            case "tuChoi":
                return "red";
            case "choDuyet":
                return "orange";
            default:
                return "gray";
        }
    };

    // Các state declarations
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
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [showStudentDropdown, setShowStudentDropdown] = useState(false);
    const [dateFilter, setDateFilter] = useState({
        from: "",
        to: "",
    });
    const [activeTab, setActiveTab] = useState("list");
    const [calendarCustomStyles, setCalendarCustomStyles] = useState({
        ".fc": "bg-white rounded-lg shadow-md",
        ".fc .fc-toolbar": "p-4",
        ".fc .fc-toolbar-title": "text-xl font-bold text-gray-800",
        ".fc .fc-button":
            "bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200",
        ".fc .fc-button-primary:not(:disabled):active": "bg-blue-700",
        ".fc .fc-button-primary:disabled": "bg-blue-300",
        ".fc .fc-daygrid-day": "hover:bg-blue-50 cursor-pointer",
        ".fc .fc-event":
            "bg-blue-500 border-none hover:opacity-90 cursor-pointer",
        ".fc .fc-event-time": "font-semibold",
        ".fc .fc-event-title": "font-medium",
        ".fc .fc-header-toolbar":
            "mb-4 flex flex-wrap justify-between items-center gap-4",
        ".fc .fc-view-harness": "bg-white rounded-lg shadow-sm",
        ".fc .fc-scrollgrid": "border-none",
        ".fc .fc-scrollgrid td": "border-color-gray-200",
        ".fc th": "p-3 font-semibold text-gray-600 border-gray-200",
        ".fc td": "border-gray-200",
    });

    // Lấy controller từ context & màu hiện tại của sidenav
    const [controller] = useMaterialTailwindController();
    const { sidenavColor } = controller;

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
                // alert(
                //     "Không thể tải thông tin câu lạc bộ. Vui lng đăng nhập lại.",
                // );
                message.error({content: "Không thể tải thông tin câu lạc bộ. Vui lng đăng nhập lại."});
            }
        } else {
            console.error("No managed clubs data found");
            // alert(
            //     "Không tìm thấy thông tin câu lạc bộ. Vui lòng đăng nhập lại.",
            // );
            message.error({content: "Không tìm thấy thông tin câu lạc bộ. Vui lòng đăng nhập lại."});
        }
        setIsLoading(false);
        fetchClubs();
    }, []);

    useEffect(() => {
        if (managedClub?._id) {
            fetchMembersByClub(managedClub._id);
        }
    }, [managedClub]);

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
            // alert(`Lỗi khi thêm sự kiện: ${error.message || "Không xác định"}`);
            notification.error({
                message: "Lỗi khi thêm sự kiện",
                description: error.message || "Không xác định",
            })
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
                newEvent,
            );
            setIsDialogOpen(false);
            setEditingEventId(null);
            fetchEvents(managedClub._id);
        } catch (error) {
            console.error("Error updating event:", error);
            // alert(
            //     `Lỗi khi cập nhật sự kiện: ${
            //         error.response?.data?.message || "Không xác định"
            //     }`,
            // );
            notification.error({
                message: "Lỗi khi cập nhật sự kiện",
                description: error.response?.data?.message || "Không xác định",
            })
        }
    };

    const handleDeleteEvent = async (eventId, trangThai) => {
        // Kiểm tra trạng thái
        if (trangThai === "daDuyet") {
            // alert("Không thể xóa sự kiện đã được duyệt!");
            message.warning({content: "Không thể xóa sự kiện đã được duyệt!"});
            return;
        }

        if (window.confirm("Bạn có chắc chắn muốn xóa sự kiện này?")) {
            try {
                // Kiểm tra xem sự kiện có trong báo cáo không
                const checkResponse = await axios.get(
                    `${API_URL}/check-event-in-reports/${eventId}`,
                );

                if (checkResponse.data.exists) {
                    // alert(
                    //     "Không thể xóa sự kiện này vì nó đã được sử dụng trong báo cáo!",
                    // );
                    message.warning({content: "Không thể xóa sự kiện này vì nó đã được sử dụng trong báo cáo!"});
                    return;
                }

                await axios.delete(`${API_URL}/delete-event/${eventId}`);
                fetchEvents(managedClub._id);
            } catch (error) {
                console.error("Error deleting event:", error);
                // alert(
                //     `Lỗi khi xóa sự kiện: ${
                //         error.response?.data?.message || "Không xác định"
                //     }`,
                // );
                notification.error({
                    message: "Lỗi khi xóa sự kiện",
                    description: error.response?.data?.message || "Không xác định",
                })
            }
        }
    };

    const openEditDialog = async (id) => {
        try {
            const response = await axios.get(`${API_URL}/get-event/${id}`);
            const event = response.data;

            // Kiểm tra trạng thái trước khi cho phép sửa
            if (event.trangThai === "daDuyet") {
                // alert("Không thể sửa sự kiện đã được duyệt!");
                message.warning({content: "Không thể sửa sự kiện đã được duyệt!"});
                return;
            }

            // Thêm kiểm tra cho sự kiện bị từ chối
            if (event.trangThai === "tuChoi") {
                // alert("Không thể sửa sự kiện đã bị từ chối!");
                message.warning({content: "Không thể sửa sự kiện đã bị từ chối!"});
                return;
            }

            setErrors({});
            setNewEvent({
                ...event,
                ngayToChuc: event.ngayToChuc.split("T")[0],
            });
            setEditingEventId(id);
            setIsDialogOpen(true);
        } catch (error) {
            console.error("Error fetching event details:", error);
            // alert(
            //     `Lỗi khi lấy thông tin sự kiện: ${
            //         error.response?.data?.message || "Không xác định"
            //     }`,
            // );
            notification.error({
                message: "Lỗi khi lấy thông tin sự kiện",
                description: error.response?.data?.message || "Không xác định",
            })
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
            // alert(
            //     `Lỗi khi lấy thông tin sự kiện: ${
            //         error.response?.data?.message || "Không xác định"
            //     }`,
            // );
            notification.error({
                message: "Lỗi khi lấy thông tin sự kiện",
                description: error.response?.data?.message || "Không xác định",
            })
        }
    };

    const filteredEvents = useMemo(() => {
        let filtered = events;

        // Tìm kiếm theo tên sự kiện hoặc người phụ trách
        if (searchTerm.trim()) {
            filtered = filtered.filter((event) =>
                event.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.nguoiPhuTrach.toLowerCase().includes(
                    searchTerm.toLowerCase(),
                )
            );
        }

        // Lọc theo trạng thái
        if (statusFilter !== "all") {
            filtered = filtered.filter((event) =>
                event.trangThai === statusFilter
            );
        }

        // Lọc theo ngày tổ chức
        if (dateFilter.from || dateFilter.to) {
            filtered = filtered.filter((event) => {
                const eventDate = new Date(event.ngayToChuc);
                eventDate.setHours(0, 0, 0, 0);

                if (dateFilter.from && dateFilter.to) {
                    const fromDate = new Date(dateFilter.from);
                    const toDate = new Date(dateFilter.to);
                    return eventDate >= fromDate && eventDate <= toDate;
                } else if (dateFilter.from) {
                    const fromDate = new Date(dateFilter.from);
                    return eventDate >= fromDate;
                } else if (dateFilter.to) {
                    const toDate = new Date(dateFilter.to);
                    return eventDate <= toDate;
                }
                return true;
            });
        }

        // Sắp xếp theo ngày tổ chức (mới nhất -> cũ nhất)
        return filtered.sort((a, b) =>
            new Date(b.ngayToChuc) - new Date(a.ngayToChuc)
        );
    }, [events, searchTerm, statusFilter, dateFilter]);

    // Tính toán events cho trang hiện tại
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEvents = filteredEvents.slice(
        indexOfFirstItem,
        indexOfLastItem,
    );
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
                newErrors.ngayToChuc =
                    "Ngày tổ chức phải là ngày trong tương lai";
            }
        }

        // Validate thời gian
        if (!newEvent.thoiGianBatDau || !newEvent.thoiGianKetThuc) {
            newErrors.thoiGianBatDau = "Vui lòng chọn thời gian";
        } else {
            const startTime = newEvent.thoiGianBatDau.split(":");
            const endTime = newEvent.thoiGianKetThuc.split(":");
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
                newErrors.thoiGianBatDau =
                    "Thời gian bắt đầu phải từ 6:00 đến 20:00";
            }

            // Kiểm tra giờ kết thúc
            if (endHour < 6 || endHour > 20) {
                newErrors.thoiGianKetThuc =
                    "Thời gian kết thúc phải từ 6:00 đến 20:00";
            }

            // Kiểm tra thời gian kết thúc phải sau thời gian bắt đầu
            if (timeDifference <= 0) {
                newErrors.thoiGianKetThuc =
                    "Thời gian kết thúc phải sau thời gian bắt đầu";
            } // Kiểm tra khoảng cách tối thiểu 45 phút
            else if (timeDifference < 45) {
                newErrors.thoiGianKetThuc =
                    "Thời gian tổ chức phải kéo dài ít nhất 45 phút";
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

        // Validate người phụ trách
        if (!newEvent.nguoiPhuTrach?.trim()) {
            newErrors.nguoiPhuTrach = "Vui lòng nhập người phụ trách";
        }

        console.log("Validation errors:", newErrors);

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const fetchMembersByClub = async (clubId) => {
        try {
            const response = await axios.get(
                `${API_URL}/get-members-by-club/${clubId}`,
            );
            const formattedMembers = response.data.map((member) => ({
                _id: member._id,
                hoTen: member.hoTen,
                mssv: member.maSoHocSinh,
            }));
            setStudents(formattedMembers);
        } catch (error) {
            console.error("Error fetching members:", error);
        }
    };

    const handleStudentSearch = (value) => {
        setNewEvent({ ...newEvent, nguoiPhuTrach: value });
        setShowStudentDropdown(true);

        // Lấy ngẫu nhiên 5 thành viên khi bấm vào input
        if (value.trim() === "") {
            const shuffled = [...students].sort(() => 0.5 - Math.random());
            setFilteredStudents(shuffled.slice(0, 5));
            return;
        }

        // Lọc theo tìm kiếm nếu có nhập text
        const filtered = students.filter((student) =>
            student.hoTen.toLowerCase().includes(value.toLowerCase()) ||
            student.mssv.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredStudents(filtered.slice(0, 5));
    };

    const handleSelectStudent = (student) => {
        setNewEvent({ ...newEvent, nguoiPhuTrach: student.hoTen });
        setShowStudentDropdown(false);
        setErrors({ ...errors, nguoiPhuTrach: "" });
    };

    // Thêm useEffect để xử lý click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            const dropdown = document.getElementById("student-dropdown");
            const input = document.getElementById("student-input");

            if (
                dropdown && input &&
                !dropdown.contains(event.target) &&
                !input.contains(event.target)
            ) {
                setShowStudentDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const getCalendarEvents = useMemo(() => {
        return events.map((event) => ({
            id: event._id,
            title: event.ten,
            start: `${event.ngayToChuc.split("T")[0]}T${event.thoiGianBatDau}`,
            end: `${event.ngayToChuc.split("T")[0]}T${event.thoiGianKetThuc}`,
            location: event.diaDiem,
            className: `${
                event.trangThai === "daDuyet"
                    ? "bg-green-500"
                    : event.trangThai === "choDuyet"
                    ? "bg-orange-500"
                    : "bg-red-500"
            } text-white rounded-md p-1`,
            extendedProps: {
                trangThai: event.trangThai,
                nguoiPhuTrach: event.nguoiPhuTrach,
                location: event.diaDiem,
            },
        }));
    }, [events]);

    const handleEventClick = (clickInfo) => {
        const eventId = clickInfo.event.id;
        openDetailDialog(eventId);
    };

    return (
        <div className="flex flex-col gap-6 md:gap-12 mt-6 md:mt-12 mb-8">
            <Card>
                <CardHeader
                    variant="gradient"
                    color={sidenavColor}
                    className="p-4 md:p-6 mb-4 md:mb-8"
                >
                    <Typography variant="h6" color="white">
                        Quản lý sự kiện
                    </Typography>
                </CardHeader>
                <CardBody className="px-0 pt-0 pb-2 overflow-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 gap-4">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:translate-x-2">
                            <div className="w-full md:w-96">
                                <Input
                                    label={
                                        <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                                            Tìm theo tên event / người phụ trách
                                        </span>
                                    }
                                    icon={<i className="fas fa-search" />}
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant={statusFilter === "all"
                                        ? "gradient"
                                        : "outlined"}
                                    color={sidenavColor}
                                    size="sm"
                                    onClick={() => setStatusFilter("all")}
                                >
                                    Tất cả
                                </Button>

                                <Button
                                    variant={statusFilter === "choDuyet"
                                        ? "gradient"
                                        : "outlined"}
                                    color={sidenavColor}
                                    size="sm"
                                    onClick={() => setStatusFilter("choDuyet")}
                                >
                                    Chờ duyệt
                                </Button>

                                <Button
                                    variant={statusFilter === "daDuyet"
                                        ? "gradient"
                                        : "outlined"}
                                    color={sidenavColor}
                                    size="sm"
                                    onClick={() => setStatusFilter("daDuyet")}
                                >
                                    Đã duyệt
                                </Button>

                                <Button
                                    variant={statusFilter === "tuChoi"
                                        ? "gradient"
                                        : "outlined"}
                                    color={sidenavColor}
                                    size="sm"
                                    onClick={() => setStatusFilter("tuChoi")}
                                >
                                    Đã từ chối
                                </Button>
                            </div>
                        </div>

                        <div className="flex justify-end md:pr-2">
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
                                    onClick={() => {
                                        setNewEvent({
                                            ten: "",
                                            ngayToChuc: "",
                                            thoiGianBatDau: "00:00",
                                            thoiGianKetThuc: "00:00",
                                            diaDiem: "",
                                            noiDung: "",
                                            nguoiPhuTrach: "",
                                            khachMoi: [],
                                            club: "",
                                        });
                                        setEditingEventId(null);
                                        setIsDialogOpen(true);
                                    }}
                                >
                                    <FaPlus
                                        className="w-4 h-4"
                                        strokeWidth={"2rem"}
                                    />
                                </Button>
                            </Tooltip>
                        </div>
                    </div>

                    <div className="px-4 md:px-6 mb-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <Input
                                    type="date"
                                    label="Từ ngày"
                                    value={dateFilter.from}
                                    onChange={(e) =>
                                        setDateFilter((prev) => ({
                                            ...prev,
                                            from: e.target.value,
                                        }))}
                                    className="bg-white"
                                />
                            </div>

                            <div>
                                <Input
                                    type="date"
                                    label="Đến ngày"
                                    value={dateFilter.to}
                                    onChange={(e) =>
                                        setDateFilter((prev) => ({
                                            ...prev,
                                            to: e.target.value,
                                        }))}
                                    className="bg-white"
                                />
                            </div>
                        </div>

                        {(searchTerm || statusFilter !== "all" ||
                            dateFilter.from || dateFilter.to) && (
                            <div className="flex justify-start mt-4">
                                <Button
                                    variant="text"
                                    color="red"
                                    className="flex items-center gap-2 p-3"
                                    onClick={() => {
                                        setSearchTerm("");
                                        setStatusFilter("all");
                                        setDateFilter({ from: "", to: "" });
                                    }}
                                >
                                    <XMarkIcon className="h-4 w-4" />
                                    <span>Xóa bộ lọc</span>
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end px-4 mb-4 ld:mr-4 md:mr-3">
                        <div className="flex gap-2">
                            <Button
                                variant={activeTab === "list"
                                    ? "gradient"
                                    : "outlined"}
                                color={sidenavColor}
                                size="sm"
                                onClick={() => setActiveTab("list")}
                                className="flex items-center gap-2"
                            >
                                <i className="fas fa-list text-sm"></i>
                                Danh sách
                            </Button>
                            <Button
                                variant={activeTab === "calendar"
                                    ? "gradient"
                                    : "outlined"}
                                color={sidenavColor}
                                size="sm"
                                onClick={() => setActiveTab("calendar")}
                                className="flex items-center gap-2"
                            >
                                <i className="fas fa-calendar text-sm"></i>
                                Lịch
                            </Button>
                        </div>
                    </div>

                    {activeTab === "list"
                        ? (
                            <div className="px-4">
                                <div className="w-full overflow-x-auto">
                                    <table className="w-full min-w-[640px] table-auto">
                                        <thead>
                                            <tr>
                                                {[
                                                    "STT",
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
                                                    index ===
                                                            currentEvents
                                                                    .length - 1
                                                        ? "p-4"
                                                        : "p-4 border-b border-blue-gray-50";

                                            return (
                                                <tr key={_id}>
                                                    <td className={`${className} px-2 md:px-4`}>
                                                        <Typography
                                                            className="text-xs font-semibold text-blue-gray-600"
                                                        >
                                                            {(currentPage - 1) * itemsPerPage + index + 1}
                                                        </Typography>
                                                    </td>
                                                    <td className={`${className} px-2 md:px-4`}>
                                                        <Tooltip
                                                            content={ten}
                                                            animate={{
                                                                mount: { scale: 1, y: 0 },
                                                                unmount: { scale: 0, y: 25 },
                                                            }}
                                                            className="bg-black bg-opacity-80"
                                                        >
                                                            <Typography
                                                                className="text-xs font-semibold text-blue-gray-600 truncate max-w-[200px]"
                                                            >
                                                                {ten.length > 30 ? `${ten.substring(0, 30)}...` : ten}
                                                            </Typography>
                                                        </Tooltip>
                                                    </td>
                                                    <td className={`${className} px-2 md:px-4`}>
                                                        <div className="flex flex-col">
                                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                                {new Date(ngayToChuc).toLocaleDateString("vi-VN")}
                                                            </Typography>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <div className="w-1 h-1 rounded-full bg-blue-gray-300"></div>
                                                                <Typography className="text-xs text-blue-gray-500">
                                                                    {thoiGianBatDau} - {thoiGianKetThuc}
                                                                </Typography>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className={`${className} px-2 md:px-4`}>
                                                        <Typography className="text-xs font-semibold text-blue-gray-600">
                                                            {diaDiem}
                                                        </Typography>
                                                    </td>
                                                    <td className={`${className} px-2 md:px-4`}>
                                                        <Typography className="text-xs font-semibold text-blue-gray-600">
                                                            {nguoiPhuTrach}
                                                        </Typography>
                                                    </td>
                                                    <td className={`${className} px-2 md:px-4`}>
                                                        <div className={`px-2 py-1 rounded-full text-center text-xs font-semibold ${
                                                            trangThai === "daDuyet" 
                                                                ? "bg-green-100 text-green-800" 
                                                                : trangThai === "choDuyet"
                                                                ? "bg-orange-100 text-orange-800"
                                                                : "bg-red-100 text-red-800"
                                                        }`}>
                                                            {trangThai === "daDuyet" && "Đã duyệt"}
                                                            {trangThai === "choDuyet" && "Chờ duyệt"}
                                                            {trangThai === "tuChoi" && "Đã từ chối"}
                                                        </div>
                                                    </td>
                                                    <td className={`${className} px-2 md:px-4`}>
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
                                                                content={
                                                                    trangThai === "daDuyet" 
                                                                        ? "Không thể sửa sự kiện đã duyệt" 
                                                                        : trangThai === "tuChoi"
                                                                        ? "Không thể sửa sự kiện đã bị từ chối"
                                                                        : "Sửa"
                                                                }
                                                                animate={{
                                                                    mount: { scale: 1, y: 0 },
                                                                    unmount: { scale: 0, y: 25 },
                                                                }}
                                                                className="bg-gradient-to-r from-black to-transparent opacity-70"
                                                            >
                                                                <Button
                                                                    size="sm"
                                                                    color="green"
                                                                    className="flex items-center gap-2"
                                                                    onClick={() => openEditDialog(_id)}
                                                                    disabled={trangThai === "daDuyet" || trangThai === "tuChoi"}
                                                                >
                                                                    <PencilIcon
                                                                        strokeWidth={2}
                                                                        className="w-4 h-4"
                                                                    />
                                                                </Button>
                                                            </Tooltip>
                                                            <Tooltip
                                                                content={trangThai === "daDuyet" ? "Không thể xóa sự kiện đã duyệt" : "Xóa"}
                                                                animate={{
                                                                    mount: { scale: 1, y: 0 },
                                                                    unmount: { scale: 0, y: 25 },
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
                                                                    disabled={trangThai === "daDuyet"}
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

                                <div className="flex justify-center gap-4 mt-6 mb-4">
                                    <Button
                                        variant="text"
                                        className="flex items-center gap-2"
                                        onClick={() =>
                                            handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeftIcon
                                            strokeWidth={2}
                                            className="h-4 w-4"
                                        />
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
                                                            handlePageChange(
                                                                index + 1,
                                                            )}
                                                        className="w-10"
                                                    >
                                                        <span className="flex justify-center">{index + 1}</span>
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
                                                            handlePageChange(1)}
                                                        className="w-10"
                                                    >
                                                        <span className="flex justify-center">1</span>
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
                                                                        handlePageChange(
                                                                            pageNumber,
                                                                        )}
                                                                    className="w-10"
                                                                >
                                                                    <span className="flex justify-center">{pageNumber}</span>
                                                                </Button>
                                                            );
                                                        },
                                                    )}

                                                    {currentPage <
                                                            totalPages - 2 && (
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
                                                            handlePageChange(
                                                                totalPages,
                                                            )}
                                                        className="w-10"
                                                    >
                                                        <span className="flex justify-center">{totalPages}</span>
                                                    </Button>
                                                </>
                                            )}
                                    </div>

                                    <Button
                                        variant="text"
                                        className="flex items-center gap-2"
                                        onClick={() =>
                                            handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages ||
                                            totalPages <= 1}
                                    >
                                        <ChevronRightIcon
                                            strokeWidth={2}
                                            className="h-4 w-4"
                                        />
                                    </Button>
                                </div>
                            </div>
                        )
                        : (
                            <div className="p-4 min-h-[800px]">
                                <style>
                                    {Object.entries(calendarCustomStyles)
                                        .map(([selector, styles]) =>
                                            `${selector} { ${
                                                styles.split(" ").map((c) =>
                                                    `@apply ${c};`
                                                ).join(" ")
                                            } }`
                                        )
                                        .join("\n")}
                                </style>
                                <FullCalendar
                                    plugins={[
                                        dayGridPlugin,
                                        timeGridPlugin,
                                        interactionPlugin,
                                    ]}
                                    initialView="dayGridMonth"
                                    headerToolbar={{
                                        left: "prev,next today",
                                        center: "title",
                                        right:
                                            "dayGridMonth,timeGridWeek,timeGridDay",
                                    }}
                                    events={getCalendarEvents}
                                    eventClick={handleEventClick}
                                    eventTimeFormat={{
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                    }}
                                    locale="vi"
                                    buttonText={{
                                        today: "Hôm nay",
                                        month: "Tháng",
                                        week: "Tuần",
                                        day: "Ngày",
                                    }}
                                    eventContent={(eventInfo) => (
                                        <Tooltip
                                            content={
                                                <div className="p-2 bg-white rounded-lg shadow-lg">
                                                    <div className="font-bold text-lg mb-2 text-gray-800">
                                                        {eventInfo.event.title}
                                                    </div>
                                                    <div className="space-y-2 text-sm text-gray-600">
                                                        <p className="flex items-center gap-2">
                                                            <i className="fas fa-clock">
                                                            </i>
                                                            {eventInfo.timeText}
                                                        </p>
                                                        <p className="flex items-center gap-2">
                                                            <i className="fas fa-map-marker-alt">
                                                            </i>
                                                            {eventInfo.event
                                                                .extendedProps
                                                                .location}
                                                        </p>
                                                        <p className="flex items-center gap-2">
                                                            <i className="fas fa-user">
                                                            </i>
                                                            {eventInfo.event
                                                                .extendedProps
                                                                .nguoiPhuTrach}
                                                        </p>
                                                        <p className="flex items-center gap-2">
                                                            <i className="fas fa-info-circle">
                                                            </i>
                                                            Tr���ng thái:{" "}
                                                            {getStatusText(
                                                                eventInfo.event
                                                                    .extendedProps
                                                                    .trangThai,
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            }
                                            animate={{
                                                mount: { scale: 1, y: 0 },
                                                unmount: { scale: 0, y: 25 },
                                            }}
                                            placement="top"
                                            className="bg-white p-2 rounded-lg shadow-xl"
                                        >
                                            <div className="p-1 overflow-hidden cursor-pointer">
                                                <div className="font-semibold text-sm truncate">
                                                    {eventInfo.event.title}
                                                </div>
                                                <div className="text-xs truncate">
                                                    {eventInfo.timeText}
                                                </div>
                                            </div>
                                        </Tooltip>
                                    )}
                                />
                            </div>
                        )}
                </CardBody>
            </Card>

            <Dialog
                open={isDialogOpen}
                handler={() => setIsDialogOpen(false)}
                size="lg"
                className="min-w-[90%] md:min-w-[70%] lg:min-w-[50%]"
            >
                <DialogHeader className="text-base md:text-xl lg:text-2xl">
                    {editingEventId ? "Chỉnh sửa Sự kiện" : "Thêm Sự kiện Mới"}
                </DialogHeader>
                <DialogBody
                    divider
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto max-h-[60vh] md:max-h-[70vh] p-4"
                >
                    <div>
                        <Input
                            label="Tên sự kiện"
                            value={newEvent.ten}
                            onChange={(e) => {
                                setNewEvent({
                                    ...newEvent,
                                    ten: e.target.value,
                                });
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
                                setNewEvent({
                                    ...newEvent,
                                    ngayToChuc: e.target.value,
                                });
                                setErrors({ ...errors, ngayToChuc: "" });
                            }}
                            error={!!errors.ngayToChuc}
                            min={new Date(Date.now() + 86400000).toISOString()
                                .split("T")[0]} // Ngày mai
                        />
                        {errors.ngayToChuc && (
                            <Typography color="red" className="mt-1 text-xs">
                                {errors.ngayToChuc}
                            </Typography>
                        )}
                    </div>

                    <div>
                        <Typography
                            variant="small"
                            color="blue-gray"
                            className="mb-2 font-medium"
                        >
                            Thời gian bắt đầu
                        </Typography>
                        <TimePicker
                            onChange={(value) => {
                                setNewEvent({
                                    ...newEvent,
                                    thoiGianBatDau: value,
                                });
                                setErrors({ ...errors, thoiGianBatDau: "" });
                            }}
                            value={newEvent.thoiGianBatDau}
                            clearIcon={null}
                            clockIcon={null}
                            format="HH:mm"
                            disableClock={true}
                            className={errors.thoiGianBatDau
                                ? "border-red-500"
                                : ""}
                        />
                        {errors.thoiGianBatDau && (
                            <Typography color="red" className="mt-1 text-xs">
                                {errors.thoiGianBatDau}
                            </Typography>
                        )}
                    </div>

                    <div>
                        <Typography
                            variant="small"
                            color="blue-gray"
                            className="mb-2 font-medium"
                        >
                            Thời gian kết thúc
                        </Typography>
                        <TimePicker
                            onChange={(value) => {
                                setNewEvent({
                                    ...newEvent,
                                    thoiGianKetThuc: value,
                                });
                                setErrors({ ...errors, thoiGianKetThuc: "" });
                            }}
                            value={newEvent.thoiGianKetThuc}
                            clearIcon={null}
                            clockIcon={null}
                            format="HH:mm"
                            disableClock={true}
                            className={errors.thoiGianKetThuc
                                ? "border-red-500"
                                : ""}
                        />
                        {errors.thoiGianKetThuc && (
                            <Typography color="red" className="mt-1 text-xs">
                                {errors.thoiGianKetThuc}
                            </Typography>
                        )}
                    </div>

                    <div className="relative">
                        <Input
                            id="student-input"
                            label="Người phụ trách"
                            value={newEvent.nguoiPhuTrach}
                            onChange={(e) =>
                                handleStudentSearch(e.target.value)}
                            error={!!errors.nguoiPhuTrach}
                            onFocus={() => {
                                setShowStudentDropdown(true);
                                // Hiển thị 5 thành viên ngẫu nhiên khi focus
                                const shuffled = [...students].sort(() =>
                                    0.5 - Math.random()
                                );
                                setFilteredStudents(shuffled.slice(0, 5));
                            }}
                        />
                        {errors.nguoiPhuTrach && (
                            <Typography color="red" className="mt-1 text-xs">
                                {errors.nguoiPhuTrach}
                            </Typography>
                        )}

                        {showStudentDropdown && filteredStudents.length > 0 && (
                            <div
                                id="student-dropdown"
                                className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
                            >
                                {filteredStudents.map((student) => (
                                    <div
                                        key={student._id}
                                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                        onClick={() =>
                                            handleSelectStudent(student)}
                                    >
                                        <Typography className="text-sm">
                                            {student.hoTen}
                                        </Typography>
                                        <Typography className="text-xs text-gray-600">
                                            MSHS: {student.mssv}
                                        </Typography>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <Input
                            label="Địa điểm tổ chức"
                            value={newEvent.diaDiem}
                            onChange={(e) => {
                                setNewEvent({
                                    ...newEvent,
                                    diaDiem: e.target.value,
                                });
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
                                setNewEvent({
                                    ...newEvent,
                                    noiDung: e.target.value,
                                });
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

            <Dialog
                open={isDetailDialogOpen}
                handler={() => setIsDetailDialogOpen(false)}
                size="xl"
                className="min-w-[95%] md:min-w-[80%] lg:min-w-[70%]"
            >
                <DialogHeader className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                    <Typography variant="h6">Chi tiết sự kiện</Typography>
                    <Typography
                        variant="small"
                        className={`
                            px-3 py-1 rounded-full font-bold uppercase
                            ${
                            detailEvent?.trangThai === "daDuyet" &&
                            "bg-green-500 text-white"
                        }
                            ${
                            detailEvent?.trangThai === "choDuyet" &&
                            "bg-orange-500 text-white"
                        }
                            ${
                            detailEvent?.trangThai === "tuChoi" &&
                            "bg-red-500 text-white"
                        }
                        `}
                    >
                        {detailEvent?.trangThai === "daDuyet" && "Đã duyệt"}
                        {detailEvent?.trangThai === "choDuyet" && "Chờ duyệt"}
                        {detailEvent?.trangThai === "tuChoi" && "Đã từ chối"}
                    </Typography>
                </DialogHeader>

                {detailEvent && (
                    <DialogBody
                        divider
                        className="overflow-y-auto max-h-[50vh] md:max-h-[65vh] p-4 md:p-6"
                    >
                        <div className="grid gap-4 md:gap-6">
                            <div className="bg-blue-gray-50 p-4 md:p-6 rounded-lg">
                                <div className="text-center mb-6">
                                    <Typography
                                        variant="h4"
                                        color="blue"
                                        className="font-bold mb-2"
                                    >
                                        {detailEvent.ten}
                                    </Typography>
                                    <Typography
                                        variant="small"
                                        className="bg-white px-4 py-2 rounded-full text-blue-900 inline-block font-medium"
                                    >
                                        {clubs.find((c) =>
                                            c._id === detailEvent.club
                                        )?.ten}
                                    </Typography>
                                </div>

                                <div className="grid gap-4">
                                    <div className="bg-white p-4 rounded-lg">
                                        <Typography className="text-sm text-gray-600 mb-2">
                                            Thời gian tổ chức
                                        </Typography>
                                        <div className="flex flex-col gap-1">
                                            <Typography className="font-medium">
                                                {new Date(
                                                    detailEvent.ngayToChuc,
                                                ).toLocaleDateString("vi-VN", {
                                                    weekday: "long",
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </Typography>
                                            <Typography className="text-blue-900">
                                                {detailEvent.thoiGianBatDau} -
                                                {" "}
                                                {detailEvent.thoiGianKetThuc}
                                            </Typography>
                                        </div>
                                    </div>

                                    <div className="bg-white p-4 rounded-lg">
                                        <Typography className="text-sm text-gray-600 mb-1">
                                            Địa điểm
                                        </Typography>
                                        <Typography className="font-medium">
                                            {detailEvent.diaDiem}
                                        </Typography>
                                    </div>

                                    <div className="bg-white p-4 rounded-lg">
                                        <Typography className="text-sm text-gray-600 mb-1">
                                            Người phụ trách
                                        </Typography>
                                        <Typography className="font-medium">
                                            {detailEvent.nguoiPhuTrach}
                                        </Typography>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-gray-50 p-4 rounded-lg">
                                <Typography className="text-sm text-gray-600 mb-2">
                                    Nội dung sự kiện
                                </Typography>
                                <Typography className="font-medium whitespace-pre-line">
                                    {detailEvent.noiDung}
                                </Typography>
                            </div>

                            <div className="bg-blue-gray-50 p-4 rounded-lg">
                                <Typography className="text-sm text-gray-600 mb-2">
                                    Danh sách khách mời
                                </Typography>
                                <div className="flex flex-wrap gap-2">
                                    {detailEvent.khachMoi.map((
                                        guest,
                                        index,
                                    ) => (
                                        <div
                                            key={index}
                                            className="bg-white px-3 py-1 rounded-full text-sm font-medium"
                                        >
                                            {guest}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {detailEvent &&
                                detailEvent.trangThai === "tuChoi" && (
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
