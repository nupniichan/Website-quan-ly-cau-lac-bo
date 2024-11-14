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
    Spinner,
    Tooltip,
    Typography,
} from "@material-tailwind/react";
import {
    CheckCircleIcon,
    EyeIcon,
    XCircleIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "@heroicons/react/24/solid";

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

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setIsLoading(true);
        try {
            console.log("Đang gọi API...");
            const response = await axios.get(`${API_URL}/get-events`);
            console.log("Dữ liệu nhận được:", response.data);
            console.log(
                "Chi tiết club của event đầu tiên:",
                response.data[0]?.club,
            );
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
            setClubs(response.data);
        } catch (error) {
            console.error("Error fetching clubs:", error);
        }
    };

    const handleApproveEvent = async (id) => {
        try {
            await axios.put(`${API_URL}/approve-event/${id}`);
            // Fetch lại dữ liệu sau khi approve
            fetchEvents(); // Thay vì fetchPendingEvents()
        } catch (error) {
            console.error("Error approving event:", error);
            alert(
                `Lỗi khi phê duyệt sự kiện: ${
                    error.response?.data?.message || "Không xác định"
                }`,
            );
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
            alert(
                `Lỗi khi từ chối sự kiện: ${
                    error.response?.data?.message || "Không xác định"
                }`,
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
        if (filter === "all") return events;
        return events.filter((event) => event.trangThai === filter);
    }, [events, filter]);

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
    const currentEvents = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

    // Reset trang khi thay đổi bộ lọc
    useEffect(() => {
        setCurrentPage(1);
    }, [filter]);

    return (
        <div className="flex flex-col gap-12 mt-12 mb-8">
            <Card>
                <CardHeader
                    variant="gradient"
                    color="blue"
                    className="p-6 mb-8"
                >
                    <Typography variant="h6" color="white">
                        Danh sách sự kiện
                    </Typography>
                </CardHeader>
                <CardBody className="px-0 pt-0 pb-2 overflow-auto">
                    <div className="flex gap-3 p-4">
                        <Button
                            variant={filter === "all"
                                    ? "gradient"
                                    : "outlined"}
                            // color={filter === "all" ? "blue" : "white"}
                            color= "blue"
                            size="sm"
                            onClick={() => setFilter("all")}
                        >
                            Tất cả
                        </Button>

                        <Button
                            variant={filter === "choDuyet"
                                    ? "gradient"
                                    : "outlined"}
                            // color={filter === "choDuyet" ? "blue" : "blue-gray"}
                            color= "blue"
                            size="sm"
                            onClick={() => setFilter("choDuyet")}
                        >
                            Chờ duyệt
                        </Button>

                        <Button
                            variant={filter === "daDuyet"
                                    ? "gradient"
                                    : "outlined"}
                            // color={filter === "daDuyet" ? "blue" : "blue-gray"}
                            color= "blue"
                            size="sm"
                            onClick={() => setFilter("daDuyet")}
                        >
                            Đã duyệt
                        </Button>

                        <Button
                            variant={filter === "tuChoi"
                                    ? "gradient"
                                    : "outlined"}
                            // color={filter === "tuChoi" ? "blue" : "blue-gray"}
                            color= "blue"
                            size="sm"
                            onClick={() => setFilter("tuChoi")}
                        >
                            Đã từ chối
                        </Button>
                    </div>
                    {isLoading
                        ? (
                            <div className="flex items-center justify-center h-64">
                                <Spinner className="w-12 h-12" color="blue" />
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
                                                "Thời gian",
                                                "Địa điểm",
                                                "Người phụ trách",
                                                "CLB",
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
                                            club,
                                            khachMoi,
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
                                                        <Typography className="text-xs font-semibold text-blue-gray-600">
                                                            {new Date(ngayToChuc)
                                                                .toLocaleDateString()}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography className="text-xs font-semibold text-blue-gray-600">
                                                            {`${thoiGianBatDau} - ${thoiGianKetThuc}`}
                                                        </Typography>
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
                                                        <Typography className="text-xs font-semibold text-blue-gray-600">
                                                            {club &&
                                                                    typeof club ===
                                                                        "object"
                                                            ? club.ten
                                                            : typeof club ===
                                                                    "string"
                                                            ? club
                                                            : "Không xác định"}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography
                                                            className="text-xs font-semibold"
                                                            color={getStatusColor(
                                                                trangThai,
                                                            )}
                                                        >
                                                            {getStatusText(
                                                                trangThai,
                                                            )}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <div className="flex items-center gap-2">
                                                            {trangThai ===
                                                                    "choDuyet" && (
                                                                <>
                                                                    <Button
                                                                        size="sm"
                                                                        color="green"
                                                                        className="flex items-center gap-2"
                                                                        onClick={() =>
                                                                            handleApproveEvent(
                                                                                _id,
                                                                            )}
                                                                    >
                                                                        <CheckCircleIcon
                                                                            strokeWidth={2}
                                                                            className="w-4 h-4"
                                                                        />
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        color="red"
                                                                        className="flex items-center gap-2"
                                                                        onClick={() =>
                                                                            openRejectDialog(
                                                                                _id,
                                                                            )}
                                                                    >
                                                                        <XCircleIcon
                                                                            strokeWidth={2}
                                                                            className="w-4 h-4"
                                                                        />
                                                                    </Button>
                                                                </>
                                                            )}
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
                                        onClick={() => setCurrentPage(prev => prev - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeftIcon strokeWidth={2} className="h-4 w-4" /> Trước
                                    </Button>

                                    <div className="flex items-center gap-2">
                                        {[...Array(totalPages)].map((_, index) => (
                                            <Button
                                                key={index + 1}
                                                variant={currentPage === index + 1 ? "gradient" : "text"}
                                                color="blue"
                                                onClick={() => setCurrentPage(index + 1)}
                                                className="w-10 h-10"
                                            >
                                                {index + 1}
                                            </Button>
                                        ))}
                                    </div>

                                    <Button
                                        variant="text"
                                        className="flex items-center gap-2"
                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Sau <ChevronRightIcon strokeWidth={2} className="h-4 w-4" />
                                    </Button>
                                </div>
                            </>
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
                                        <th colSpan="4" className="bg-blue-50 p-3 text-left text-lg font-bold text-blue-900">
                                            Thông tin cơ bản
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th className="border p-3 bg-gray-50 w-1/4">Tên sự kiện</th>
                                        <td className="border p-3" colSpan="3">{detailEvent.ten}</td>
                                    </tr>
                                    <tr>
                                        <th className="border p-3 bg-gray-50">Ngày tổ chức</th>
                                        <td className="border p-3">
                                            {new Date(detailEvent.ngayToChuc).toLocaleDateString()}
                                        </td>
                                        <th className="border p-3 bg-gray-50">Thời gian</th>
                                        <td className="border p-3">
                                            {`${detailEvent.thoiGianBatDau} - ${detailEvent.thoiGianKetThuc}`}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="border p-3 bg-gray-50">Địa điểm</th>
                                        <td className="border p-3">{detailEvent.diaDiem}</td>
                                        <th className="border p-3 bg-gray-50">Người phụ trách</th>
                                        <td className="border p-3">{detailEvent.nguoiPhuTrach}</td>
                                    </tr>
                                    <tr>
                                        <th className="border p-3 bg-gray-50">CLB tổ chức</th>
                                        <td className="border p-3">
                                            {detailEvent.club && typeof detailEvent.club === "object"
                                                ? detailEvent.club.ten
                                                : typeof detailEvent.club === "string"
                                                ? detailEvent.club
                                                : "Không xác định"}
                                        </td>
                                        <th className="border p-3 bg-gray-50">Trạng thái</th>
                                        <td className="border p-3">
                                            <Typography
                                                className="font-semibold"
                                                color={getStatusColor(detailEvent.trangThai)}
                                            >
                                                {getStatusText(detailEvent.trangThai)}
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
                                        <th colSpan="2" className="bg-blue-50 p-3 text-left text-lg font-bold text-blue-900">
                                            Thông tin khác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th className="border p-3 bg-gray-50 w-1/4">Ngân sách chi tiêu</th>
                                        <td className="border p-3 font-semibold text-blue-600">
                                            {detailEvent.nganSachChiTieu.toLocaleString()} VND
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="border p-3 bg-gray-50">Khách mời</th>
                                        <td className="border p-3">
                                            {detailEvent.khachMoi.join(", ") || "Không có"}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Lý do từ chối (nếu có) */}
                            {detailEvent.trangThai === "tuChoi" && detailEvent.lyDoTuChoi && (
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
                        color="blue"
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
        </div>
    );
};

export default ApproveEvents;
