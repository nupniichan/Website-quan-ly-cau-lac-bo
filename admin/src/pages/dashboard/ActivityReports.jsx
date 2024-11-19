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
    IconButton,
    Input, Spinner,
    Textarea,
    Tooltip,
    Typography,
} from "@material-tailwind/react";
import {message, notification} from "antd";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import * as XLSX from "xlsx";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useMaterialTailwindController } from "@/context/useMaterialTailwindController";

const API_URL = "http://localhost:5500/api";

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
        endDate: "",
    });
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [showStudentDropdown, setShowStudentDropdown] = useState(false);
    const [selectedEventIndex, setSelectedEventIndex] = useState(-1);
    const [showMainStaffDropdown, setShowMainStaffDropdown] = useState(false);
    const [isFocused, setIsFocused] = useState({
        eventIndex: -1,
        awardIndex: -1,
    });
    const [memberValidationError, setMemberValidationError] = useState("");

    // Lấy controller từ context & màu hiện tại của sidenav
    const [controller] = useMaterialTailwindController();
    const { sidenavColor } = controller;

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
                // alert("Không thể tải thông tin câu lạc bộ. Vui lòng đăng nhập lại.");
                message.error({content: "Không thể tải thông tin câu lạc bộ. Vui lòng đăng nhập lại."});
            }
        } else {
            console.error("No managed clubs data found");
            // alert(
            //     "Không tìm thấy thông tin câu lạc bộ. Vui lòng đăng nhập lại.",
            // );
            message.error({content: "Không tìm thấy thông tin câu lạc bộ. Vui lòng đăng nhập lại."});
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (club?._id) {
            fetchMembersByClub(club._id);
        }
    }, [club]);

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
            // alert("Lỗi khi tải danh sách báo cáo");
            message.error({content: "Lỗi khi tải danh sách báo cáo"});
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
            // alert(
            //     `Lỗi khi thêm báo cáo: ${
            //         error.response?.data?.message || "Không xác định"
            //     }`,
            // );
            notification.error({
                message: "Lỗi khi thêm báo cáo",
                description: error.response?.data?.message || "Không xác định",
            });
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
            // alert(
            //     `Lỗi khi cập nhật báo cáo: ${
            //         error.response?.data?.message || "Không xác định"
            //     }`,
            // );
            notification.error({
                message: "Lỗi khi cập nhật báo cáo",
                description: error.response?.data?.message || "Không xác định",
            });
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
                // alert(
                //     `Lỗi khi xóa báo cáo: ${
                //         error.response?.data?.message || "Không xác định"
                //     }`,
                // );
                notification.error({
                    message: "Lỗi khi xóa báo cáo",
                    description: error.response?.data?.message || "Không xác định",
                })
            }
        }
    };

    const openAddDialog = () => {
        const today = new Date().toISOString().split("T")[0];
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
            // alert("Lỗi khi tải thông tin báo cáo");
            message.error({content: "Lỗi khi tải thông tin báo cáo"});
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
        const updatedEvents = [...newReport.danhSachSuKien];
        updatedEvents[index] = {
            ...updatedEvents[index],
            tenSuKien: value,
            isSelected: false,
        };
        setNewReport({ ...newReport, danhSachSuKien: updatedEvents });

        try {
            const response = await axios.get(
                `${API_URL}/search-events/${club._id}?query=${value}&limit=5`,
            );
            setEventSuggestions({ index, suggestions: response.data });
        } catch (error) {
            console.error("Error fetching event suggestions:", error);
        }
    };

    const handleEventSuggestionClick = (suggestion, index) => {
        const updatedEvents = [...newReport.danhSachSuKien];
        updatedEvents[index] = {
            tenSuKien: suggestion.ten,
            nguoiPhuTrach: suggestion.nguoiPhuTrach,
            ngayToChuc: suggestion.ngayToChuc.split("T")[0],
            isSelected: true, // Thêm flag để đánh dấu đã chọn từ suggestion
        };
        setNewReport({ ...newReport, danhSachSuKien: updatedEvents });
        setEventSuggestions({ index: -1, suggestions: [] });
    };

    const handleAwardNameChange = async (e, index) => {
        const value = e.target.value;
        handleUpdateAward(index, "tenGiai", value);
        try {
            const response = await axios.get(
                `${API_URL}/search-prizes/${club._id}?query=${value}&limit=5`,
            );
            setAwardSuggestions({ index, suggestions: response.data });
        } catch (error) {
            console.error("Error fetching award suggestions:", error);
        }
    };

    const handleAwardSuggestionClick = (suggestion, index) => {
        const updatedAwards = [...newReport.danhSachGiai];
        updatedAwards[index] = {
            tenGiai: suggestion.tenGiai,
            nguoiNhanGiai: suggestion.nguoiNhanGiai,
            ngayNhanGiai: suggestion.ngayNhanGiai.split("T")[0],
            isSelected: true, // Thêm flag để đánh dấu đã chọn từ suggestion
        };
        setNewReport({ ...newReport, danhSachGiai: updatedAwards });
        setAwardSuggestions({ index: -1, suggestions: [] });
    };

    // Thêm function xuất Excel
    const exportToExcel = (report) => {
        // Tạo workbook mới
        const wb = XLSX.utils.book_new();

        // Lấy ID báo cáo từ MongoDB (lấy 6 ký tự cuối)
        const reportId = report._id;

        // Định nghĩa styles chung
        const borderStyle = {
            style: "medium", // hoặc "thin" tùy preference
            color: { rgb: "000000" },
        };

        const commonStyle = {
            border: {
                top: borderStyle,
                bottom: borderStyle,
                left: borderStyle,
                right: borderStyle,
            },
        };

        // Tạo worksheet cho thông tin chung với border
        const generalInfo = [
            [{
                v: "BÁO CÁO HOẠT ĐỘNG CÂU LẠC BỘ",
                s: {
                    alignment: { horizontal: "center", vertical: "center" },
                    ...commonStyle,
                    fill: { fgColor: { rgb: "4F46E5" } },
                    font: { color: { rgb: "FFFFFF" }, bold: true, sz: 16 },
                },
            }],
            [""],
            [{
                v: "THÔNG TIN CHUNG",
                s: {
                    font: { bold: true },
                    ...commonStyle,
                    fill: { fgColor: { rgb: "E5E7EB" } },
                },
            }],
            [
                { v: "Tên báo cáo:", s: commonStyle },
                { v: report.tenBaoCao, s: commonStyle },
            ],
            [
                { v: "Ngày báo cáo:", s: commonStyle },
                {
                    v: new Date(report.ngayBaoCao).toLocaleDateString("vi-VN"),
                    s: commonStyle,
                },
            ],
            [
                { v: "Người phụ trách:", s: commonStyle },
                { v: report.nhanSuPhuTrach, s: commonStyle },
            ],
            [""],
            [{
                v: "THÔNG TIN TÀI CHÍNH",
                s: {
                    font: { bold: true },
                    ...commonStyle,
                    fill: { fgColor: { rgb: "E5E7EB" } },
                },
            }],
            [
                { v: "Tổng ngân sách chi tiêu:", s: commonStyle },
                {
                    v: `${
                        report.tongNganSachChiTieu?.toLocaleString("vi-VN")
                    } đ`,
                    s: commonStyle,
                },
            ],
            [
                { v: "Tổng thu:", s: commonStyle },
                {
                    v: `${report.tongThu?.toLocaleString("vi-VN")} đ`,
                    s: commonStyle,
                },
            ],
            [""],
            [{
                v: "KẾT QUẢ ĐẠT ĐƯỢC",
                s: {
                    font: { bold: true },
                    ...commonStyle,
                    fill: { fgColor: { rgb: "E5E7EB" } },
                },
            }],
            [{ v: report.ketQuaDatDuoc || "Chưa cập nhật", s: commonStyle }],
        ];

        // Tạo worksheet cho danh sách sự kiện với border
        const eventsData = [
            [{
                v: "DANH SÁCH SỰ KIỆN",
                s: {
                    font: { color: { rgb: "FFFFFF" }, sz: 14, bold: true },
                    alignment: { horizontal: "center" },
                    ...commonStyle,
                    fill: { fgColor: { rgb: "4F46E5" } },
                },
            }],
            [
                { v: "STT", s: { ...commonStyle, font: { bold: true } } },
                {
                    v: "Tên sự kiện",
                    s: { ...commonStyle, font: { bold: true } },
                },
                {
                    v: "Người phụ trách",
                    s: { ...commonStyle, font: { bold: true } },
                },
                {
                    v: "Ngày tổ chức",
                    s: { ...commonStyle, font: { bold: true } },
                },
            ],
            ...report.danhSachSuKien.map((event, index) => [
                { v: index + 1, s: commonStyle },
                { v: event.tenSuKien, s: commonStyle },
                { v: event.nguoiPhuTrach, s: commonStyle },
                {
                    v: new Date(event.ngayToChuc).toLocaleDateString("vi-VN"),
                    s: commonStyle,
                },
            ]),
        ];

        // Tạo worksheet cho danh sách giải thưởng với border
        const awardsData = [
            [{
                v: "DANH SÁCH GIẢI THƯỞNG",
                s: {
                    alignment: { horizontal: "center" },
                    ...commonStyle,
                    fill: { fgColor: { rgb: "4F46E5" } },
                    font: { color: { rgb: "FFFFFF" }, bold: true, sz: 14 },
                },
            }],
            [
                { v: "STT", s: { ...commonStyle, font: { bold: true } } },
                { v: "Tên giải", s: { ...commonStyle, font: { bold: true } } },
                {
                    v: "Người nhận giải",
                    s: { ...commonStyle, font: { bold: true } },
                },
                {
                    v: "Ngày nhận giải",
                    s: { ...commonStyle, font: { bold: true } },
                },
            ],
            ...report.danhSachGiai.map((award, index) => [
                { v: index + 1, s: commonStyle },
                { v: award.tenGiai, s: commonStyle },
                { v: award.nguoiNhanGiai, s: commonStyle },
                {
                    v: new Date(award.ngayNhanGiai).toLocaleDateString("vi-VN"),
                    s: commonStyle,
                },
            ]),
        ];

        // Tạo các worksheet
        const wsGeneral = XLSX.utils.aoa_to_sheet(generalInfo);
        const wsEvents = XLSX.utils.aoa_to_sheet(eventsData);
        const wsAwards = XLSX.utils.aoa_to_sheet(awardsData);

        // Áp dụng độ rộng cột và merge cells
        [wsGeneral, wsEvents, wsAwards].forEach((ws) => {
            ws["!cols"] = [
                { wch: 25 }, // A
                { wch: 40 }, // B
                { wch: 25 }, // C
                { wch: 20 }, // D
            ];

            ws["!rows"] = [{ hpt: 30 }];
        });

        // Merge cells
        wsGeneral["!merges"] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },
            { s: { r: 2, c: 0 }, e: { r: 2, c: 1 } },
            { s: { r: 7, c: 0 }, e: { r: 7, c: 1 } },
            { s: { r: 11, c: 0 }, e: { r: 11, c: 1 } },
            { s: { r: 12, c: 0 }, e: { r: 12, c: 1 } },
        ];

        wsEvents["!merges"] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },
        ];

        wsAwards["!merges"] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },
        ];

        // Thêm các worksheet vào workbook
        XLSX.utils.book_append_sheet(wb, wsGeneral, "Thông tin chung");
        XLSX.utils.book_append_sheet(wb, wsEvents, "Danh sách sự kiện");
        XLSX.utils.book_append_sheet(wb, wsAwards, "Danh sách giải thưởng");

        // Tạo tên file với ID báo cáo
        const fileName = `Baocao_${reportId}.xlsx`;

        // Xuất file
        XLSX.writeFile(wb, fileName);
    };

    // Thêm hàm format date mới
    const formatDateVN = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("vi-VN");
    };

    // Cập nhật phần filter và sort reports
    const filteredReports = useMemo(() => {
        return reports
            .sort((a, b) => new Date(b.ngayBaoCao) - new Date(a.ngayBaoCao)) // Sắp xếp theo ngày mới nhất
            .filter((report) => {
                // Lọc theo tên báo cáo hoặc nhân sự phụ trách
                const matchesSearch =
                    report.tenBaoCao.toLowerCase().includes(
                        searchTerm.toLowerCase(),
                    ) ||
                    report.nhanSuPhuTrach.toLowerCase().includes(
                        searchTerm.toLowerCase(),
                    );

                // Lọc theo khoảng thời gian
                const reportDate = new Date(report.ngayBaoCao);
                const matchesDateRange =
                    (!dateFilter.startDate ||
                        new Date(dateFilter.startDate) <= reportDate) &&
                    (!dateFilter.endDate ||
                        new Date(dateFilter.endDate) >= reportDate);

                return matchesSearch && matchesDateRange;
            });
    }, [reports, searchTerm, dateFilter]);

    // Tính toán reports cho trang hiện tại
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentReports = filteredReports.slice(
        indexOfFirstItem,
        indexOfLastItem,
    );
    const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

    // Thêm hàm để xử lý chuyển trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const validateForm = () => {
        const errors = {};
        
        if (!newReport.tenBaoCao?.trim()) {
            errors.tenBaoCao = "Vui lòng nhập tên báo cáo";
        }
        
        if (!newReport.ngayBaoCao) {
            errors.ngayBaoCao = "Vui lòng chọn ngày báo cáo";
        }
        
        if (!newReport.nhanSuPhuTrach?.trim()) {
            errors.nhanSuPhuTrach = "Vui lòng chọn nhân sự phụ trách";
        } else if (!validateMainStaff()) {
            errors.nhanSuPhuTrach = memberValidationError;
        }
        
        // ... các validate khác nếu có ...

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Reset trang khi thay đổi tìm kiếm hoặc bộ lọc
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, dateFilter]);

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

    const handleStudentSearch = (value, index) => {
        const updatedEvents = [...newReport.danhSachSuKien];
        updatedEvents[index] = {
            ...updatedEvents[index],
            nguoiPhuTrach: value,
        };
        setNewReport({ ...newReport, danhSachSuKien: updatedEvents });
        setSelectedEventIndex(index);
        setShowStudentDropdown(true);

        if (value.trim() === "") {
            setFilteredStudents(students);
            return;
        }

        const filtered = students.filter((student) =>
            student.hoTen.toLowerCase().includes(value.toLowerCase()) ||
            student.mssv.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredStudents(filtered);
    };

    const handleSelectStudent = (student, index) => {
        const updatedEvents = [...newReport.danhSachSuKien];
        updatedEvents[index] = {
            ...updatedEvents[index],
            nguoiPhuTrach: student.hoTen,
        };
        setNewReport({ ...newReport, danhSachSuKien: updatedEvents });
        setShowStudentDropdown(false);
        setSelectedEventIndex(-1);
    };

    const handleMainStaffSearch = (value) => {
        setNewReport({
            ...newReport,
            nhanSuPhuTrach: value
        });
        
        // Reset lỗi khi người dùng nhập
        setMemberValidationError("");
        
        // Lọc danh sách học sinh dựa trên giá trị tìm kiếm
        const filtered = students.filter((student) =>
            student.hoTen.toLowerCase().includes(value.toLowerCase()) ||
            student.mssv.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredStudents(filtered);
    };

    const handleSelectMainStaff = (student) => {
        setNewReport({
            ...newReport,
            nhanSuPhuTrach: student.hoTen,
        });
        setShowMainStaffDropdown(false);
        setMemberValidationError("");
    };

    // Thêm hàm validate nhân sự phụ trách
    const validateMainStaff = () => {
        const selectedStaff = newReport.nhanSuPhuTrach;
        const isValidStaff = students.some(
            student => student.hoTen.toLowerCase() === selectedStaff.toLowerCase()
        );
        
        if (!isValidStaff) {
            setMemberValidationError("Vui lòng chọn nhân sự từ danh sách thành viên câu lạc bộ");
            return false;
        }
        return true;
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Xử lý cho sự kiện
            if (!event.target.closest(".event-suggestion-container")) {
                setEventSuggestions({ index: -1, suggestions: [] });
                setIsFocused((prev) => ({ ...prev, eventIndex: -1 }));
            }
            // Xử lý cho giải thưởng
            if (!event.target.closest(".award-suggestion-container")) {
                setAwardSuggestions({ index: -1, suggestions: [] });
                setIsFocused((prev) => ({ ...prev, awardIndex: -1 }));
            }
            // Xử lý cho nhân sự phụ trách
            if (!event.target.closest(".main-staff-container")) {
                setShowMainStaffDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (showMainStaffDropdown && students.length > 0) {
            setFilteredStudents(students);
        }
    }, [showMainStaffDropdown, students]);

    // Thêm function mới để xử lý rút gọn text
    const truncateText = (text, limit) => {
        if (text.length <= limit) return text;
        return text.slice(0, limit) + "...";
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
                        Báo cáo hoạt động
                    </Typography>
                </CardHeader>

                <CardBody className="px-0 pt-0 pb-2 overflow-auto">
                    <div className="flex items-center justify-between gap-4 p-4 px-6">
                        {/* Cột trái - Tìm kiếm và bộ lọc */}
                        <div className="w-full flex flex-wrap flex-col lg:flex-row items-start lg:items-center gap-4">
                            {/* Thanh tìm kiếm */}
                            <div className="w-full lg:w-96">
                                <Input
                                    label={
                                        <span className="overflow-hidden whitespace-nowrap text-ellipsis">
                                            Tìm theo tên báo cáo / nhân sự phụ trách
                                        </span>
                                    }
                                    icon={<i className="fas fa-search" />}
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Bộ lọc ngày */}
                            <div className="flex items-center gap-2">
                                <div className="">
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
                                <div className="">
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
                                {/* Nút reset bộ lọc */}
                                {(dateFilter.startDate || dateFilter.endDate) &&
                                    (
                                        <Button
                                            variant="text"
                                            color="red"
                                            className="p-2"
                                            onClick={() =>
                                                setDateFilter({
                                                    startDate: "",
                                                    endDate: "",
                                                })}
                                        >
                                            <XMarkIcon className="w-4 h-4" />
                                        </Button>
                                    )}
                            </div>
                        </div>

                        {/* Cột phải - Nút thêm */}
                        <div className="w-full lg:w-auto flex justify-end">
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
                        dateFilter.endDate) && (
                        <div className="px-6 mb-4">
                            <Typography variant="small" color="blue-gray">
                                Tìm thấy {filteredReports.length} kết quả
                                {searchTerm && ` cho "${searchTerm}"`}
                                {dateFilter.startDate &&
                                    ` từ ${
                                        new Date(dateFilter.startDate)
                                            .toLocaleDateString("vi-VN")
                                    }`}
                                {dateFilter.endDate &&
                                    ` đến ${
                                        new Date(dateFilter.endDate)
                                            .toLocaleDateString("vi-VN")
                                    }`}
                            </Typography>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <Spinner className="w-12 h-12" color="pink" />
                        </div>
                    ) : filteredReports.length === 0 ? (
                        // Thêm thông báo khi không có báo cáo
                        <div className="flex flex-col items-center justify-center h-64 gap-4">
                            <Typography variant="h6" color="blue-gray" className="font-normal">
                                Hiện tại chưa có báo cáo nào
                            </Typography>
                            <Button
                                className="flex items-center gap-3"
                                color={sidenavColor}
                                size="sm"
                                onClick={openAddDialog}
                            >
                                <FaPlus className="w-4 h-4" /> Thêm báo cáo mới
                            </Button>
                        </div>
                    ) : (
                        <div>
                            <div className="w-full overflow-x-auto">
                                <table className="w-full min-w-[800px] table-auto">
                                    <thead>
                                        <tr>
                                            {[
                                                { id: "stt", label: "STT", width: "w-[5%]" },
                                                { id: "ten", label: "Tên báo cáo", width: "w-[30%]" },
                                                { id: "ngay", label: "Ngày báo cáo", width: "w-[20%]" },
                                                { id: "nhansu", label: "Nhân sự phụ trách", width: "w-[25%]" },
                                                { id: "thaotac", label: "Thao tác", width: "w-[20%]" }
                                            ].map(({ id, label, width }) => (
                                                <th
                                                    key={id}
                                                    className={`${width} px-2 md:px-5 py-2 md:py-3 text-left border-b border-blue-gray-50`}
                                                >
                                                    <Typography
                                                        variant="small"
                                                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                                                    >
                                                        {label}
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
                                                        <td className={`${className} w-[5%]`}>
                                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                                {indexOfFirstItem + key + 1}
                                                            </Typography>
                                                        </td>
                                                        <td className={`${className} w-[30%]`}>
                                                            <Tooltip
                                                                content={tenBaoCao}
                                                                animate={{
                                                                    mount: { scale: 1, y: 0 },
                                                                    unmount: { scale: 0, y: 25 },
                                                                }}
                                                                className="bg-black bg-opacity-80"
                                                            >
                                                                <Typography className="text-xs font-semibold text-blue-gray-600">
                                                                    {truncateText(tenBaoCao, 30)}
                                                                </Typography>
                                                            </Tooltip>
                                                        </td>
                                                        <td className={`${className} w-[20%]`}>
                                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                                {formatDateVN(ngayBaoCao)}
                                                            </Typography>
                                                        </td>
                                                        <td className={`${className} w-[25%]`}>
                                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                                {nhanSuPhuTrach}
                                                            </Typography>
                                                        </td>
                                                        <td className={`${className} w-[20%]`}>
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
                            </div>

                            {/* Phân trang */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-4 mt-6">
                                    <Button
                                        variant="text"
                                        className="flex items-center gap-2"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeftIcon strokeWidth={2} className="h-4 w-4" /> Trước
                                    </Button>

                                    <div className="flex items-center gap-2">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <IconButton
                                                key={page}
                                                variant={currentPage === page ? "filled" : "text"}
                                                color={currentPage === page ? "blue" : "gray"}
                                                onClick={() => handlePageChange(page)}
                                            >
                                                {page}
                                            </IconButton>
                                        ))}
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
                                            className="w-4 h-4"
                                        />
                                    </Button>
                                </div>
                                )}
                            </div>
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

                <DialogBody
                    divider
                    className="grid lg:grid-cols-2 gap-4 overflow-y-auto lg:max-h-[64vh] sm:max-h-[47vh]"
                >
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

                    <div className="relative main-staff-container">
                        <Input
                            label="Nhân sự phụ trách"
                            value={newReport.nhanSuPhuTrach}
                            onChange={(e) => {
                                handleMainStaffSearch(e.target.value);
                                setErrors({ ...errors, nhanSuPhuTrach: "" });
                            }}
                            onFocus={() => {
                                setShowMainStaffDropdown(true);
                                setFilteredStudents(students);
                            }}
                            error={!!errors.nhanSuPhuTrach || !!memberValidationError}
                        />
                        {showMainStaffDropdown && (
                            <div className="absolute z-50 w-full mt-1 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg max-h-60">
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.slice(0, 5).map((student) => (
                                        <div
                                            key={student._id}
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                            onClick={() =>
                                            handleSelectMainStaff(student)}
                                        >
                                            <Typography className="text-sm">
                                                {student.hoTen}
                                            </Typography>
                                            <Typography className="text-xs text-gray-600">
                                                MSHS: {student.mssv}
                                            </Typography>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-2 text-gray-500">
                                        Không tìm thấy thành viên phù hợp
                                    </div>
                                )}
                            </div>
                        )}
                        {(errors.nhanSuPhuTrach || memberValidationError) && (
                            <Typography color="red" className="mt-1 text-xs">
                                {errors.nhanSuPhuTrach || memberValidationError}
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
                                className="relative flex flex-col gap-2 p-4 mb-4 border rounded-lg"
                            >
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="relative event-suggestion-container">
                                        <Input
                                            label="Tên sự kiện"
                                            value={event.tenSuKien}
                                            onChange={(e) =>
                                                handleEventNameChange(e, index)}
                                            onFocus={() => {
                                                setIsFocused((prev) => ({
                                                    ...prev,
                                                    eventIndex: index,
                                                }));
                                                if (club) {
                                                    handleEventNameChange({
                                                        target: { value: "" },
                                                    }, index);
                                                }
                                            }}
                                        />
                                        {eventSuggestions.index === index &&
                                            eventSuggestions.suggestions
                                                    .length > 0 &&
                                            (
                                                <div className="absolute z-50 w-full mt-1 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg max-h-60">
                                                    {eventSuggestions
                                                        .suggestions.map((
                                                            suggestion,
                                                        ) => (
                                                            <div
                                                                key={suggestion
                                                                    ._id}
                                                                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                                                onClick={() =>
                                                                    handleEventSuggestionClick(
                                                                        suggestion,
                                                                        index,
                                                                    )}
                                                            >
                                                                <Typography className="text-sm font-medium">
                                                                    {suggestion
                                                                        .ten}
                                                                </Typography>
                                                                <Typography className="text-xs text-gray-600">
                                                                    {suggestion
                                                                        .nguoiPhuTrach}
                                                                    {" "}
                                                                    -{" "}
                                                                    {formatDateVN(
                                                                        suggestion
                                                                            .ngayToChuc,
                                                                    )}
                                                                </Typography>
                                                            </div>
                                                        ))}
                                                </div>
                                            )}
                                    </div>

                                    <div className="relative">
                                        <Typography
                                            variant="small"
                                            className="absolute -top-2 left-2 px-2 bg-white text-blue-gray-500 text-[11px] font-normal z-10"
                                        >
                                            Người phụ trách
                                        </Typography>
                                        <Input
                                            value={event.nguoiPhuTrach || ""}
                                            disabled={true}
                                            className="!border !border-blue-gray-100 !bg-white"
                                            labelProps={{
                                                className: "hidden",
                                            }}
                                        />
                                    </div>

                                    <div className="relative">
                                        <Typography
                                            variant="small"
                                            className="absolute -top-2 left-2 px-2 bg-white text-blue-gray-500 text-[11px] font-normal z-10"
                                        >
                                            Ngày tổ chức
                                        </Typography>
                                        <Input
                                            type="date"
                                            value={event.ngayToChuc || ""}
                                            disabled={true}
                                            className="!border !border-blue-gray-100 !bg-white"
                                            labelProps={{
                                                className: "hidden",
                                            }}
                                        />
                                    </div>
                                </div>
                                <Button
                                    color="red"
                                    size="sm"
                                    className="self-end"
                                    onClick={() => handleRemoveEvent(index)}
                                >
                                    Xóa
                                </Button>
                            </div>
                        ))}
                        <Button color={sidenavColor} size="sm" onClick={handleAddEvent}>
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
                                className="relative flex flex-col gap-2 p-4 mb-4 border rounded-lg"
                            >
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="relative award-suggestion-container">
                                        <Input
                                            label="Tên giải"
                                            value={award.tenGiai}
                                            onChange={(e) =>
                                                handleAwardNameChange(e, index)}
                                            onFocus={() => {
                                                setIsFocused((prev) => ({
                                                    ...prev,
                                                    awardIndex: index,
                                                }));
                                                if (club) {
                                                    handleAwardNameChange({
                                                        target: { value: "" },
                                                    }, index);
                                                }
                                            }}
                                        />
                                        {awardSuggestions.index === index &&
                                            awardSuggestions.suggestions
                                                    .length > 0 &&
                                            (
                                                <div className="absolute z-50 w-full mt-1 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg max-h-60">
                                                    {awardSuggestions
                                                        .suggestions.map((
                                                            suggestion,
                                                        ) => (
                                                            <div
                                                                key={suggestion
                                                                    ._id}
                                                                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                                                onClick={() =>
                                                                    handleAwardSuggestionClick(
                                                                        suggestion,
                                                                        index,
                                                                    )}
                                                            >
                                                                <Typography className="text-sm font-medium">
                                                                    {suggestion
                                                                        .tenGiai}
                                                                </Typography>
                                                                <Typography className="text-xs text-gray-600">
                                                                    {suggestion
                                                                        .nguoiNhanGiai}
                                                                    {" "}
                                                                    -{" "}
                                                                    {formatDateVN(
                                                                        suggestion
                                                                            .ngayNhanGiai,
                                                                    )}
                                                                </Typography>
                                                            </div>
                                                        ))}
                                                </div>
                                            )}
                                    </div>

                                    <div className="relative">
                                        <Typography
                                            variant="small"
                                            className="absolute -top-2 left-2 px-2 bg-white text-blue-gray-500 text-[11px] font-normal z-10"
                                        >
                                            Người nhận giải
                                        </Typography>
                                        <Input
                                            value={award.nguoiNhanGiai}
                                            disabled
                                            className="!border !border-blue-gray-100 !bg-white"
                                            labelProps={{
                                                className: "hidden",
                                            }}
                                        />
                                    </div>

                                    <div className="relative">
                                        <Typography
                                            variant="small"
                                            className="absolute -top-2 left-2 px-2 bg-white text-blue-gray-500 text-[11px] font-normal z-10"
                                        >
                                            Ngày nhận giải
                                        </Typography>
                                        <Input
                                            type="date"
                                            value={award.ngayNhanGiai}
                                            disabled
                                            className="!border !border-blue-gray-100 !bg-white"
                                            labelProps={{
                                                className: "hidden",
                                            }}
                                        />
                                    </div>
                                </div>
                                <Button
                                    color="red"
                                    size="sm"
                                    className="self-end"
                                    onClick={() => handleRemoveAward(index)}
                                >
                                    Xóa
                                </Button>
                            </div>
                        ))}
                        <Button color={sidenavColor} size="sm" onClick={handleAddAward}>
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
                                setErrors({
                                    ...errors,
                                    tongNganSachChiTieu: "",
                                });
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

                    <div className="w-full col-span-2">
                        <Textarea
                            label="Kết quả đạt được"
                            value={newReport.ketQuaDatDuoc}
                            onChange={(e) => setNewReport({
                                ...newReport,
                                ketQuaDatDuoc: e.target.value,
                            })}
                            className="w-full !min-h-[100px]"
                            rows={4}
                        />
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
                        <Typography variant="h6">
                            Chi tiết báo cáo hoạt động
                        </Typography>
                        <Typography
                            variant="small"
                            className="px-3 py-1 font-bold text-white uppercase bg-blue-500 rounded-full"
                        >
                            {detailReport?.ngayBaoCao &&
                                new Date(detailReport.ngayBaoCao)
                                    .toLocaleDateString("vi-VN", {
                                        month: "long",
                                        year: "numeric",
                                    })}
                        </Typography>
                    </div>
                </DialogHeader>

                {detailReport && (
                    <DialogBody
                        divider
                        className="overflow-y-auto lg:max-h-[65vh] sm:max-h-[50vh] p-6"
                    >
                        <div className="flex gap-6">
                            {/* Cột trái - Thông tin cơ bản */}
                            <div className="flex-1">
                                <div className="p-6 rounded-lg bg-blue-gray-50">
                                    {/* Tên báo cáo */}
                                    <div className="mb-6 text-center">
                                        <Typography
                                            variant="h4"
                                            color="blue"
                                            className="p-4 mb-3 font-bold bg-white border-2 border-blue-500 border-dashed rounded-lg"
                                        >
                                            {detailReport.tenBaoCao}
                                        </Typography>
                                        <Typography
                                            variant="small"
                                            className="inline-block px-4 py-2 font-medium text-blue-900 bg-white rounded-full"
                                        >
                                            Người phụ trách:{" "}
                                            {detailReport.nhanSuPhuTrach}
                                        </Typography>
                                    </div>

                                    {/* Thông tin tài chính */}
                                    <div className="p-4 mb-4 bg-white rounded-lg">
                                        <Typography className="mb-3 text-sm font-medium text-gray-600">
                                            Tổng quan tài chính
                                        </Typography>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-3 text-center rounded-lg bg-green-50">
                                                <Typography className="mb-1 text-sm text-green-600">
                                                    Tổng thu
                                                </Typography>
                                                <Typography className="text-xl font-bold text-green-600">
                                                    {detailReport.tongThu
                                                        ?.toLocaleString(
                                                            "vi-VN",
                                                        )} đ
                                                </Typography>
                                            </div>
                                            <div className="p-3 text-center rounded-lg bg-red-50">
                                                <Typography className="mb-1 text-sm text-red-600">
                                                    Tổng chi
                                                </Typography>
                                                <Typography className="text-xl font-bold text-red-600">
                                                    {detailReport
                                                        .tongNganSachChiTieu
                                                        ?.toLocaleString(
                                                            "vi-VN",
                                                        )} đ
                                                </Typography>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Kết quả đạt được */}
                                    <div className="p-4 bg-white rounded-lg">
                                        <Typography className="mb-2 text-sm font-medium text-gray-600">
                                            Kết quả đạt được
                                        </Typography>
                                        <Typography className="whitespace-pre-line text-blue-gray-800">
                                            {detailReport.ketQuaDatDuoc ||
                                                "Chưa cập nhật"}
                                        </Typography>
                                    </div>
                                </div>
                            </div>

                            {/* Cột phải - Thông tin chi tiết */}
                            <div className="flex-[1.5]">
                                <div className="grid gap-4">
                                    {/* Danh sách sự kiện */}
                                    <div className="p-4 rounded-lg bg-blue-gray-50">
                                        <Typography className="mb-3 text-lg font-semibold text-blue-gray-800">
                                            Danh sách sự kiện
                                        </Typography>
                                        <div className="grid gap-3">
                                            {detailReport.danhSachSuKien.map((
                                                event,
                                                index,
                                            ) => (
                                                <div
                                                    key={index}
                                                    className="p-3 bg-white rounded-lg"
                                                >
                                                    <Typography className="mb-2 font-medium text-blue-900">
                                                        {event.tenSuKien}
                                                    </Typography>
                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                        <div>
                                                            <Typography className="text-gray-600">
                                                                Người phụ trách:
                                                            </Typography>
                                                            <Typography className="font-medium">
                                                                {event
                                                                    .nguoiPhuTrach}
                                                            </Typography>
                                                        </div>
                                                        <div>
                                                            <Typography className="text-gray-600">
                                                                Ngày tổ chức:
                                                            </Typography>
                                                            <Typography className="font-medium">
                                                                {new Date(
                                                                    event
                                                                        .ngayToChuc,
                                                                ).toLocaleDateString(
                                                                    "vi-VN",
                                                                )}
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Danh sách giải thưởng */}
                                    <div className="p-4 rounded-lg bg-blue-gray-50">
                                        <Typography className="mb-3 text-lg font-semibold text-blue-gray-800">
                                            Danh sách giải thưởng
                                        </Typography>
                                        <div className="grid gap-3">
                                            {detailReport.danhSachGiai.map((
                                                award,
                                                index,
                                            ) => (
                                                <div
                                                    key={index}
                                                    className="p-3 bg-white rounded-lg"
                                                >
                                                    <Typography className="mb-2 font-medium text-blue-900">
                                                        {award.tenGiai}
                                                    </Typography>
                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                        <div>
                                                            <Typography className="text-gray-600">
                                                                Người nhận giải:
                                                            </Typography>
                                                            <Typography className="font-medium">
                                                                {award
                                                                    .nguoiNhanGiai}
                                                            </Typography>
                                                        </div>
                                                        <div>
                                                            <Typography className="text-gray-600">
                                                                Ngày nhận:
                                                            </Typography>
                                                            <Typography className="font-medium">
                                                                {new Date(
                                                                    award
                                                                        .ngayNhanGiai,
                                                                ).toLocaleDateString(
                                                                    "vi-VN",
                                                                )}
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Ghi chú */}
                                    <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                                        <Typography
                                            variant="small"
                                            className="text-orange-800"
                                        >
                                            <strong>Lưu ý:</strong>{" "}
                                            Báo cáo này được tạo vào ngày{" "}
                                            {new Date(detailReport.ngayBaoCao)
                                                .toLocaleDateString("vi-VN", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
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
