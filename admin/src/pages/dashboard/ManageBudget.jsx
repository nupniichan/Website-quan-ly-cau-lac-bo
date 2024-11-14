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
    Input,
    Spinner,
    Tooltip,
    Typography
} from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { FaPlus } from "react-icons/fa6";
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from "@heroicons/react/24/outline";

const API_URL = "http://localhost:5500/api";

const ManageBudget = () => {
    const [budgets, setBudgets] = useState([]);
    const [club, setClub] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [newBudget, setNewBudget] = useState({
        ten: "",
        khoanChiTieu: 0,
        nguonThu: 0,
        ngay: "",
        thanhVienChiuTrachNhiem: "",
        noiDung: "",
    });
    const [detailBudget, setDetailBudget] = useState(null);
    const [editingBudgetId, setEditingBudgetId] = useState(null);
    const [clubs, setClubs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [errors, setErrors] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState({
        startDate: "",
        endDate: ""
    });
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [showStudentDropdown, setShowStudentDropdown] = useState(false);

    useEffect(() => {
        const managedClubsString = localStorage.getItem("managedClubs");
        if (managedClubsString) {
            try {
                const managedClubs = JSON.parse(managedClubsString);
                if (managedClubs && managedClubs.length > 0) {
                    setClub(managedClubs[0]);
                    fetchBudgets(managedClubs[0]._id);
                } else {
                    throw new Error("No managed clubs found");
                }
            } catch (error) {
                console.error("Error parsing managed clubs data:", error);
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
        fetchClubs();
    }, []);

    useEffect(() => {
        if (club?._id) {
            fetchMembersByClub(club._id);
        }
    }, [club]);

    const fetchBudgets = async (clubId) => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `${API_URL}/get-budgets-by-club/${clubId}`,
            );
            setBudgets(response.data);
        } catch (error) {
            console.error("Error fetching budgets:", error);
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

    const fetchMembersByClub = async (clubId) => {
        try {
            const response = await axios.get(`${API_URL}/get-members-by-club/${clubId}`);
            const formattedMembers = response.data.map(member => ({
                _id: member._id,
                hoTen: member.hoTen,
                mssv: member.maSoHocSinh
            }));
            setStudents(formattedMembers);
        } catch (error) {
            console.error("Error fetching members:", error);
        }
    };

    const handleStudentSearch = (value) => {
        setNewBudget({ ...newBudget, thanhVienChiuTrachNhiem: value });
        setShowStudentDropdown(true);
        
        if (value.trim() === '') {
            const shuffled = [...students].sort(() => 0.5 - Math.random());
            setFilteredStudents(shuffled.slice(0, 5));
            return;
        }

        const filtered = students.filter(student => 
            student.hoTen.toLowerCase().includes(value.toLowerCase()) ||
            student.mssv.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredStudents(filtered.slice(0, 5));
    };

    const handleSelectStudent = (student) => {
        setNewBudget({ ...newBudget, thanhVienChiuTrachNhiem: student.hoTen });
        setShowStudentDropdown(false);
        setErrors({ ...errors, thanhVienChiuTrachNhiem: "" });
    };

    const validateForm = () => {
        const newErrors = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Validate tên ngân sách
        if (!newBudget.ten?.trim()) {
            newErrors.ten = "Vui lòng nhập tên ngân sách";
        }

        // Validate khoản chi tiêu
        const expense = Number(newBudget.khoanChiTieu);
        if (isNaN(expense) || expense < 0) {
            newErrors.khoanChiTieu = "Khoản chi tiêu không được âm";
        } else if (expense > 100000000) {
            newErrors.khoanChiTieu = "Khoản chi tiêu không được vượt quá 100 triệu";
        }

        // Validate nguồn thu
        const revenue = Number(newBudget.nguonThu);
        if (isNaN(revenue) || revenue < 0) {
            newErrors.nguonThu = "Nguồn thu không được âm";
        } else if (revenue > 100000000) {
            newErrors.nguonThu = "Nguồn thu không được vượt quá 100 triệu";
        }

        // Validate ngày
        if (!newBudget.ngay) {
            newErrors.ngay = "Vui lòng chọn ngày";
        } else {
            const budgetDate = new Date(newBudget.ngay);
            budgetDate.setHours(0, 0, 0, 0);
            
            if (budgetDate.getTime() > today.getTime()) {
                newErrors.ngay = "Ngày không được là ngày tương lai";
            }
        }

        // Validate thành viên chịu trách nhiệm
        if (!newBudget.thanhVienChiuTrachNhiem?.trim()) {
            newErrors.thanhVienChiuTrachNhiem = "Vui lòng nhập thành viên chịu trách nhiệm";
        }

        // Validate nội dung
        if (!newBudget.noiDung?.trim()) {
            newErrors.noiDung = "Vui lòng nhập nội dung";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddBudget = async () => {
        if (!validateForm()) return;

        try {
            if (!club) {
                throw new Error("Club information is not available");
            }

            const budgetData = {
                ...newBudget,
                club: club._id,
            };
            await axios.post(`${API_URL}/add-budget`, budgetData);
            setIsDialogOpen(false);
            fetchBudgets(club._id);
        } catch (error) {
            console.error("Error adding budget:", error);
            alert(`Lỗi khi thêm ngân sách: ${error.message || "Không xác định"}`);
        }
    };

    const handleUpdateBudget = async () => {
        if (!validateForm()) return;

        try {
            await axios.put(
                `${API_URL}/update-budget/${editingBudgetId}`,
                newBudget
            );
            setIsDialogOpen(false);
            setEditingBudgetId(null);
            fetchBudgets(club._id);
        } catch (error) {
            console.error("Error updating budget:", error);
            alert(
                `Lỗi khi cập nhật ngân sách: ${
                    error.response?.data?.message || "Không xác định"
                }`
            );
        }
    };

    const handleDeleteBudget = async (budgetId) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa ngân sách này?")) {
            try {
                await axios.delete(
                    `${API_URL}/delete-budget/${budgetId}/${club._id}`,
                );
                setBudgets(budgets.filter((b) => b._id !== budgetId));
            } catch (error) {
                console.error("Error deleting budget:", error);
                alert(
                    `Lỗi khi xóa ngân sách: ${
                        error.response?.data?.message || "Không xác định"
                    }`,
                );
            }
        }
    };

    const openAddDialog = () => {
        setNewBudget({
            ten: "",
            khoanChiTieu: 0,
            nguonThu: 0,
            ngay: new Date().toISOString().split('T')[0],
            thanhVienChiuTrachNhiem: "",
            noiDung: "",
            club: "",
        });
        setEditingBudgetId(null);
        setIsDialogOpen(true);
        setErrors({}); // Reset errors
    };

    const openEditDialog = (id) => {
        const budgetToEdit = budgets.find((budget) => budget._id === id);
        if (budgetToEdit) {
            setErrors({}); // Reset errors khi mở form edit
            setNewBudget({
                ...budgetToEdit,
                ngay: budgetToEdit.ngay.split('T')[0], // Format ngày
            });
            setEditingBudgetId(id);
            setIsDialogOpen(true);
        }
    };

    const openDetailDialog = (id) => {
        const budgetToView = budgets.find((budget) => budget._id === id);
        if (budgetToView) {
            setDetailBudget(budgetToView);
            setIsDetailDialogOpen(true);
        }
    };

    // Tính toán budgets cho trang hiện tại
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBudgets = budgets.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(budgets.length / itemsPerPage);

    // Thêm hàm để xử lý chuyển trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Cập nhật hàm lọc budgets
    const filteredBudgets = useMemo(() => {
        return budgets.filter(budget => {
            // Lọc theo tên ngân sách
            const matchesSearch = budget.ten
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

            // Lọc theo khoảng thời gian
            const budgetDate = new Date(budget.ngay);
            const matchesDateRange = (!dateFilter.startDate || new Date(dateFilter.startDate) <= budgetDate) &&
                (!dateFilter.endDate || new Date(dateFilter.endDate) >= budgetDate);

            return matchesSearch && matchesDateRange;
        });
    }, [budgets, searchTerm, dateFilter]);

    // Reset trang khi thay đổi bộ lọc
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, dateFilter]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const dropdown = document.getElementById('student-dropdown');
            const input = document.getElementById('student-input');
            
            if (dropdown && input && 
                !dropdown.contains(event.target) && 
                !input.contains(event.target)) {
                setShowStudentDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="flex flex-col gap-12 mt-12 mb-8">
            <Card>
                <CardHeader
                    variant="gradient"
                    color="blue"
                    className="p-6 mb-8"
                >
                    <Typography variant="h6" color="white">
                        Quản lý ngân sách
                    </Typography>
                </CardHeader>
                <CardBody className="px-0 pt-0 pb-2">
                    <div className="flex flex-wrap items-center justify-between gap-4 p-4 px-6">
                        {/* Cột trái - Tìm kiếm và bộ lọc */}
                        <div className="flex flex-wrap items-center gap-4">
                            {/* Thanh tìm kiếm */}
                            <div className="w-72">
                                <Input
                                    label="Tìm kiếm theo tên ngân sách"
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
                                {(dateFilter.startDate || dateFilter.endDate || searchTerm) && (
                                    <Button
                                        variant="text"
                                        color="red"
                                        className="p-2"
                                        onClick={() => {
                                            setDateFilter({ startDate: "", endDate: "" });
                                            setSearchTerm("");
                                        }}
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
                                    onClick={() => {
                                        setNewBudget({
                                            ten: "",
                                            khoanChiTieu: "",
                                            nguonThu: "",
                                            ngay: "",
                                            thanhVienChiuTrachNhiem: "",
                                            noiDung: "",
                                            club: "",
                                        });
                                        setEditingBudgetId(null);
                                        setIsDialogOpen(true);
                                    }}
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
                                Tìm thấy {filteredBudgets.length} kết quả
                                {searchTerm && ` cho "${searchTerm}"`}
                                {dateFilter.startDate && ` từ ${new Date(dateFilter.startDate).toLocaleDateString('vi-VN')}`}
                                {dateFilter.endDate && ` đến ${new Date(dateFilter.endDate).toLocaleDateString('vi-VN')}`}
                            </Typography>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <Spinner className="w-12 h-12" color="blue" />
                        </div>
                    ) : (
                        // Cập nhật phần hiển thị bảng để sử dụng filteredBudgets
                        <table className="w-full min-w-[640px] table-auto">
                            <thead>
                                <tr>
                                    {[
                                        "Tên ngân sách",
                                        "Khoản chi tiêu",
                                        "Tổng thu",
                                        "Ngày",
                                        "Thành viên chịu trách nhiệm",
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
                                {filteredBudgets
                                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                    .map(({ _id, ten, khoanChiTieu, nguonThu, ngay, thanhVienChiuTrachNhiem }) => {
                                        const className = "p-4";
                                        return (
                                            <tr key={_id}>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {ten}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {khoanChiTieu
                                                            .toLocaleString()}
                                                        {" "}
                                                        VND
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {nguonThu
                                                            .toLocaleString()}
                                                        {" "}
                                                        VND
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {new Date(ngay).toLocaleDateString('vi-VN', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric'
                                                        })}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {thanhVienChiuTrachNhiem}
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
                                                        <Tooltip
                                                            content="Sửa"
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
                                                                color="red"
                                                                className="flex items-center gap-2"
                                                                onClick={() =>
                                                                    handleDeleteBudget(
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
                                    })}
                            </tbody>
                        </table>
                    )}

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
                </CardBody>
            </Card>

            {/* Dialog thêm/sửa ngân sách */}
            <Dialog
                open={isDialogOpen}
                handler={() => setIsDialogOpen(false)}
                size="lg"
            >
                <DialogHeader className="lg:text-2xl md:text-xl sm:text-base">
                    {editingBudgetId
                        ? "Chỉnh sửa Ngân sách"
                        : "Thêm Ngân sách Mới"}
                </DialogHeader>
                <DialogBody divider className="grid grid-cols-2 gap-4 overflow-y-auto lg:max-h-[80vh] sm:max-h-[47vh]">
                    <div>
                        <Input
                            label="Tên ngân sách"
                            value={newBudget.ten}
                            onChange={(e) => {
                                setNewBudget({ ...newBudget, ten: e.target.value });
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
                            type="number"
                            label="Khoản chi tiêu"
                            value={newBudget.khoanChiTieu}
                            onChange={(e) => {
                                setNewBudget({
                                    ...newBudget,
                                    khoanChiTieu: e.target.value,
                                });
                                setErrors({ ...errors, khoanChiTieu: "" });
                            }}
                            error={!!errors.khoanChiTieu}
                        />
                        {errors.khoanChiTieu && (
                            <Typography color="red" className="mt-1 text-xs">
                                {errors.khoanChiTieu}
                            </Typography>
                        )}
                    </div>

                    <div>
                        <Input
                            type="number"
                            label="Nguồn thu"
                            value={newBudget.nguonThu}
                            onChange={(e) => {
                                setNewBudget({
                                    ...newBudget,
                                    nguonThu: e.target.value,
                                });
                                setErrors({ ...errors, nguonThu: "" });
                            }}
                            error={!!errors.nguonThu}
                        />
                        {errors.nguonThu && (
                            <Typography color="red" className="mt-1 text-xs">
                                {errors.nguonThu}
                            </Typography>
                        )}
                    </div>

                    <div>
                        <Input
                            type="date"
                            label="Ngày"
                            value={newBudget.ngay}
                            onChange={(e) => {
                                setNewBudget({
                                    ...newBudget,
                                    ngay: e.target.value,
                                });
                                setErrors({ ...errors, ngay: "" });
                            }}
                            error={!!errors.ngay}
                            max={new Date().toISOString().split("T")[0]}
                        />
                        {errors.ngay && (
                            <Typography color="red" className="mt-1 text-xs">
                                {errors.ngay}
                            </Typography>
                        )}
                    </div>

                    <div className="relative">
                        <Input
                            id="student-input"
                            label="Thành viên chịu trách nhiệm"
                            value={newBudget.thanhVienChiuTrachNhiem}
                            onChange={(e) => handleStudentSearch(e.target.value)}
                            error={!!errors.thanhVienChiuTrachNhiem}
                            onFocus={() => {
                                setShowStudentDropdown(true);
                                const shuffled = [...students].sort(() => 0.5 - Math.random());
                                setFilteredStudents(shuffled.slice(0, 5));
                            }}
                        />
                        {errors.thanhVienChiuTrachNhiem && (
                            <Typography color="red" className="mt-1 text-xs">
                                {errors.thanhVienChiuTrachNhiem}
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
                                        onClick={() => handleSelectStudent(student)}
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
                            label="Nội dung"
                            value={newBudget.noiDung}
                            onChange={(e) => {
                                setNewBudget({
                                    ...newBudget,
                                    noiDung: e.target.value,
                                });
                                setErrors({ ...errors, noiDung: "" });
                            }}
                            error={!!errors.noiDung}
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
                        onClick={editingBudgetId
                            ? handleUpdateBudget
                            : handleAddBudget}
                    >
                        {editingBudgetId ? "Cập nhật" : "Thêm"}
                    </Button>
                </DialogFooter>
            </Dialog>

            {/* Dialog xem chi tiết ngân sách */}
            <Dialog
                open={isDetailDialogOpen}
                handler={() => setIsDetailDialogOpen(false)}
                size="xl"
            >
                <DialogHeader className="flex items-center gap-4">
                    <Typography variant="h6">Chi tiết ngân sách</Typography>
                    <Typography 
                        variant="small" 
                        className={`
                            px-3 py-1 rounded-full font-bold uppercase
                            ${detailBudget?.nguonThu > detailBudget?.khoanChiTieu 
                                ? 'bg-green-500 text-white' 
                                : 'bg-red-500 text-white'}
                        `}
                    >
                        {detailBudget?.nguonThu > detailBudget?.khoanChiTieu ? 'Dư' : 'Thiếu'}
                    </Typography>
                </DialogHeader>

                {detailBudget ? (
                    <DialogBody divider className="overflow-y-auto lg:max-h-[65vh] sm:max-h-[50vh] p-6">
                        <div className="flex gap-6">
                            {/* Cột trái - Thông tin cơ bản */}
                            <div className="flex-1">
                                <div className="bg-blue-gray-50 p-6 rounded-lg">
                                    {/* Tên ngân sách */}
                                    <div className="text-center mb-6">
                                        <Typography variant="h4" color="blue" className="font-bold mb-2">
                                            {detailBudget.ten}
                                        </Typography>
                                    </div>

                                    {/* Thông tin tài chính */}
                                    <div className="grid gap-4">
                                        <div className="bg-white p-4 rounded-lg">
                                            <Typography className="text-sm text-gray-600 mb-2">Tổng quan tài chính</Typography>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-center">
                                                    <Typography className="text-sm text-green-600 mb-1">Nguồn thu</Typography>
                                                    <Typography className="text-xl font-bold text-green-600">
                                                        {detailBudget.nguonThu.toLocaleString('vi-VN')} đ
                                                    </Typography>
                                                </div>
                                                <div className="text-center">
                                                    <Typography className="text-sm text-red-600 mb-1">Khoản chi</Typography>
                                                    <Typography className="text-xl font-bold text-red-600">
                                                        {detailBudget.khoanChiTieu.toLocaleString('vi-VN')} đ
                                                    </Typography>
                                                </div>
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <Typography className="text-sm text-gray-600 mb-1">Số dư</Typography>
                                                <Typography 
                                                    className={`text-xl font-bold text-center ${
                                                        detailBudget.nguonThu > detailBudget.khoanChiTieu 
                                                            ? 'text-green-600' 
                                                            : 'text-red-600'
                                                    }`}
                                                >
                                                    {(detailBudget.nguonThu - detailBudget.khoanChiTieu).toLocaleString('vi-VN')} đ
                                                </Typography>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Cột phải - Thông tin chi tiết */}
                            <div className="flex-[1.5]">
                                <div className="grid gap-4">
                                    <div className="bg-blue-gray-50 p-4 rounded-lg">
                                        <Typography className="text-sm text-gray-600 mb-2">Thời gian</Typography>
                                        <Typography className="font-medium">
                                            {new Date(detailBudget.ngay).toLocaleDateString('vi-VN', {
                                                weekday: 'long',
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            })}
                                        </Typography>
                                    </div>

                                    <div className="bg-blue-gray-50 p-4 rounded-lg">
                                        <Typography className="text-sm text-gray-600 mb-2">Người chịu trách nhiệm</Typography>
                                        <Typography className="font-medium">
                                            {detailBudget.thanhVienChiuTrachNhiem}
                                        </Typography>
                                    </div>

                                    <div className="bg-blue-gray-50 p-4 rounded-lg">
                                        <Typography className="text-sm text-gray-600 mb-2">Nội dung chi tiết</Typography>
                                        <Typography className="font-medium whitespace-pre-line">
                                            {detailBudget.noiDung || "Không có nội dung chi tiết"}
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DialogBody>
                ) : (
                    <DialogBody className="flex justify-center items-center h-64">
                        <Spinner className="h-12 w-12" color="blue" />
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

export default ManageBudget;
