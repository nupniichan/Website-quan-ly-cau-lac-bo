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
} from "@heroicons/react/24/solid";

const API_URL = "http://localhost:5500/api";

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
                                    {filteredEvents.map(({
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
                                            index === filteredEvents.length - 1
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
                        )}
                </CardBody>
            </Card>

            {/* Dialog xem chi tiết sự kiện */}
            <Dialog
                open={isDetailDialogOpen}
                handler={() => setIsDetailDialogOpen(false)}
                size="md"
            >
                <DialogHeader className="lg:text-2xl md:text-xl sm:text-base">
                    Chi tiết Sự kiện
                </DialogHeader>
                {detailEvent && (
                    <DialogBody
                        divider
                        className="grid grid-cols-2 gap-4  overflow-y-auto lg:max-h-[60vh] sm:max-h-[45vh]"
                    >
                        <Typography>Tên sự kiện: {detailEvent.ten}</Typography>
                        <Typography>
                            Ngày tổ chức: {new Date(detailEvent.ngayToChuc)
                                .toLocaleDateString()}
                        </Typography>
                        <Typography>
                            Thời gian:{" "}
                            {`${detailEvent.thoiGianBatDau} - ${detailEvent.thoiGianKetThuc}`}
                        </Typography>
                        <Typography>Địa điểm: {detailEvent.diaDiem}</Typography>
                        <Typography className="col-span-2">
                            Nội dung: {detailEvent.noiDung}
                        </Typography>
                        <Typography>
                            Ngân sách chi tiêu:{" "}
                            {detailEvent.nganSachChiTieu.toLocaleString()} VND
                        </Typography>
                        <Typography>
                            Người phụ trách: {detailEvent.nguoiPhuTrach}
                        </Typography>
                        <Typography className="col-span-2">
                            Khách mời: {detailEvent.khachMoi.join(", ")}{" "}
                            {/* Hiển thị danh sách khách mời */}
                        </Typography>
                        <Typography>
                            Câu lạc bộ: {detailEvent.club &&
                                    typeof detailEvent.club === "object"
                                ? detailEvent.club.ten
                                : typeof detailEvent.club === "string"
                                ? detailEvent.club
                                : "Không xác định"}
                        </Typography>
                        <Typography>
                            Trạng thái:{" "}
                            <span
                                className={`text-${
                                    getStatusColor(detailEvent.trangThai)
                                }-500`}
                            >
                                {getStatusText(detailEvent.trangThai)}
                            </span>
                        </Typography>
                        {detailEvent && detailEvent.trangThai === "tuChoi" &&
                            detailEvent.lyDoTuChoi && (
                            <div className="col-span-1 md:col-span-2">
                                <Typography
                                    variant="h6"
                                    color="red"
                                    className="mb-4"
                                >
                                    Lý do từ chối
                                </Typography>
                                <div className="p-4 rounded-lg bg-red-50">
                                    <Typography className="text-red-600">
                                        {detailEvent.lyDoTuChoi}
                                    </Typography>
                                </div>
                            </div>
                        )}
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
