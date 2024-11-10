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
    ChevronLeftIcon,
    ChevronRightIcon,
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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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

    // Tính toán reports cho trang hiện tại
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentReports = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

    // Reset trang khi thay đổi bộ lọc
    useEffect(() => {
        setCurrentPage(1);
    }, [filterClub]);

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
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64 mt-14">
                            <Spinner className="w-16 h-16 text-blue-500/10" />
                        </div>
                    ) : (
                        <>
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
                                    {currentReports.map(
                                        ({ _id, tenBaoCao, ngayBaoCao, nhanSuPhuTrach, club }, key) => {
                                            const className = `py-3 px-5 ${
                                                key === currentReports.length - 1 ? "" : "border-b border-blue-gray-50"
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
                                                            {new Date(ngayBaoCao).toLocaleDateString()}
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
                                                            {clubs.find((c) => c._id === club)?.ten || "N/A"}
                                                        </Typography>
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
                                                                    onClick={() => openDetailDialog(_id)}
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
                                        }
                                    )}
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
                className="min-w-[80%]"
            >
                <DialogHeader className="text-2xl font-bold">
                    Chi tiết Báo cáo
                </DialogHeader>
                {detailReport && (
                    <DialogBody divider className="h-[70vh] overflow-y-auto">
                        <div className="grid gap-6">
                            {/* Thông tin cơ bản */}
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th colSpan="4" className="bg-blue-50 p-2 text-left text-lg font-bold text-blue-900">
                                            Thông tin cơ bản
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th className="border p-2 bg-gray-50 w-1/4">Tên báo cáo</th>
                                        <td className="border p-2">{detailReport.tenBaoCao}</td>
                                        <th className="border p-2 bg-gray-50 w-1/4">Ngày báo cáo</th>
                                        <td className="border p-2">
                                            {new Date(detailReport.ngayBaoCao).toLocaleDateString()}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="border p-2 bg-gray-50">Nhân sự phụ trách</th>
                                        <td className="border p-2">{detailReport.nhanSuPhuTrach}</td>
                                        <th className="border p-2 bg-gray-50">Câu lạc bộ</th>
                                        <td className="border p-2">
                                            {clubs.find(c => c._id === detailReport.club)?.ten || "N/A"}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Danh sách sự kiện */}
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th colSpan="4" className="bg-blue-50 p-2 text-left text-lg font-bold text-blue-900">
                                            Danh sách sự kiện
                                        </th>
                                    </tr>
                                    <tr className="bg-gray-50">
                                        <th className="border p-2">Tên sự kiện</th>
                                        <th className="border p-2">Người phụ trách</th>
                                        <th className="border p-2">Ngày tổ chức</th>
                                        <th className="border p-2">Địa điểm</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detailReport.danhSachSuKien.map((event) => (
                                        <tr key={event._id}>
                                            <td className="border p-2">{event.tenSuKien}</td>
                                            <td className="border p-2">{event.nguoiPhuTrach}</td>
                                            <td className="border p-2">
                                                {new Date(event.ngayToChuc).toLocaleDateString()}
                                            </td>
                                            <td className="border p-2">{event.diaDiem}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Danh sách giải thưởng */}
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th colSpan="4" className="bg-blue-50 p-2 text-left text-lg font-bold text-blue-900">
                                            Danh sách giải thưởng
                                        </th>
                                    </tr>
                                    <tr className="bg-gray-50">
                                        <th className="border p-2">Tên giải thưởng</th>
                                        <th className="border p-2">Loại giải</th>
                                        <th className="border p-2">Ngày đạt giải</th>
                                        <th className="border p-2">Thành viên đạt giải</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detailReport.danhSachGiaiThuong?.map((prize) => (
                                        <tr key={prize._id}>
                                            <td className="border p-2">{prize.tenGiaiThuong}</td>
                                            <td className="border p-2">{prize.loaiGiai}</td>
                                            <td className="border p-2">
                                                {new Date(prize.ngayDatGiai).toLocaleDateString()}
                                            </td>
                                            <td className="border p-2">{prize.thanhVienDatGiai}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Thông tin tài chính */}
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th colSpan="2" className="bg-green-50 p-2 text-left text-lg font-bold text-green-900">
                                            Thông tin tài chính
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th className="border p-2 bg-gray-50 w-1/2">Tổng ngân sách chi tiêu</th>
                                        <td className="border p-2">
                                            {detailReport.tongNganSachChiTieu.toLocaleString()} VND
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="border p-2 bg-gray-50">Tổng thu</th>
                                        <td className="border p-2">
                                            {detailReport.tongThu.toLocaleString()} VND
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Kết quả đạt được */}
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="bg-yellow-50 p-2 text-left text-lg font-bold text-yellow-900">
                                            Kết quả đạt được
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border p-2 whitespace-pre-line">
                                            {detailReport.ketQuaDatDuoc}
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

export default ClubReports;
