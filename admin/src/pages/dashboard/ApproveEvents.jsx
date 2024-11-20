import React, { useEffect, useMemo, useState } from "react";
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
    IconButton,
    Input,
    Option,
    Select,
    Spinner,
    Tooltip,
    Typography,
} from "@material-tailwind/react";
import {
    CheckCircleIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    EyeIcon,
    XCircleIcon,
    XMarkIcon,
} from "@heroicons/react/24/solid";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { message, notification } from "antd";
import { useMaterialTailwindController } from "@/context/useMaterialTailwindController";

const API_URL = "http://4.242.20.80:5500/api";

const ApproveEvents = () => {
    const [events, setEvents] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // Mặc định là 'all'
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [detailEvent, setDetailEvent] = useState(null);
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [activeTab, setActiveTab] = useState("list");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClub, setSelectedClub] = useState("");
    const [dateRange, setDateRange] = useState({
        from: "",
        to: "",
    });
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [conflictingEvents, setConflictingEvents] = useState([]);
    const [eventToApprove, setEventToApprove] = useState(null);

    // Lấy controller từ context & màu hiện tại của sidenav
    const [controller] = useMaterialTailwindController();
    const { sidenavColor } = controller;

    useEffect(() => {
        fetchEvents();
        fetchClubs();
    }, []);

    const fetchEvents = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_URL}/get-events`);
            const sortedEvents = response.data.sort((a, b) =>
                new Date(b.ngayToChuc) - new Date(a.ngayToChuc)
            );
            setEvents(sortedEvents);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchClubs = async () => {
        try {
            const response = await axios.get(`${API_URL}/get-clubs`);
            console.log("Clubs data:", response.data);
            setClubs(response.data);
        } catch (error) {
            console.error("Error fetching clubs:", error);
        }
    };

    const handleApproveEvent = async (id) => {
        const eventToCheck = events.find((event) => event._id === id);
        const conflicts = checkEventConflicts(eventToCheck);

        if (conflicts.length > 0) {
            setConflictingEvents(conflicts);
            setEventToApprove(eventToCheck);
            setIsConfirmDialogOpen(true);
        } else {
            await approveEvent(id);
        }
    };

    const approveEvent = async (id) => {
        try {
            await axios.put(`${API_URL}/approve-event/${id}`);
            fetchEvents();
            setIsConfirmDialogOpen(false);
            setConflictingEvents([]);
            setEventToApprove(null);
        } catch (error) {
            console.error("Error approving event:", error);
            notification.error({
                message: "Lỗi khi phê duyệt sự kiện!",
                description: error.response?.data?.message || "Không xác định",
            })
        }
    };

    const handleRejectEvent = async () => {
        try {
            await axios.put(`${API_URL}/reject-event/${selectedEventId}`, {
                lyDoTuChoi: rejectReason,
            });
            setIsRejectDialogOpen(false);
            setRejectReason("");
            fetchEvents();
        } catch (error) {
            console.error("Error rejecting event:", error);
            // alert(
            //     `Lỗi khi từ chối sự kiện: ${
            //         error.response?.data?.message || "Không xác định"
            //     }`,
            // );
            notification.error({
                message: `Lỗi khi từ chối sự kiện!`,
                description: error.response?.data?.message || "Không xác định",
            });
        }
    };

    const openDetailDialog = (id) => {
        const eventDetail = events.find((event) => event._id === id);
        if (eventDetail) {
            setDetailEvent(eventDetail);
            setIsDetailDialogOpen(true);
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

    const getStatusText = (status) => {
        switch (status) {
            case "daDuyet":
                return "Đã duyệt";
            case "tuChoi":
                return "Từ chối";
            case "choDuyet":
                return "Chờ duyệt";
            default:
                return "Không xác định";
        }
    };

    // Đảm bảo filteredEvents trả về tất cả events khi filter là 'all'
    const filteredEvents = useMemo(() => {
        return events
            .filter((event) => {
                // Lọc theo trạng thái
                if (filter !== "all" && event.trangThai !== filter) {
                    return false;
                }

                // Lọc theo tên
                if (
                    searchTerm &&
                    !event.ten.toLowerCase().includes(searchTerm.toLowerCase())
                ) return false;

                // Lọc theo câu lạc bộ
                if (selectedClub && event.club?.ten !== selectedClub) {
                    return false;
                }

                // Lọc theo ngày
                if (
                    dateRange.from &&
                    new Date(event.ngayToChuc) < new Date(dateRange.from)
                ) return false;
                if (
                    dateRange.to &&
                    new Date(event.ngayToChuc) > new Date(dateRange.to)
                ) return false;

                return true;
            });
    }, [events, filter, searchTerm, selectedClub, dateRange]);

    const fetchPendingEvents = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_URL}/get-pending-events`);
            setEvents(response.data);
        } catch (error) {
            console.error("Error fetching pending events:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Thêm hàm mở dialog từ chối
    const openRejectDialog = (id) => {
        setSelectedEventId(id);
        setRejectReason("");
        setIsRejectDialogOpen(true);
    };

    // Tính toán events cho trang hiện tại
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEvents = filteredEvents.slice(
        indexOfFirstItem,
        indexOfLastItem,
    );
    const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

    // Reset trang khi thay đổi bộ lọc
    useEffect(() => {
        setCurrentPage(1);
    }, [filter]);

    // Thêm custom styles cho calendar
    const calendarCustomStyles = {
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
    };

    const getCalendarEvents = useMemo(() => {
        return events
            .filter((event) => event.trangThai === "daDuyet")
            .map((event) => ({
                id: event._id,
                title: event.ten,
                start: `${
                    event.ngayToChuc.split("T")[0]
                }T${event.thoiGianBatDau}`,
                end: `${
                    event.ngayToChuc.split("T")[0]
                }T${event.thoiGianKetThuc}`,
                location: event.diaDiem,
                className: "bg-green-500 text-white rounded-md p-1",
                extendedProps: {
                    club: event.club?.ten || event.club,
                    nguoiPhuTrach: event.nguoiPhuTrach,
                },
            }));
    }, [events]);

    const handleEventClick = (clickInfo) => {
        const eventId = clickInfo.event.id;
        openDetailDialog(eventId);
    };

    const truncateWords = (str, numWords) => {
        const words = str.split(" ");
        if (words.length > numWords) {
            return words.slice(0, numWords).join(" ") + "...";
        }
        return str;
    };

    // Hàm kiểm tra xem có sự kiện nào trùng lịch không
    const checkEventConflicts = (eventToCheck) => {
        return events.filter((event) => {
            if (
                event._id === eventToCheck._id || event.trangThai !== "daDuyet"
            ) return false;

            const sameDate =
                event.ngayToChuc.split("T")[0] ===
                    eventToCheck.ngayToChuc.split("T")[0];
            if (!sameDate) return false;

            // Chuyển đổi thời gian sang minutes để dễ so sánh
            const convertTimeToMinutes = (time) => {
                const [hours, minutes] = time.split(":").map(Number);
                return hours * 60 + minutes;
            };

            const event1Start = convertTimeToMinutes(
                eventToCheck.thoiGianBatDau,
            );
            const event1End = convertTimeToMinutes(
                eventToCheck.thoiGianKetThuc,
            );
            const event2Start = convertTimeToMinutes(event.thoiGianBatDau);
            const event2End = convertTimeToMinutes(event.thoiGianKetThuc);

            // Kiểm tra xem có overlap về thời gian không
            return (
                (event1Start >= event2Start && event1Start < event2End) ||
                (event1End > event2Start && event1End <= event2End) ||
                (event1Start <= event2Start && event1End >= event2End)
            );
        });
    };

    return (
        <div className="flex flex-col gap-12 mt-12 mb-8">
            <Card>
                <CardHeader
                    variant="gradient"
                    color={sidenavColor}
                    className="p-6 mb-8"
                >
                    <Typography variant="h6" color="white">
                        Danh sách sự kiện
                    </Typography>
                </CardHeader>
                <CardBody className="px-0 pt-4 pb-2 overflow-auto">
                    {/* Thay thế phần search và filter cũ bằng giao diện mới */}
                    <div className="flex flex-wrap items-center justify-between gap-4 p-4 px-6">
                        {/* Cột trái - Tìm kiếm và các bộ lọc */}
                        <div className="flex flex-wrap items-center gap-4">
                            {/* Thanh tìm kiếm */}
                            <div className="w-72">
                                <Input
                                    label="Tìm kiếm theo tên sự kiện"
                                    icon={<i className="fas fa-search" />}
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Select box câu lạc bộ */}
                            <div className="w-48">
                                <Select
                                    label="Câu lạc bộ"
                                    value={selectedClub}
                                    onChange={(value) => setSelectedClub(value)}
                                >
                                    <Option value="">Tất cả CLB</Option>
                                    {clubs.map((club) => (
                                        <Option key={club._id} value={club.ten}>
                                            {club.ten}
                                        </Option>
                                    ))}
                                </Select>
                            </div>

                            {/* Bộ lọc ngày */}
                            <div className="flex items-center gap-2">
                                <div>
                                    <Input
                                        type="date"
                                        label="Từ ngày"
                                        value={dateRange.from}
                                        onChange={(e) =>
                                            setDateRange((prev) => ({
                                                ...prev,
                                                from: e.target.value,
                                            }))}
                                    />
                                </div>
                                <div>
                                    <Input
                                        type="date"
                                        label="Đến ngày"
                                        value={dateRange.to}
                                        onChange={(e) =>
                                            setDateRange((prev) => ({
                                                ...prev,
                                                to: e.target.value,
                                            }))}
                                    />
                                </div>

                                {/* Nút reset tất cả bộ lọc */}
                                {(dateRange.from || dateRange.to ||
                                    selectedClub || searchTerm) && (
                                    <Button
                                        variant="text"
                                        color="red"
                                        className="p-2"
                                        onClick={() => {
                                            setDateRange({ from: "", to: "" });
                                            setSelectedClub("");
                                            setSearchTerm("");
                                        }}
                                    >
                                        <XMarkIcon className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Cột phải - Nút chuyển đổi view */}
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
                                <i className="fas fa-list"></i>
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
                                <i className="fas fa-calendar"></i>
                                Lịch
                            </Button>
                        </div>
                    </div>

                    {/* Hiển thị kết quả tìm kiếm và lọc */}
                    {(searchTerm || dateRange.from || dateRange.to ||
                        selectedClub) && (
                        <div className="px-6 mb-4">
                            <Typography variant="small" color="blue-gray">
                                Tìm thấy {filteredEvents.length} kết quả
                                {searchTerm && ` cho "${searchTerm}"`}
                                {selectedClub && ` tại "${selectedClub}"`}
                                {dateRange.from &&
                                    ` từ ${
                                        new Date(dateRange.from)
                                            .toLocaleDateString("vi-VN")
                                    }`}
                                {dateRange.to &&
                                    ` đến ${
                                        new Date(dateRange.to)
                                            .toLocaleDateString("vi-VN")
                                    }`}
                            </Typography>
                        </div>
                    )}

                    {/* Status Filter Buttons - Di chuyển xuống dưới phần tìm kiếm */}
                    <div className="flex flex-wrap gap-2 px-6 mb-4">
                        <Button
                            variant={filter === "all" ? "gradient" : "outlined"}
                            color="blue"
                            size="sm"
                            onClick={() => setFilter("all")}
                            className="flex items-center gap-2"
                        >
                            <i className="fas fa-list text-sm"></i>
                            Tất cả
                        </Button>
                        <Button
                            variant={filter === "choDuyet"
                                ? "gradient"
                                : "outlined"}
                            color="orange"
                            size="sm"
                            onClick={() => setFilter("choDuyet")}
                            className="flex items-center gap-2"
                        >
                            <i className="fas fa-clock text-sm"></i>
                            Chờ duyệt
                        </Button>
                        <Button
                            variant={filter === "daDuyet"
                                ? "gradient"
                                : "outlined"}
                            color="green"
                            size="sm"
                            onClick={() => setFilter("daDuyet")}
                            className="flex items-center gap-2"
                        >
                            <i className="fas fa-check text-sm"></i>
                            Đã duyệt
                        </Button>
                        <Button
                            variant={filter === "tuChoi"
                                ? "gradient"
                                : "outlined"}
                            color="red"
                            size="sm"
                            onClick={() => setFilter("tuChoi")}
                            className="flex items-center gap-2"
                        >
                            <i className="fas fa-times text-sm"></i>
                            Từ chối
                        </Button>
                    </div>

                    {activeTab === "list"
                        ? (
                            // List view
                            <div className="px-4">
                                    {isLoading
                                    ? (
                                        <div className="flex justify-center items-center p-8">
                                            <Spinner
                                                className="h-12 w-12"
                                                color="pink"
                                            />
                                        </div>
                            ) : filteredEvents.length === 0 ? (
                                <div className="flex items-center justify-center h-64">
                                    <Typography variant="h6" color="blue-gray" className="font-normal">
                                        Hiện tại chưa có sự kiện nào từ câu lạc bộ
                                    </Typography>
                                </div>
                                    )
                                    : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full min-w-[640px] table-auto">
                                                <thead>
                                                    <tr>
                                                        {[
                                                            "STT",
                                                            "Tên sự kiện",
                                                            "CLB tổ chức",
                                                            "Ngày tổ chức",
                                                            "Địa điểm",
                                                            "Trạng thái",
                                                            "Thao tác",
                                                        ].map((head) => (
                                                            <th
                                                                key={head}
                                                                className="border-b border-blue-gray-50 py-3 px-5 text-left"
                                                            >
                                                                <Typography
                                                                    variant="small"
                                                                    className="text-[11px] font-bold uppercase text-blue-gray-400"
                                                                >
                                                                    {head}
                                                                </Typography>
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentEvents.map(
                                                        (event, index) => {
                                                            const isLast =
                                                                event ===
                                                                    currentEvents[
                                                                        currentEvents
                                                                            .length -
                                                                        1
                                                                    ];
                                                            const classes =
                                                                isLast
                                                                    ? "p-4"
                                                                    : "p-4 border-b border-blue-gray-50";

                                                            return (
                                                                <tr
                                                                    key={event
                                                                        ._id}
                                                                >
                                                                    <td className="py-3 px-5">
                                                                        <Typography className="text-sm font-semibold text-blue-gray-600">
                                                                            {(currentPage -
                                                                                        1) *
                                                                                    itemsPerPage +
                                                                                index +
                                                                                1}
                                                                        </Typography>
                                                                    </td>
                                                                    <td className="py-3 px-5">
                                                                        <Tooltip
                                                                            content={event
                                                                                .ten}
                                                                        >
                                                                            <Typography className="text-sm font-semibold text-blue-gray-600">
                                                                                {truncateWords(
                                                                                    event
                                                                                        .ten,
                                                                                    10,
                                                                                )}
                                                                            </Typography>
                                                                        </Tooltip>
                                                                    </td>
                                                                    <td className="py-3 px-5">
                                                                        <Typography className="text-sm font-semibold text-blue-gray-600">
                                                                            {event
                                                                                    .club &&
                                                                                    typeof event
                                                                                            .club ===
                                                                                        "object"
                                                                                ? event
                                                                                    .club
                                                                                    .ten
                                                                                : event
                                                                                    .club}
                                                                        </Typography>
                                                                    </td>
                                                                    <td className="py-3 px-5">
                                                                        <div className="flex flex-col">
                                                                            <Typography className="text-sm font-semibold text-blue-gray-600">
                                                                                {new Date(
                                                                                    event
                                                                                        .ngayToChuc,
                                                                                ).toLocaleDateString(
                                                                                    "vi-VN",
                                                                                )}
                                                                            </Typography>
                                                                            <div className="flex items-center gap-2 mt-1">
                                                                                <div className="w-1 h-1 rounded-full bg-blue-gray-300">
                                                                                </div>
                                                                                <Typography className="text-xs text-blue-gray-500">
                                                                                    {event
                                                                                        .thoiGianBatDau}
                                                                                    {" "}
                                                                                    -
                                                                                    {" "}
                                                                                    {event
                                                                                        .thoiGianKetThuc}
                                                                                </Typography>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="py-3 px-5">
                                                                        <Typography className="text-sm font-semibold text-blue-gray-600">
                                                                            {event
                                                                                .diaDiem}
                                                                        </Typography>
                                                                    </td>
                                                                    <td className="py-3 px-5">
                                                                        <div className="w-max">
                                                                            <Typography
                                                                                className="text-sm font-semibold"
                                                                                color={getStatusColor(
                                                                                    event
                                                                                        .trangThai,
                                                                                )}
                                                                            >
                                                                                {getStatusText(
                                                                                    event
                                                                                        .trangThai,
                                                                                )}
                                                                            </Typography>
                                                                        </div>
                                                                    </td>
                                                                    <td className="py-3 px-5">
                                                                        <div className="flex gap-2">
                                                                            <Tooltip content="Xem chi tiết">
                                                                                <IconButton
                                                                                    variant="text"
                                                                                    color={sidenavColor}
                                                                                    onClick={() =>
                                                                                        openDetailDialog(
                                                                                            event
                                                                                                ._id,
                                                                                        )}
                                                                                >
                                                                                    <EyeIcon className="h-4 w-4" />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                            {event
                                                                                        .trangThai ===
                                                                                    "choDuyet" &&
                                                                                (
                                                                                    <>
                                                                                        <Tooltip content="Phê duyệt">
                                                                                            <IconButton
                                                                                                variant="text"
                                                                                                color="green"
                                                                                                onClick={() =>
                                                                                                    handleApproveEvent(
                                                                                                        event
                                                                                                            ._id,
                                                                                                    )}
                                                                                            >
                                                                                                <CheckCircleIcon className="h-4 w-4" />
                                                                                            </IconButton>
                                                                                        </Tooltip>
                                                                                        <Tooltip content="Từ chối">
                                                                                            <IconButton
                                                                                                variant="text"
                                                                                                color="red"
                                                                                                onClick={() =>
                                                                                                    openRejectDialog(
                                                                                                        event
                                                                                                            ._id,
                                                                                                    )}
                                                                                            >
                                                                                                <XCircleIcon className="h-4 w-4" />
                                                                                            </IconButton>
                                                                                        </Tooltip>
                                                                                    </>
                                                                                )}
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        },
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                {/* Pagination */}
                            {filteredEvents.length > 0 && (
                                    <div className="flex items-center gap-4 justify-center mt-4">
                                        <Button
                                            variant="text"
                                            className="flex items-center gap-2"
                                            onClick={() =>
                                            setCurrentPage(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeftIcon
                                            strokeWidth={2}
                                            className="h-4 w-4"
                                        />{" "}
                                        Trước
                                        </Button>
    
                                        <div className="flex items-center gap-2">
                                            {[...Array(totalPages)].map((
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
                                                    setCurrentPage(index + 1)}
                                                    className="w-10 h-10"
                                                >
                                                    {index + 1}
                                                </Button>
                                            ))}
                                        </div>

                                    <Button
                                        variant="text"
                                        className="flex items-center gap-2"
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Sau <ChevronRightIcon strokeWidth={2} className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Calendar view
                        <div className="p-4 min-h-[800px]">
                            <style>
                                {Object.entries(calendarCustomStyles)
                                    .map(([selector, styles]) => `${selector} { ${styles.split(' ').map(c => `@apply ${c};`).join(' ')} }`)
                                    .join('\n')}
                            </style>
                            <FullCalendar
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                initialView="dayGridMonth"
                                headerToolbar={{
                                    left: 'prev,next today',
                                    center: 'title',
                                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                                }}
                                events={getCalendarEvents}
                                eventClick={handleEventClick}
                                eventTimeFormat={{
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false
                                }}
                                locale="vi"
                                buttonText={{
                                    today: 'Hôm nay',
                                    month: 'Tháng',
                                    week: 'Tuần',
                                    day: 'Ngày'
                                }}
                                eventContent={(eventInfo) => (
                                    <Tooltip
                                        content={
                                            <div className="p-2">
                                                <div className="font-bold mb-1">{eventInfo.event.title}</div>
                                                <div className="text-sm">
                                                    <div>Thời gian: {eventInfo.timeText}</div>
                                                    <div>Địa điểm: {eventInfo.event.extendedProps.location}</div>
                                                    <div>CLB: {eventInfo.event.extendedProps.club}</div>
                                                </div>
                                            </div>
                                        }
                                        animate={{
                                            mount: { scale: 1, y: 0 },
                                            unmount: { scale: 0, y: 25 },
                                        }}
                                    >
                                        <div className="p-1">
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

            {/* Dialog xem chi tiết sự kiện */}
            <Dialog
                open={isDetailDialogOpen}
                handler={() => setIsDetailDialogOpen(false)}
                size="lg"
                className="min-w-[80%]"
            >
                <DialogHeader className="text-2xl font-bold">
                    Chi tiết Sự kiện
                </DialogHeader>
                {detailEvent && (
                    <DialogBody divider className="h-[70vh] overflow-y-auto">
                        <div className="grid gap-6">
                            {/* Thông tin cơ bản */}
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th
                                            colSpan="4"
                                            className="bg-blue-50 p-3 text-left text-lg font-bold text-blue-900"
                                        >
                                            Thông tin cơ bản
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th className="border p-3 bg-gray-50 w-1/4">
                                            Tên sự kiện
                                        </th>
                                        <td className="border p-3" colSpan="3">
                                            {detailEvent.ten}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="border p-3 bg-gray-50">
                                            Ngày tổ chc
                                        </th>
                                        <td className="border p-3">
                                            {new Date(detailEvent.ngayToChuc)
                                                .toLocaleDateString()}
                                        </td>
                                        <th className="border p-3 bg-gray-50">
                                            Thời gian
                                        </th>
                                        <td className="border p-3">
                                            {`${detailEvent.thoiGianBatDau} - ${detailEvent.thoiGianKetThuc}`}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="border p-3 bg-gray-50">
                                            Địa điểm
                                        </th>
                                        <td className="border p-3">
                                            {detailEvent.diaDiem}
                                        </td>
                                        <th className="border p-3 bg-gray-50">
                                            Người ph trách
                                        </th>
                                        <td className="border p-3">
                                            {detailEvent.nguoiPhuTrach}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="border p-3 bg-gray-50">
                                            CLB tổ chức
                                        </th>
                                        <td className="border p-3">
                                            {detailEvent.club &&
                                                    typeof detailEvent.club ===
                                                        "object"
                                                ? detailEvent.club.ten
                                                : typeof detailEvent.club ===
                                                        "string"
                                                ? detailEvent.club
                                                : "Không xác định"}
                                        </td>
                                        <th className="border p-3 bg-gray-50">
                                            Trạng thái
                                        </th>
                                        <td className="border p-3">
                                            <Typography
                                                className="font-semibold"
                                                color={getStatusColor(
                                                    detailEvent.trangThai,
                                                )}
                                            >
                                                {getStatusText(
                                                    detailEvent.trangThai,
                                                )}
                                            </Typography>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Nội dung sự kiện */}
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="bg-blue-50 p-3 text-left text-lg font-bold text-blue-900">
                                            Nội dung sự kiện
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border p-3 whitespace-pre-line">
                                            {detailEvent.noiDung}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Thông tin khác */}
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th
                                            colSpan="2"
                                            className="bg-blue-50 p-3 text-left text-lg font-bold text-blue-900"
                                        >
                                            Thông tin khác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th className="border p-3 bg-gray-50">
                                            Khách mời
                                        </th>
                                        <td className="border p-3">
                                            {detailEvent.khachMoi.join(", ") ||
                                                "Không có"}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Lý do từ chối (nếu có) */}
                            {detailEvent.trangThai === "tuChoi" &&
                                detailEvent.lyDoTuChoi && (
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="bg-red-50 p-3 text-left text-lg font-bold text-red-900">
                                                Lý do từ chối
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border p-3 text-red-600">
                                                {detailEvent.lyDoTuChoi}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            )}
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

            {/* Dialog từ chối */}
            <Dialog
                open={isRejectDialogOpen}
                handler={() => setIsRejectDialogOpen(false)}
            >
                <DialogHeader>Từ chối sự kiện</DialogHeader>
                <DialogBody divider>
                    <div className="grid gap-6">
                        <Typography color="gray" className="font-normal">
                            Vui lòng nhập lý do từ chối sự kiện này:
                        </Typography>
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            rows="4"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Nhập lý do từ chối..."
                        />
                    </div>
                </DialogBody>
                <DialogFooter className="space-x-2">
                    <Button
                        variant="text"
                        color="gray"
                        onClick={() => setIsRejectDialogOpen(false)}
                    >
                        Hủy
                    </Button>
                    <Button
                        color="red"
                        onClick={handleRejectEvent}
                        disabled={!rejectReason.trim()}
                    >
                        Xác nhận từ chối
                    </Button>
                </DialogFooter>
            </Dialog>

            {/* Dialog xác nhận khi có sự kiện trùng lịch */}
            <Dialog
                open={isConfirmDialogOpen}
                handler={() => setIsConfirmDialogOpen(false)}
            >
                <DialogHeader>Cảnh báo trùng lịch sự kiện</DialogHeader>
                <DialogBody divider className="max-h-[60vh] overflow-auto">
                    <div className="space-y-4">
                        <Typography color="red" className="font-medium">
                            Hiện có {conflictingEvents.length}{" "}
                            sự kiện đã được duyệt trùng lịch:
                        </Typography>

                        {/* Hiển thị thông tin sự kiện cần duyệt */}
                        {eventToApprove && (
                            <div className="bg-blue-50 p-4 rounded-lg mb-4">
                                <Typography className="font-bold mb-2">
                                    Sự kiện cần duyệt:
                                </Typography>
                                <div className="space-y-1">
                                    <Typography className="text-sm">
                                        Tên: {eventToApprove.ten}
                                    </Typography>
                                    <Typography className="text-sm">
                                        Thời gian:{" "}
                                        {eventToApprove.thoiGianBatDau} -{" "}
                                        {eventToApprove.thoiGianKetThuc}
                                    </Typography>
                                    <Typography className="text-sm">
                                        Địa điểm: {eventToApprove.diaDiem}
                                    </Typography>
                                </div>
                            </div>
                        )}

                        {/* Danh sách các sự kiện bị trùng */}
                        <div className="space-y-2">
                            <Typography className="font-medium">
                                Các sự kiện trùng lịch:
                            </Typography>
                            {conflictingEvents.map((event, index) => (
                                <div
                                    key={event._id}
                                    className="bg-red-50 p-3 rounded-lg"
                                >
                                    <Typography className="font-medium">
                                        {event.ten}
                                    </Typography>
                                    <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
                                        <Typography>
                                            Thời gian: {event.thoiGianBatDau} -
                                            {" "}
                                            {event.thoiGianKetThuc}
                                        </Typography>
                                        <Typography>
                                            Địa điểm: {event.diaDiem}
                                        </Typography>
                                        <Typography>
                                            CLB:{" "}
                                            {event.club?.ten ||
                                                    typeof event.club ===
                                                        "string"
                                                ? event.club
                                                : "N/A"}
                                        </Typography>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Typography color="red" className="font-medium mt-4">
                            Bạn có chắc chắn muốn duyệt sự kiện này không?
                        </Typography>
                    </div>
                </DialogBody>
                <DialogFooter className="space-x-2">
                    <Button
                        variant="text"
                        color="red"
                        onClick={() => setIsConfirmDialogOpen(false)}
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="gradient"
                        color="green"
                        onClick={() => approveEvent(eventToApprove._id)}
                    >
                        Xác nhận duyệt
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default ApproveEvents;
