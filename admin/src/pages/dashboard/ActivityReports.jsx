import {
    EyeIcon,
    PencilIcon,
    TrashIcon,
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
    Input, Spinner,
    Textarea,
    Tooltip,
    Typography
} from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { FaPlus } from "react-icons/fa6";
import * as XLSX from 'xlsx';
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";

const API_URL = "http://4.242.20.80:5500/api";

const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
};

const ActivityReports = () => {
    const [reports, setReports] = useState([]);
    const [club, setClub] = useState(null);
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [newReport, setNewReport] = useState({
        tenBaoCao: "",
        ngayBaoCao: "",
        nhanSuPhuTrach: "",
        danhSachSuKien: [],
        danhSachGiai: [],
        tongNganSachChiTieu: 0,
        tongThu: 0,
        ketQuaDatDuoc: "",
    });
    const [detailReport, setDetailReport] = useState(null);
    const [editingReportId, setEditingReportId] = useState(null);
    const [eventSuggestions, setEventSuggestions] = useState({
        index: -1,
        suggestions: [],
    });
    const [awardSuggestions, setAwardSuggestions] = useState({
        index: -1,
        suggestions: [],
    });
    const [members, setMembers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [errors, setErrors] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState({
        startDate: "",
        endDate: ""
    });

    useEffect(() => {
        const managedClubsString = localStorage.getItem("managedClubs");
        if (managedClubsString) {
            try {
                const managedClubs = JSON.parse(managedClubsString);
                if (managedClubs && managedClubs.length > 0) {
                    setClub(managedClubs[0]);
                    fetchReports(managedClubs[0]._id);
                    fetchEvents(managedClubs[0]._id);
                } else {
                    throw new Error("No managed clubs found");
                }
            } catch (error) {
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

    const fetchReports = async (clubId) => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `${API_URL}/get-reports-by-club/${clubId}`,
            );
            setReports(response.data);
        } catch (error) {
            console.error("Error fetching reports:", error);
            // Thêm dòng này để xem chi tiết lỗi
            console.error("Error details:", error.response?.data);
            alert("Lỗi khi tải danh sách báo cáo");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchEvents = async (clubId) => {
        try {
            const response = await axios.get(
                `${API_URL}/get-events-by-club/${clubId}`,
            );
            setEvents(response.data);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    const handleAddReport = async () => {
        if (!validateForm()) return;

        try {
            const reportData = {
                ...newReport,
                club: club._id,
            };
            const response = await axios.post(
                `${API_URL}/add-report`,
                reportData,
            );
            setIsDialogOpen(false);
            fetchReports(club._id);
        } catch (error) {
            console.error("Error adding report:", error);
            alert(
                `Lỗi khi thêm báo cáo: ${
                    error.response?.data?.message || "Không xác định"
                }`,
            );
        }
    };

    const handleUpdateReport = async () => {
        if (!validateForm()) return;

        try {
            const updatedReport = {
                ...newReport,
                danhSachGiai: newReport.danhSachGiai.map((award) => ({
                    ...award,
                    nguoiNhanGiai: award.nguoiNhanGiai || "Không xác định",
                })),
            };

            const response = await axios.put(
                `${API_URL}/update-report/${editingReportId}`,
                updatedReport,
            );
            setIsDialogOpen(false);
            setEditingReportId(null);
            fetchReports(club._id);
        } catch (error) {
            console.error("Error updating report:", error);
            alert(
                `Lỗi khi cập nhật báo cáo: ${
                    error.response?.data?.message || "Không xác định"
                }`,
            );
        }
    };

    const handleDeleteReport = async (reportId) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa báo cáo này?")) {
            try {
                const response = await axios.delete(
                    `${API_URL}/delete-report/${reportId}/${club._id}`,
                );
                fetchReports(club._id);
            } catch (error) {
                console.error("Error deleting report:", error);
                alert(
                    `Lỗi khi xóa báo cáo: ${
                        error.response?.data?.message || "Không xác định"
                    }`,
                );
            }
        }
    };

    const openAddDialog = () => {
        const today = new Date().toISOString().split('T')[0];
        setNewReport({
            tenBaoCao: "",
            ngayBaoCao: today,
            nhanSuPhuTrach: "",
            danhSachSuKien: [],
            danhSachGiai: [],
            tongNganSachChiTieu: 0,
            tongThu: 0,
            ketQuaDatDuoc: "",
        });
        setEditingReportId(null);
        setIsDialogOpen(true);
        setErrors({});
    };

    const openEditDialog = async (id) => {
        try {
            const response = await axios.get(`${API_URL}/get-report/${id}`);
            setNewReport(response.data);
            setEditingReportId(id);
            setIsDialogOpen(true);
        } catch (error) {
            console.error("Error fetching report details:", error);
            alert("Lỗi khi tải thông tin báo cáo");
        }
    };

    const openDetailDialog = (id) => {
        const reportToView = reports.find((report) => report._id === id);
        setDetailReport(reportToView);
        setIsDetailDialogOpen(true);
    };

    const handleAddEvent = () => {
        setNewReport({
            ...newReport,
            danhSachSuKien: [
                ...newReport.danhSachSuKien,
                { tenSuKien: "", moTa: "", ngayToChuc: "" },
            ],
        });
    };

    const handleUpdateEvent = (index, field, value) => {
        const updatedEvents = [...newReport.danhSachSuKien];
        updatedEvents[index][field] = value;
        setNewReport({ ...newReport, danhSachSuKien: updatedEvents });
    };

    const handleRemoveEvent = (index) => {
        const updatedEvents = newReport.danhSachSuKien.filter((_, i) =>
            i !== index
        );
        setNewReport({ ...newReport, danhSachSuKien: updatedEvents });
    };

    const handleAddAward = () => {
        setNewReport({
            ...newReport,
            danhSachGiai: [
                ...newReport.danhSachGiai,
                { tenGiai: "", moTa: "" },
            ],
        });
    };

    const handleUpdateAward = (index, field, value) => {
        const updatedAwards = [...newReport.danhSachGiai];
        updatedAwards[index][field] = value;
        setNewReport({ ...newReport, danhSachGiai: updatedAwards });
    };

    const handleRemoveAward = (index) => {
        const updatedAwards = newReport.danhSachGiai.filter((_, i) =>
            i !== index
        );
        setNewReport({ ...newReport, danhSachGiai: updatedAwards });
    };

    const handleEventNameChange = async (e, index) => {
        const value = e.target.value;
        handleUpdateEvent(index, "tenSuKien", value);
        if (value.length > 2 && club) {
            try {
                const response = await axios.get(
                    `${API_URL}/search-events/${club._id}?query=${value}`,
                );
                setEventSuggestions({ index, suggestions: response.data });
            } catch (error) {
                console.error("Error fetching event suggestions:", error);
            }
        } else {
            setEventSuggestions({ index, suggestions: [] });
        }
    };

    const handleEventSuggestionClick = (suggestion, index) => {
        const updatedEvents = [...newReport.danhSachSuKien];
        updatedEvents[index] = {
            tenSuKien: suggestion.ten,
            nguoiPhuTrach: suggestion.nguoiPhuTrach,
            ngayToChuc: suggestion.ngayToChuc.split("T")[0],
        };
        setNewReport({ ...newReport, danhSachSuKien: updatedEvents });
        setEventSuggestions({ index: -1, suggestions: [] });
    };

    const handleAwardNameChange = async (e, index) => {
        const value = e.target.value;
        handleUpdateAward(index, "tenGiai", value);
        if (value.length > 2 && club) {
            try {
                const response = await axios.get(
                    `${API_URL}/search-prizes/${club._id}?query=${value}`,
                );
                setAwardSuggestions({ index, suggestions: response.data });
            } catch (error) {
                console.error("Error fetching award suggestions:", error);
            }
        } else {
            setAwardSuggestions({ index, suggestions: [] });
        }
    };

    const handleAwardSuggestionClick = (suggestion, index) => {
        const updatedAwards = [...newReport.danhSachGiai];
        updatedAwards[index] = {
            tenGiai: suggestion.tenGiai,
            nguoiNhanGiai: suggestion.nguoiNhanGiai, // Lưu tên người nhận giải
            ngayNhanGiai: suggestion.ngayNhanGiai.split("T")[0],
        };
        setNewReport({ ...newReport, danhSachGiai: updatedAwards });
        setAwardSuggestions({ index: -1, suggestions: [] });
    };

    // Thêm function xuất Excel
    const exportToExcel = (report) => {
        // Tạo workbook mới
        const wb = XLSX.utils.book_new();

        // Tạo worksheet cho thông tin chung
        const generalInfo = [
            ['BÁO CÁO HOẠT ĐỘNG', ''],
            ['', ''],
            ['Tên báo cáo', report.tenBaoCao],
            ['Ngày báo cáo', new Date(report.ngayBaoCao).toLocaleDateString('vi-VN')],
            ['Người phụ trách', report.nhanSuPhuTrach],
            ['Tổng ngân sách chi tiêu', report.tongNganSachChiTieu?.toLocaleString('vi-VN') + ' đ'],
            ['Tổng thu', report.tongThu?.toLocaleString('vi-VN') + ' đ'],
            ['Kết quả đạt được', report.ketQuaDatDuoc],
        ];
        const wsGeneral = XLSX.utils.aoa_to_sheet(generalInfo);

        // Tạo worksheet cho danh sách sự kiện
        const eventsData = [
            ['DANH SÁCH SỰ KIỆN', '', '', ''],
            ['Tên sự kiện', 'Người phụ trách', 'Ngày tổ chức', 'Mô tả'],
            ...report.danhSachSuKien.map(event => [
                event.tenSuKien,
                event.nguoiPhuTrach,
                new Date(event.ngayToChuc).toLocaleDateString('vi-VN'),
                event.moTa || ''
            ])
        ];
        const wsEvents = XLSX.utils.aoa_to_sheet(eventsData);

        // Tạo worksheet cho danh sách giải thưởng
        const awardsData = [
            ['DANH SÁCH GIẢI THƯỞNG', '', '', ''],
            ['Tên giải', 'Người nhận giải', 'Ngày nhận giải', 'Mô tả'],
            ...report.danhSachGiai.map(award => [
                award.tenGiai,
                award.nguoiNhanGiai,
                new Date(award.ngayNhanGiai).toLocaleDateString('vi-VN'),
                award.moTa || ''
            ])
        ];
        const wsAwards = XLSX.utils.aoa_to_sheet(awardsData);

        // Thêm các worksheet vào workbook
        XLSX.utils.book_append_sheet(wb, wsGeneral, "Thông tin chung");
        XLSX.utils.book_append_sheet(wb, wsEvents, "Danh sách sự kiện");
        XLSX.utils.book_append_sheet(wb, wsAwards, "Danh sách giải thưởng");

        // Tùy chỉnh style cho các worksheet
        const styleSheets = [wsGeneral, wsEvents, wsAwards];
        styleSheets.forEach(ws => {
            // Đặt độ rộng cột
            ws['!cols'] = [
                { wch: 20 }, // A
                { wch: 30 }, // B
                { wch: 15 }, // C
                { wch: 40 }, // D
            ];
        });

        // Tạo tên file với định dạng: BaoCao_[TenBaoCao]_[Ngay].xlsx
        const fileName = `BaoCao_${report.tenBaoCao.replace(/[^a-zA-Z0-9]/g, '_')}_${
            new Date(report.ngayBaoCao).toISOString().split('T')[0]
        }.xlsx`;

        // Xuất file
        XLSX.writeFile(wb, fileName);
    };

    // Thêm hàm lọc reports
    const filteredReports = useMemo(() => {
        return reports.filter(report => {
            // Lọc theo tên báo cáo
            const matchesSearch = report.tenBaoCao
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

            // Lọc theo khoảng thời gian
            const reportDate = new Date(report.ngayBaoCao);
            const matchesDateRange = (!dateFilter.startDate || new Date(dateFilter.startDate) <= reportDate) &&
                (!dateFilter.endDate || new Date(dateFilter.endDate) >= reportDate);

            return matchesSearch && matchesDateRange;
        });
    }, [reports, searchTerm, dateFilter]);

    // Tính toán reports cho trang hiện tại
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentReports = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

    // Thêm hàm để xử lý chuyển trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const validateForm = () => {
        const newErrors = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Validate tên báo cáo
        if (!newReport.tenBaoCao?.trim()) {
            newErrors.tenBaoCao = "Vui lòng nhập tên báo cáo";
        }

        // Validate ngày báo cáo
        if (!newReport.ngayBaoCao) {
            newErrors.ngayBaoCao = "Vui lòng chọn ngày báo cáo";
        } else {
            const reportDate = new Date(newReport.ngayBaoCao);
            reportDate.setHours(0, 0, 0, 0);
            if (reportDate.getTime() !== today.getTime()) {
                newErrors.ngayBaoCao = "Ngày báo cáo phải là ngày hiện tại";
            }
        }

        // Validate nhân sự phụ trách
        if (!newReport.nhanSuPhuTrach?.trim()) {
            newErrors.nhanSuPhuTrach = "Vui lòng nhập nhân sự phụ trách";
        }

        // Validate tổng ngân sách chi tiêu
        const budget = Number(newReport.tongNganSachChiTieu);
        if (isNaN(budget) || budget < 0) {
            newErrors.tongNganSachChiTieu = "Tổng ngân sách không được âm";
        } else if (budget > 100000000) {
            newErrors.tongNganSachChiTieu = "Tổng ngân sách không được vượt quá 100 triệu";
        }

        // Validate tổng thu
        const revenue = Number(newReport.tongThu);
        if (isNaN(revenue) || revenue < 0) {
            newErrors.tongThu = "Tổng thu không được âm";
        } else if (revenue > 100000000) {
            newErrors.tongThu = "Tổng thu không được vượt quá 100 triệu";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Reset trang khi thay đổi tìm kiếm hoặc bộ lọc
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, dateFilter]);

    return (
        <div className="flex flex-col gap-12 mt-12 mb-8">
            <Card>
                <CardHeader
                    variant="gradient"
                    color="cyan"
                    className="p-6 mb-8"
                >
                    <Typography variant="h6" color="white">
                        Báo cáo hoạt động
                    </Typography>
                </CardHeader>

                <CardBody className="px-0 pt-0 pb-2 overflow-auto">
                    <div className="flex flex-wrap items-center justify-between gap-4 p-4 px-6">
                        {/* Cột trái - Tìm kiếm và bộ lọc */}
                        <div className="flex flex-wrap items-center gap-4">
                            {/* Thanh tìm kiếm */}
                            <div className="w-72">
                                <Input
                                    label="Tìm kiếm theo tên báo cáo"
                                    icon={<i className="fas fa-search" />}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Bộ lọc ngày */}
                            <div className="flex items-center gap-2">
                                <div>
                                    <Input
                                        type="date"
                                        label="Từ ngày"
                                        value={dateFilter.startDate}
                                        onChange={(e) => 
                                            setDateFilter(prev => ({
                                                ...prev,
                                                startDate: e.target.value
                                            }))
                                        }
                                    />
                                </div>
                                <div>
                                    <Input
                                        type="date"
                                        label="Đến ngày"
                                        value={dateFilter.endDate}
                                        onChange={(e) => 
                                            setDateFilter(prev => ({
                                                ...prev,
                                                endDate: e.target.value
                                            }))
                                        }
                                    />
                                </div>
                                {/* Nút reset bộ lọc */}
                                {(dateFilter.startDate || dateFilter.endDate) && (
                                    <Button
                                        variant="text"
                                        color="red"
                                        className="p-2"
                                        onClick={() => setDateFilter({ startDate: "", endDate: "" })}
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
                                    color="blue"
                                    size="sm"
                                    onClick={openAddDialog}
                                >
                                    <FaPlus className="w-4 h-4" strokeWidth={"2rem"} />
                                </Button>
                            </Tooltip>
                        </div>
                    </div>

                    {/* Hiển thị kết quả tìm kiếm và lọc */}
                    {(searchTerm || dateFilter.startDate || dateFilter.endDate) && (
                        <div className="px-6 mb-4">
                            <Typography variant="small" color="blue-gray">
                                Tìm thấy {filteredReports.length} kết quả
                                {searchTerm && ` cho "${searchTerm}"`}
                                {dateFilter.startDate && ` từ ${new Date(dateFilter.startDate).toLocaleDateString('vi-VN')}`}
                                {dateFilter.endDate && ` đến ${new Date(dateFilter.endDate).toLocaleDateString('vi-VN')}`}
                            </Typography>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <Spinner className="w-16 h-16 text-blue-500/10" />
                        </div>
                    ) : (
                        <>
                            <table className="w-full min-w-[640px] table-auto">
                                <thead>
                                    <tr>
                                        {[
                                            "Tên báo cáo",
                                            "Ngày báo cáo",
                                            "Nhân sự phụ trách",
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
                                    {currentReports.map(
                                        ({
                                            _id,
                                            tenBaoCao,
                                            ngayBaoCao,
                                            nhanSuPhuTrach,
                                        }, key) => {
                                            const className = `py-3 px-5 ${
                                                key === currentReports.length - 1
                                                    ? ""
                                                    : "border-b border-blue-gray-50"
                                            }`;

                                            return (
                                                <tr key={_id}>
                                                    <td className={className}>
                                                        <Typography className="text-xs font-semibold text-blue-gray-600">
                                                            {tenBaoCao}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography className="text-xs font-semibold text-blue-gray-600">
                                                            {formatDateForInput(
                                                                ngayBaoCao,
                                                            )}{" "}
                                                            {/* Ngày đã được chuyển đổi ở server */}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography className="text-xs font-semibold text-blue-gray-600">
                                                            {nhanSuPhuTrach}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <div className="flex items-center gap-2">
                                                            <Tooltip
                                                                content="Xem"
                                                                animate={{
                                                                    mount: { scale: 1, y: 0 },
                                                                    unmount: { scale: 0, y: 25 },
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
                                                                    mount: { scale: 1, y: 0 },
                                                                    unmount: { scale: 0, y: 25 },
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
                                                                        handleDeleteReport(
                                                                            _id,
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
                                                color="blue"
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
                                                color="blue"
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
                                                        color="blue"
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

            {/* Dialog thêm/sửa báo cáo */}
            <Dialog
                open={isDialogOpen}
                handler={() => setIsDialogOpen(false)}
                size="lg"
            >
                <DialogHeader className="lg:text-2xl md:text-xl sm:text-base">
                    {editingReportId ? "Chỉnh sửa Báo cáo" : "Thêm Báo cáo Mới"}
                </DialogHeader>

                <DialogBody divider className="grid lg:grid-cols-2 gap-4 overflow-y-auto lg:max-h-[64vh] sm:max-h-[47vh]">
                    <div>
                        <Input
                            label="Tên báo cáo"
                            value={newReport.tenBaoCao}
                            onChange={(e) => {
                                setNewReport({
                                    ...newReport,
                                    tenBaoCao: e.target.value,
                                });
                                setErrors({ ...errors, tenBaoCao: "" });
                            }}
                            error={!!errors.tenBaoCao}
                        />
                        {errors.tenBaoCao && (
                            <Typography color="red" className="mt-1 text-xs">
                                {errors.tenBaoCao}
                            </Typography>
                        )}
                    </div>

                    <div>
                        <Input
                            type="date"
                            label="Ngày báo cáo"
                            value={formatDateForInput(newReport.ngayBaoCao)}
                            onChange={(e) => {
                                setNewReport({
                                    ...newReport,
                                    ngayBaoCao: e.target.value,
                                });
                                setErrors({ ...errors, ngayBaoCao: "" });
                            }}
                            error={!!errors.ngayBaoCao}
                            disabled={editingReportId !== null}
                        />
                        {errors.ngayBaoCao && (
                            <Typography color="red" className="mt-1 text-xs">
                                {errors.ngayBaoCao}
                            </Typography>
                        )}
                    </div>

                    <div>
                        <Input
                            label="Nhân sự phụ trách"
                            value={newReport.nhanSuPhuTrach}
                            onChange={(e) => {
                                setNewReport({
                                    ...newReport,
                                    nhanSuPhuTrach: e.target.value,
                                });
                                setErrors({ ...errors, nhanSuPhuTrach: "" });
                            }}
                            error={!!errors.nhanSuPhuTrach}
                        />
                        {errors.nhanSuPhuTrach && (
                            <Typography color="red" className="mt-1 text-xs">
                                {errors.nhanSuPhuTrach}
                            </Typography>
                        )}
                    </div>

                    <div className="col-span-2">
                        <Typography
                            variant="h6"
                            color="blue-gray"
                            className="mb-3"
                        >
                            Danh sách sự kiện
                        </Typography>
                        {newReport.danhSachSuKien.map((event, index) => (
                            <div
                                key={index}
                                className="relative flex items-center gap-2 mb-2"
                            >
                                <Input
                                    label="Tên sự kiện"
                                    value={event.tenSuKien}
                                    onChange={(e) =>
                                        handleEventNameChange(e, index)}
                                />
                                <Input
                                    label="Người phụ trách"
                                    value={event.nguoiPhuTrach}
                                    onChange={(e) =>
                                        handleUpdateEvent(
                                            index,
                                            "nguoiPhuTrach",
                                            e.target.value,
                                        )}
                                />
                                <Input
                                    type="date"
                                    label="Ngày tổ chức"
                                    value={formatDateForInput(event.ngayToChuc)}
                                    onChange={(e) =>
                                        handleUpdateEvent(
                                            index,
                                            "ngayToChuc",
                                            e.target.value,
                                        )}
                                />
                                {eventSuggestions.index === index &&
                                    eventSuggestions.suggestions.length > 0 && (
                                    <ul className="absolute left-0 z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg top-full">
                                        {eventSuggestions.suggestions.map((
                                            suggestion,
                                        ) => (
                                            <li
                                                key={suggestion._id}
                                                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                                onClick={() =>
                                                    handleEventSuggestionClick(
                                                        suggestion,
                                                        index,
                                                    )}
                                            >
                                                {suggestion.ten}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <Button
                                    color="red"
                                    size="sm"
                                    onClick={() => handleRemoveEvent(index)}
                                >
                                    Xóa
                                </Button>
                            </div>
                        ))}
                        <Button color="blue" size="sm" onClick={handleAddEvent}>
                            Thêm sự kiện
                        </Button>
                    </div>

                    <div className="col-span-2">
                        <Typography
                            variant="h6"
                            color="blue-gray"
                            className="mb-3"
                        >
                            Danh sách giải thưởng
                        </Typography>
                        {newReport.danhSachGiai.map((award, index) => (
                            <div
                                key={index}
                                className="relative flex items-center gap-2 mb-2"
                            >
                                <Input
                                    label="Tên giải"
                                    value={award.tenGiai}
                                    onChange={(e) =>
                                        handleAwardNameChange(e, index)}
                                />
                                <Input
                                    label="Người nhận giải"
                                    value={award.nguoiNhanGiai}
                                    onChange={(e) =>
                                        handleUpdateAward(
                                            index,
                                            "nguoiNhanGiai",
                                            e.target.value,
                                        )}
                                />
                                <Input
                                    type="date"
                                    label="Ngày nhận giải"
                                    value={formatDateForInput(
                                        award.ngayNhanGiai,
                                    )}
                                    onChange={(e) =>
                                        handleUpdateAward(
                                            index,
                                            "ngayNhanGiai",
                                            e.target.value,
                                        )}
                                />
                                {awardSuggestions.index === index &&
                                    awardSuggestions.suggestions.length > 0 && (
                                    <ul className="absolute left-0 z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg top-full">
                                        {awardSuggestions.suggestions.map((
                                            suggestion,
                                        ) => (
                                            <li
                                                key={suggestion._id}
                                                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                                onClick={() =>
                                                    handleAwardSuggestionClick(
                                                        suggestion,
                                                        index,
                                                    )}
                                            >
                                                {suggestion.tenGiai}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <Button
                                    color="red"
                                    size="sm"
                                    onClick={() => handleRemoveAward(index)}
                                >
                                    Xóa
                                </Button>
                            </div>
                        ))}
                        <Button color="blue" size="sm" onClick={handleAddAward}>
                            Thêm giải thưởng
                        </Button>
                    </div>

                    <div>
                        <Input
                            type="number"
                            label="Tổng ngân sách chi tiêu"
                            value={newReport.tongNganSachChiTieu}
                            onChange={(e) => {
                                setNewReport({
                                    ...newReport,
                                    tongNganSachChiTieu: e.target.value,
                                });
                                setErrors({ ...errors, tongNganSachChiTieu: "" });
                            }}
                            error={!!errors.tongNganSachChiTieu}
                        />
                        {errors.tongNganSachChiTieu && (
                            <Typography color="red" className="mt-1 text-xs">
                                {errors.tongNganSachChiTieu}
                            </Typography>
                        )}
                    </div>

                    <div>
                        <Input
                            type="number"
                            label="Tổng thu"
                            value={newReport.tongThu}
                            onChange={(e) => {
                                setNewReport({
                                    ...newReport,
                                    tongThu: e.target.value,
                                });
                                setErrors({ ...errors, tongThu: "" });
                            }}
                            error={!!errors.tongThu}
                        />
                        {errors.tongThu && (
                            <Typography color="red" className="mt-1 text-xs">
                                {errors.tongThu}
                            </Typography>
                        )}
                    </div>

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
                size="xl"
            >
                <DialogHeader className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Typography variant="h6">Chi tiết báo cáo hoạt động</Typography>
                        <Typography 
                            variant="small" 
                            className="px-3 py-1 rounded-full font-bold uppercase bg-blue-500 text-white"
                        >
                            {detailReport?.ngayBaoCao && new Date(detailReport.ngayBaoCao).toLocaleDateString('vi-VN', {
                                month: 'long',
                                year: 'numeric'
                            })}
                        </Typography>
                    </div>
                </DialogHeader>

                {detailReport && (
                    <DialogBody divider className="overflow-y-auto lg:max-h-[65vh] sm:max-h-[50vh] p-6">
                        <div className="flex gap-6">
                            {/* Cột trái - Thông tin cơ bản */}
                            <div className="flex-1">
                                <div className="bg-blue-gray-50 p-6 rounded-lg">
                                    {/* Tên báo cáo */}
                                    <div className="text-center mb-6">
                                        <Typography 
                                            variant="h4" 
                                            color="blue" 
                                            className="font-bold mb-3 bg-white p-4 rounded-lg border-2 border-dashed border-blue-500"
                                        >
                                            {detailReport.tenBaoCao}
                                        </Typography>
                                        <Typography 
                                            variant="small" 
                                            className="bg-white px-4 py-2 rounded-full text-blue-900 inline-block font-medium"
                                        >
                                            Người phụ trách: {detailReport.nhanSuPhuTrach}
                                        </Typography>
                                    </div>

                                    {/* Thông tin tài chính */}
                                    <div className="bg-white p-4 rounded-lg mb-4">
                                        <Typography className="text-sm text-gray-600 mb-3 font-medium">
                                            Tổng quan tài chính
                                        </Typography>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                                <Typography className="text-sm text-green-600 mb-1">Tổng thu</Typography>
                                                <Typography className="text-xl font-bold text-green-600">
                                                    {detailReport.tongThu?.toLocaleString('vi-VN')} đ
                                                </Typography>
                                            </div>
                                            <div className="text-center p-3 bg-red-50 rounded-lg">
                                                <Typography className="text-sm text-red-600 mb-1">Tổng chi</Typography>
                                                <Typography className="text-xl font-bold text-red-600">
                                                    {detailReport.tongNganSachChiTieu?.toLocaleString('vi-VN')} đ
                                                </Typography>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Kết quả đạt được */}
                                    <div className="bg-white p-4 rounded-lg">
                                        <Typography className="text-sm text-gray-600 mb-2 font-medium">
                                            Kết quả đạt được
                                        </Typography>
                                        <Typography className="text-blue-gray-800 whitespace-pre-line">
                                            {detailReport.ketQuaDatDuoc || "Chưa cập nhật"}
                                        </Typography>
                                    </div>
                                </div>
                            </div>

                            {/* Cột phải - Thông tin chi tiết */}
                            <div className="flex-[1.5]">
                                <div className="grid gap-4">
                                    {/* Danh sách sự kiện */}
                                    <div className="bg-blue-gray-50 p-4 rounded-lg">
                                        <Typography className="text-lg font-semibold text-blue-gray-800 mb-3">
                                            Danh sách sự kiện
                                        </Typography>
                                        <div className="grid gap-3">
                                            {detailReport.danhSachSuKien.map((event, index) => (
                                                <div key={index} className="bg-white p-3 rounded-lg">
                                                    <Typography className="font-medium text-blue-900 mb-2">
                                                        {event.tenSuKien}
                                                    </Typography>
                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                        <div>
                                                            <Typography className="text-gray-600">Người phụ trách:</Typography>
                                                            <Typography className="font-medium">{event.nguoiPhuTrach}</Typography>
                                                        </div>
                                                        <div>
                                                            <Typography className="text-gray-600">Ngày tổ chức:</Typography>
                                                            <Typography className="font-medium">
                                                                {new Date(event.ngayToChuc).toLocaleDateString('vi-VN')}
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Danh sách giải thưởng */}
                                    <div className="bg-blue-gray-50 p-4 rounded-lg">
                                        <Typography className="text-lg font-semibold text-blue-gray-800 mb-3">
                                            Danh sách giải thưởng
                                        </Typography>
                                        <div className="grid gap-3">
                                            {detailReport.danhSachGiai.map((award, index) => (
                                                <div key={index} className="bg-white p-3 rounded-lg">
                                                    <Typography className="font-medium text-blue-900 mb-2">
                                                        {award.tenGiai}
                                                    </Typography>
                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                        <div>
                                                            <Typography className="text-gray-600">Người nhận giải:</Typography>
                                                            <Typography className="font-medium">{award.nguoiNhanGiai}</Typography>
                                                        </div>
                                                        <div>
                                                            <Typography className="text-gray-600">Ngày nhận:</Typography>
                                                            <Typography className="font-medium">
                                                                {new Date(award.ngayNhanGiai).toLocaleDateString('vi-VN')}
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Ghi chú */}
                                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                                        <Typography variant="small" className="text-orange-800">
                                            <strong>Lưu ý:</strong> Báo cáo này được tạo vào ngày{" "}
                                            {new Date(detailReport.ngayBaoCao).toLocaleDateString('vi-VN', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DialogBody>
                )}
                <DialogFooter>
                    <div className="flex gap-2">
                        <Button
                            variant="outlined"
                            color="blue"
                            className="flex items-center gap-2"
                            onClick={() => exportToExcel(detailReport)}
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 24 24" 
                                fill="currentColor" 
                                className="w-4 h-4"
                            >
                                <path 
                                    fillRule="evenodd" 
                                    d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" 
                                    clipRule="evenodd" 
                                />
                            </svg>
                            Xuất Excel
                        </Button>
                        <Button
                            variant="text"
                            color="red"
                            onClick={() => setIsDetailDialogOpen(false)}
                            className="mr-1"
                        >
                            Đóng
                        </Button>
                    </div>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default ActivityReports;
