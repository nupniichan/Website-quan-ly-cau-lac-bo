import React, { useCallback, useEffect, useState } from "react";
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
    Textarea,
    Tooltip,
    Typography,
} from "@material-tailwind/react";
import {
    EyeIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
} from "@heroicons/react/24/solid";

const API_URL = "http://localhost:5500/api";

const ClubReports = () => {
    const [reports, setReports] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [newReport, setNewReport] = useState({
        tenBaoCao: "",
        ngayBaoCao: "",
        nhanSuPhuTrach: "",
        danhSachSuKien: [],
        tongNganSachChiTieu: 0,
        tongThu: 0,
        ketQuaDatDuoc: "",
        club: "",
    });
    const [detailReport, setDetailReport] = useState(null);
    const [editingReportId, setEditingReportId] = useState(null);
    const [filterClub, setFilterClub] = useState(""); // Thêm state cho bộ lọc

    const fetchClubs = async () => {
        try {
            const response = await axios.get(`${API_URL}/get-clubs`);
            setClubs(response.data);
        } catch (error) {
            console.error("Error fetching clubs:", error);
        }
    };

    const fetchEvents = async () => {
        try {
            const response = await axios.get(`${API_URL}/get-events`);
            setEvents(response.data);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    const fetchReports = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_URL}/get-reports`);
            setReports(response.data);
        } catch (error) {
            console.error("Error fetching reports:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleAddReport = async () => {
        try {
            await axios.post(`${API_URL}/add-report`, newReport);
            setIsDialogOpen(false);
            fetchReports();
        } catch (error) {
            console.error("Error adding report:", error);
        }
    };

    useEffect(() => {
        fetchClubs();
        fetchEvents();
        fetchReports();
    }, []);

    const handleUpdateReport = async () => {
        try {
            await axios.put(
                `${API_URL}/update-report/${editingReportId}`,
                newReport,
            );
            setIsDialogOpen(false);
            fetchReports();
        } catch (error) {
            console.error("Error updating report:", error);
        }
    };

    const handleDeleteReport = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa báo cáo này?")) {
            try {
                await axios.delete(`${API_URL}/delete-report/${id}`);
                fetchReports();
            } catch (error) {
                console.error("Error deleting report:", error);
            }
        }
    };

    const openAddDialog = () => {
        setEditingReportId(null);
        setNewReport({
            tenBaoCao: "",
            ngayBaoCao: "",
            nhanSuPhuTrach: "",
            danhSachSuKien: [],
            tongNganSachChiTieu: 0,
            tongThu: 0,
            ketQuaDatDuoc: "",
            club: "",
        });
        setIsDialogOpen(true);
    };

    const openEditDialog = (id) => {
        const reportToEdit = reports.find((report) => report._id === id);
        setEditingReportId(id);
        setNewReport({ ...reportToEdit });
        setIsDialogOpen(true);
    };

    const openDetailDialog = (id) => {
        const reportDetail = reports.find((report) => report._id === id);
        setDetailReport(reportDetail);
        setIsDetailDialogOpen(true);
    };

    // Thêm hàm lọc báo cáo
    const filteredReports = reports.filter((report) =>
        !filterClub || report.club === filterClub
    );

    return (
        <div className="flex flex-col gap-12 mt-12 mb-8">
            <Card>
                <CardHeader
                    variant="gradient"
                    color="blue"
                    className="p-6 mb-8"
                >
                    <Typography variant="h6" color="white">
                        Báo cáo Câu lạc bộ
                    </Typography>
                </CardHeader>

                <CardBody className="px-0 pt-4 pb-2 overflow-auto">
                    {/* Chỉ giữ lại phần bộ lọc và hiển thị tên câu lạc bộ đã chọn */}
                    <div className="px-6 mb-4">
                        <div className="w-72 absolute z-[60]">
                            {/* NOTE absolute positioning for dropdown options */}
                            <Select
                                label="Lọc theo câu lạc bộ"
                                value={filterClub}
                                onChange={(value) => setFilterClub(value)}
                            >
                                <Option value="" className="bg-transparent">
                                    <strong>Tất cả</strong>
                                </Option>

                                <hr className="my-2 border-t border-gray-300" />

                                {/* NOTE filter dropdown responsive and shiz */}
                                <div className="overflow-y-auto lg:max-h-48 md:max-h-32 sm:max-h-20">
                                    {clubs.map((club) => (
                                        <Option
                                            key={club._id}
                                            value={club._id}
                                            className="bg-transparent"
                                        >
                                            {club.ten}
                                        </Option>
                                    ))}
                                </div>
                            </Select>
                        </div>
                        {filterClub && (
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal translate-x-3 translate-y-[0.61rem] absolute z-0 pointer-events-none"
                                // NOTE alignment and disable interactions for chosen option with the "All" option
                            >
                                {clubs.find((c) => c._id === filterClub)?.ten}
                            </Typography>
                        )}
                    </div>

                    {isLoading
                        ? (
                            <div className="flex items-center justify-center h-64 mt-14">
                                <Spinner className="w-16 h-16 text-blue-500/10" />
                            </div>
                        )
                        : (
                            <table className="w-full min-w-[640px] table-auto mt-14">
                                <thead>
                                    <tr>
                                        {[
                                            "Tên báo cáo",
                                            "Ngày báo cáo",
                                            "Nhân sự phụ trách",
                                            "Câu lạc bộ",
                                            "Hành động",
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
                                    {filteredReports.map(
                                        ({
                                            _id,
                                            tenBaoCao,
                                            ngayBaoCao,
                                            nhanSuPhuTrach,
                                            danhSachSuKien,
                                            danhSachGiai,
                                            tongNganSachChiTieu,
                                            tongThu,
                                            ketQuaDatDuoc,
                                            club,
                                        }, key) => {
                                            const className = `py-3 px-5 ${
                                                key ===
                                                        filteredReports.length -
                                                            1
                                                    ? ""
                                                    : "border-b border-blue-gray-50"
                                            }`;

                                            return (
                                                <tr key={_id}>
                                                    <td className={className}>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-semibold"
                                                        >
                                                            {tenBaoCao}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal"
                                                        >
                                                            {new Date(
                                                                ngayBaoCao,
                                                            ).toLocaleDateString()}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal"
                                                        >
                                                            {nhanSuPhuTrach}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal"
                                                        >
                                                            {clubs.find((c) =>
                                                                c._id === club
                                                            )?.ten || "N/A"}
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
                                        },
                                    )}
                                </tbody>
                            </table>
                        )}
                </CardBody>
            </Card>

            {/* Dialog thêm/sửa báo cáo */}
            <Dialog
                open={isDialogOpen}
                handler={() => setIsDialogOpen(false)}
                size="xl"
            >
                <DialogHeader>
                    {editingReportId ? "Chỉnh sửa Báo cáo" : "Thêm Báo cáo Mới"}
                </DialogHeader>
                <DialogBody divider className="grid grid-cols-2 gap-4">
                    <Input
                        label="Tên báo cáo"
                        value={newReport.tenBaoCao}
                        onChange={(e) => setNewReport({
                            ...newReport,
                            tenBaoCao: e.target.value,
                        })}
                    />
                    <Input
                        type="date"
                        label="Ngày báo cáo"
                        value={newReport.ngayBaoCao}
                        onChange={(e) => setNewReport({
                            ...newReport,
                            ngayBaoCao: e.target.value,
                        })}
                    />
                    <Input
                        label="Nhân sự phụ trách"
                        value={newReport.nhanSuPhuTrach}
                        onChange={(e) => setNewReport({
                            ...newReport,
                            nhanSuPhuTrach: e.target.value,
                        })}
                    />
                    <Select
                        label="Danh sách sự kiện"
                        value={newReport.danhSachSuKien}
                        onChange={(value) =>
                            setNewReport({
                                ...newReport,
                                danhSachSuKien: value,
                            })}
                        multiple
                    >
                        {events.map((event) => (
                            <Option key={event._id} value={event._id}>
                                {event.tenSuKien}
                            </Option>
                        ))}
                    </Select>
                    <Input
                        type="number"
                        label="Tổng ngân sách chi tiêu"
                        value={newReport.tongNganSachChiTieu}
                        onChange={(e) =>
                            setNewReport({
                                ...newReport,
                                tongNganSachChiTieu: e.target.value,
                            })}
                    />
                    <Input
                        type="number"
                        label="Tổng thu"
                        value={newReport.tongThu}
                        onChange={(e) =>
                            setNewReport({
                                ...newReport,
                                tongThu: e.target.value,
                            })}
                    />
                    <Textarea
                        label="Kết quả đạt được"
                        value={newReport.ketQuaDatDuoc}
                        onChange={(e) =>
                            setNewReport({
                                ...newReport,
                                ketQuaDatDuoc: e.target.value,
                            })}
                        className="col-span-2"
                    />
                    <Select
                        label="Câu lạc bộ"
                        value={newReport.club}
                        onChange={(value) =>
                            setNewReport({
                                ...newReport,
                                club: value,
                            })}
                    >
                        {clubs.map((club) => (
                            <Option key={club._id} value={club._id}>
                                {club.ten}
                            </Option>
                        ))}
                    </Select>
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
                        onClick={editingReportId
                            ? handleUpdateReport
                            : handleAddReport}
                    >
                        {editingReportId ? "Cập nhật" : "Thêm"}
                    </Button>
                </DialogFooter>
            </Dialog>

            {/* Dialog xem chi tiết báo cáo */}
            <Dialog
                open={isDetailDialogOpen}
                handler={() => setIsDetailDialogOpen(false)}
                size="lg"
            >
                <DialogHeader className="lg:text-2xl md:text-xl sm:text-base">Chi tiết Báo cáo</DialogHeader>
                {detailReport && (
                    <DialogBody divider className="grid gap-4 overflow-y-auto lg:max-h-[65vh] sm:max-h-[47vh]">
                        <div className="grid grid-cols-2 gap-4">
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-semibold"
                            >
                                ID:{" "}
                                <span className="font-normal">
                                    {detailReport._id}
                                </span>
                            </Typography>
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-semibold"
                            >
                                Tên báo cáo:{" "}
                                <span className="font-normal">
                                    {detailReport.tenBaoCao}
                                </span>
                            </Typography>
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-semibold"
                            >
                                Ngày báo cáo:{" "}
                                <span className="font-normal">
                                    {new Date(detailReport.ngayBaoCao)
                                        .toLocaleDateString()}
                                </span>
                            </Typography>
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-semibold"
                            >
                                Nhân sự phụ trách:{" "}
                                <span className="font-normal">
                                    {detailReport.nhanSuPhuTrach}
                                </span>
                            </Typography>
                        </div>

                        <div className="pt-4 border-t">
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="mb-2 font-semibold"
                            >
                                Danh sách sự kiện:
                            </Typography>
                            <ul className="pl-5 list-disc">
                                {detailReport.danhSachSuKien.map((event) => (
                                    <li key={event._id} className="mb-2">
                                        <div className="grid gap-1">
                                            <Typography
                                                variant="small"
                                                className="font-semibold"
                                            >
                                                {event.tenSuKien}
                                            </Typography>
                                            <Typography
                                                variant="small"
                                                className="font-normal"
                                            >
                                                Người phụ trách:{" "}
                                                {event.nguoiPhuTrach}
                                            </Typography>
                                            <Typography
                                                variant="small"
                                                className="font-normal"
                                            >
                                                Ngày tổ chức:{" "}
                                                {new Date(event.ngayToChuc)
                                                    .toLocaleDateString()}
                                            </Typography>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="pt-4 border-t">
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="mb-2 font-semibold"
                            >
                                Danh sách giải thưởng:
                            </Typography>
                            <ul className="pl-5 list-disc">
                                {detailReport.danhSachGiai.map((giai) => (
                                    <li key={giai._id} className="mb-2">
                                        <div className="grid gap-1">
                                            <Typography
                                                variant="small"
                                                className="font-semibold"
                                            >
                                                {giai.tenGiai}
                                            </Typography>
                                            <Typography
                                                variant="small"
                                                className="font-normal"
                                            >
                                                Người nhận giải:{" "}
                                                {giai.nguoiNhanGiai}
                                            </Typography>
                                            <Typography
                                                variant="small"
                                                className="font-normal"
                                            >
                                                Ngày nhận giải:{" "}
                                                {new Date(giai.ngayNhanGiai)
                                                    .toLocaleDateString()}
                                            </Typography>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-semibold"
                            >
                                Tổng ngân sách chi tiêu:{" "}
                                <span className="font-normal">
                                    {detailReport.tongNganSachChiTieu
                                        .toLocaleString()} VND
                                </span>
                            </Typography>
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-semibold"
                            >
                                Tổng thu:{" "}
                                <span className="font-normal">
                                    {detailReport.tongThu.toLocaleString()} VND
                                </span>
                            </Typography>
                        </div>

                        <div className="pt-4 border-t">
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-semibold"
                            >
                                Câu lạc bộ:{" "}
                                <span className="font-normal">
                                    {clubs.find((c) =>
                                        c._id === detailReport.club
                                    )?.ten || "N/A"}
                                </span>
                            </Typography>
                        </div>

                        <div className="pt-4 border-t">
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-semibold"
                            >
                                Kết quả đạt được:
                            </Typography>
                            <Typography
                                variant="small"
                                className="mt-1 font-normal"
                            >
                                {detailReport.ketQuaDatDuoc}
                            </Typography>
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

export default ClubReports;
