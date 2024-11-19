import React, { useCallback, useEffect, useState, useMemo } from "react";
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
    XMarkIcon,
} from "@heroicons/react/24/solid";
import * as XLSX from 'xlsx';

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
    const [filterClub, setFilterClub] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState({
        startDate: "",
        endDate: ""
    });

    const filteredReports = useMemo(() => {
        return reports
            .filter(report => {
                const matchesSearch = report.tenBaoCao
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

                const matchesClub = !filterClub || report.club === filterClub;

                const reportDate = new Date(report.ngayBaoCao);
                const matchesDateRange = (!dateFilter.startDate || new Date(dateFilter.startDate) <= reportDate) &&
                    (!dateFilter.endDate || new Date(dateFilter.endDate) >= reportDate);

                return matchesSearch && matchesClub && matchesDateRange;
            })
            .sort((a, b) => new Date(b.ngayBaoCao) - new Date(a.ngayBaoCao));
    }, [reports, searchTerm, filterClub, dateFilter]);

    const ITEMS_PER_PAGE = 10;

    const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);

    const currentReports = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredReports.slice(startIndex, endIndex);
    }, [filteredReports, currentPage]);

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
    }, [fetchReports]);

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

    const handleEventSelection = (value) => {
        const eventIds = Array.isArray(value) ? value : [value];
        setNewReport({
            ...newReport,
            danhSachSuKien: eventIds,
        });
    };

    // Thêm hàm helper để format ngày
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Thêm function xuất Excel
    const exportToExcel = (report) => {
        // Tạo workbook mới
        const wb = XLSX.utils.book_new();

        // Định nghĩa styles chung
        const borderStyle = {
            style: "medium",
            color: { rgb: "000000" }
        };

        const commonStyle = {
            border: {
                top: borderStyle,
                bottom: borderStyle,
                left: borderStyle,
                right: borderStyle
            }
        };

        // Tạo worksheet cho thông tin chung với border
        const generalInfo = [
            [{v: 'BÁO CÁO CÂU LẠC BỘ', s: {
                font: { bold: true, sz: 16, color: { rgb: "FFFFFF" } },
                alignment: { horizontal: "center", vertical: "center" },
                ...commonStyle,
                fill: { fgColor: { rgb: "4F46E5" } }
            }}],
            [''],
            [{v: 'THÔNG TIN CHUNG', s: {
                font: { bold: true },
                ...commonStyle,
                fill: { fgColor: { rgb: "E5E7EB" } }
            }}],
            [
                {v: 'Tên báo cáo:', s: commonStyle},
                {v: report.tenBaoCao, s: commonStyle}
            ],
            [
                {v: 'Ngày báo cáo:', s: commonStyle},
                {v: formatDate(report.ngayBaoCao), s: commonStyle}
            ],
            [
                {v: 'Người phụ trách:', s: commonStyle},
                {v: report.nhanSuPhuTrach, s: commonStyle}
            ],
            [
                {v: 'Câu lạc bộ:', s: commonStyle},
                {v: clubs.find(c => c._id === report.club)?.ten || "N/A", s: commonStyle}
            ],
            [''],
            [{v: 'THÔNG TIN TÀI CHÍNH', s: {
                font: { bold: true },
                ...commonStyle,
                fill: { fgColor: { rgb: "E5E7EB" } }
            }}],
            [
                {v: 'Tổng ngân sách chi tiêu:', s: commonStyle},
                {v: `${report.tongNganSachChiTieu?.toLocaleString('vi-VN')} đ`, s: commonStyle}
            ],
            [
                {v: 'Tổng thu:', s: commonStyle},
                {v: `${report.tongThu?.toLocaleString('vi-VN')} đ`, s: commonStyle}
            ],
            [''],
            [{v: 'KẾT QUẢ ĐẠT ĐƯỢC', s: {
                font: { bold: true },
                ...commonStyle,
                fill: { fgColor: { rgb: "E5E7EB" } }
            }}],
            [{v: report.ketQuaDatDuoc || "Chưa cập nhật", s: commonStyle}]
        ];

        // Tạo worksheet cho danh sách sự kiện với border
        const eventsData = [
            [{v: 'DANH SÁCH SỰ KIỆN', s: {
                font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } },
                alignment: { horizontal: "center" },
                ...commonStyle,
                fill: { fgColor: { rgb: "4F46E5" } }
            }}],
            [
                {v: 'STT', s: {...commonStyle, font: { bold: true }}},
                {v: 'Tên sự kiện', s: {...commonStyle, font: { bold: true }}},
                {v: 'Mô tả', s: {...commonStyle, font: { bold: true }}},
                {v: 'Ngày tổ chức', s: {...commonStyle, font: { bold: true }}}
            ],
            ...report.danhSachSuKien.map((event, index) => [
                {v: index + 1, s: commonStyle},
                {v: events.find(e => e._id === event)?.tenSuKien || "N/A", s: commonStyle},
                {v: events.find(e => e._id === event)?.moTa || "N/A", s: commonStyle},
                {v: formatDate(events.find(e => e._id === event)?.ngayToChuc) || "N/A", s: commonStyle}
            ])
        ];

        // Tạo các worksheet
        const wsGeneral = XLSX.utils.aoa_to_sheet(generalInfo);
        const wsEvents = XLSX.utils.aoa_to_sheet(eventsData);

        // Áp dụng độ rộng cột và merge cells
        [wsGeneral, wsEvents].forEach(ws => {
            ws['!cols'] = [
                { wch: 25 },
                { wch: 40 },
                { wch: 25 },
                { wch: 20 },
            ];
            ws['!rows'] = [{ hpt: 30 }];
        });

        // Merge cells
        wsGeneral['!merges'] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },
            { s: { r: 2, c: 0 }, e: { r: 2, c: 1 } },
            { s: { r: 8, c: 0 }, e: { r: 8, c: 1 } },
            { s: { r: 12, c: 0 }, e: { r: 12, c: 1 } },
            { s: { r: 13, c: 0 }, e: { r: 13, c: 1 } }
        ];

        wsEvents['!merges'] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }
        ];

        // Thêm các worksheet vào workbook
        XLSX.utils.book_append_sheet(wb, wsGeneral, "Thông tin chung");
        XLSX.utils.book_append_sheet(wb, wsEvents, "Danh sách sự kiện");

        // Tạo tên file với ID báo cáo
        const fileName = `BaocaoCLB_${report._id}.xlsx`;

        // Xuất file
        XLSX.writeFile(wb, fileName);
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
                        Báo cáo Câu lạc bộ
                    </Typography>
                </CardHeader>

                <CardBody className="px-0 pt-4 pb-2 overflow-auto">
                    <div className="flex flex-wrap items-center justify-between gap-4 p-4 px-6">
                        {/* Cột trái - Tìm kiếm và các bộ lọc */}
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

                            {/* Select box câu lạc bộ */}
                            <div className="w-48">
                                <Select
                                    label="Câu lạc bộ"
                                    value={filterClub}
                                    onChange={(value) => setFilterClub(value)}
                                >
                                    <Option value="">Tất cả CLB</Option>
                                    {clubs.map((club) => (
                                        <Option key={club._id} value={club._id}>
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

                                {/* Nút reset tất cả bộ lọc */}
                                {(dateFilter.startDate || dateFilter.endDate || filterClub || searchTerm) && (
                                    <Button
                                        variant="text"
                                        color="red"
                                        className="p-2"
                                        onClick={() => {
                                            setDateFilter({ startDate: "", endDate: "" });
                                            setFilterClub("");
                                            setSearchTerm("");
                                        }}
                                    >
                                        <XMarkIcon className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Hiển thị kết quả tìm kiếm và lọc */}
                    {(searchTerm || dateFilter.startDate || dateFilter.endDate || filterClub) && (
                        <div className="px-6 mb-4">
                            <Typography variant="small" color="blue-gray">
                                Tìm thấy {filteredReports.length} kết quả
                                {searchTerm && ` cho "${searchTerm}"`}
                                {filterClub && ` tại "${clubs.find(c => c._id === filterClub)?.ten}"`}
                                {dateFilter.startDate && ` từ ${new Date(dateFilter.startDate).toLocaleDateString('vi-VN')}`}
                                {dateFilter.endDate && ` đến ${new Date(dateFilter.endDate).toLocaleDateString('vi-VN')}`}
                            </Typography>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="flex items-center justify-center h-64 mt-14">
                            <Spinner className="w-16 h-16 text-blue-500/10" />
                        </div>
                    ) : filteredReports.length === 0 ? (
                        <div className="flex items-center justify-center h-64">
                            <Typography variant="h6" color="blue-gray" className="font-normal">
                                Không có báo cáo từ câu lạc bộ
                            </Typography>
                        </div>
                    ) : (
                        <>
                            <table className="w-full min-w-[640px] table-auto mt-5">
                                <thead>
                                    <tr>
                                        {[
                                            "STT",
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
                                                            className="text-xs font-semibold text-blue-gray-600"
                                                        >
                                                            {(currentPage - 1) * ITEMS_PER_PAGE + key + 1}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography
                                                            className="text-xs font-semibold text-blue-gray-600"
                                                        >
                                                            {tenBaoCao}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography
                                                            className="text-xs font-semibold text-blue-gray-600"
                                                        >
                                                            {formatDate(ngayBaoCao)}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography
                                                            className="text-xs font-semibold text-blue-gray-600"
                                                        >
                                                            {nhanSuPhuTrach}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography
                                                            className="text-xs font-semibold text-blue-gray-600"
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
                        value={newReport.danhSachSuKien[0] || ''}
                        onChange={handleEventSelection}
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
                        {editingReportId ? "Cập nht" : "Thêm"}
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
                                        <th colSpan="4" className="bg-blue-50 p-3 text-left text-lg font-bold text-blue-900">
                                            Thông tin cơ bản
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th className="border p-3">Tên báo cáo</th>
                                        <td className="border p-3">{detailReport.tenBaoCao}</td>
                                        <th className="border p-3">Ngày báo cáo</th>
                                        <td className="border p-3">
                                            {formatDate(detailReport.ngayBaoCao)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="border p-3">Nhân sự phụ trách</th>
                                        <td className="border p-3">{detailReport.nhanSuPhuTrach}</td>
                                        <th className="border p-3">Câu lạc bộ</th>
                                        <td className="border p-3">
                                            {clubs.find(c => c._id === detailReport.club)?.ten || "N/A"}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Danh sách sự kiện */}
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th colSpan="3" className="bg-blue-50 p-2 text-left text-lg font-bold text-blue-900">
                                            Danh sách sự kiện
                                        </th>
                                    </tr>
                                    <tr className="bg-gray-50">
                                        <th className="border p-2 text-center">Tên sự kiện</th>
                                        <th className="border p-2 text-center">Người phụ trách</th>
                                        <th className="border p-2 text-center">Ngày tổ chức</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detailReport.danhSachSuKien.map((event) => (
                                        <tr key={event._id}>
                                            <td className="border p-2 text-center">{event.tenSuKien}</td>
                                            <td className="border p-2 text-center">{event.nguoiPhuTrach}</td>
                                            <td className="border p-2 text-center">
                                                {formatDate(event.ngayToChuc)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Danh sách giải thưởng */}
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th colSpan="3" className="bg-blue-50 p-2 text-left text-lg font-bold text-blue-900">
                                            Danh sách giải thưởng
                                        </th>
                                    </tr>
                                    <tr className="bg-gray-50">
                                        <th className="border p-2 text-center">Tên giải</th>
                                        <th className="border p-2 text-center">Người nhận giải</th>
                                        <th className="border p-2 text-center">Ngày nhận giải</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detailReport.danhSachGiai?.map((prize) => (
                                        <tr key={prize._id}>
                                            <td className="border p-2 text-center">{prize.tenGiai}</td>
                                            <td className="border p-2 text-center">{prize.nguoiNhanGiai}</td>
                                            <td className="border p-2 text-center">
                                                {formatDate(prize.ngayNhanGiai)}
                                            </td>
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
                            variant="gradient"
                            color="blue"
                            onClick={() => setIsDetailDialogOpen(false)}
                        >
                            Đóng
                        </Button>
                    </div>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default ClubReports;
