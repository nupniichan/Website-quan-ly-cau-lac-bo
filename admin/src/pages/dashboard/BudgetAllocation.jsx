import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader, Input,
    Option,
    Select, Tooltip,
    Typography
} from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const API_URL = "http://localhost:5500/api";

const BudgetAllocation = () => {
    const [allocations, setAllocations] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newAllocation, setNewAllocation] = useState({
        club: "",
        amount: 0,
        purpose: "",
        allocationDate: "",
    });
    const [editingAllocationId, setEditingAllocationId] = useState(null);
    const [filters, setFilters] = useState({
        club: "",
        startDate: "",
        endDate: "",
        minAmount: "",
        maxAmount: "",
    });
    const [filterClub, setFilterClub] = useState("");
    const [detailAllocation, setDetailAllocation] = useState(null);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchAllocations();
        fetchClubs();
    }, []);

    const fetchAllocations = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `${API_URL}/get-budget-allocations`,
            );
            setAllocations(response.data);
        } catch (error) {
            console.error("Error fetching budget allocations:", error);
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

    // Thêm hàm validate chung
    const validateAllocationData = (allocationData) => {
        // Kiểm tra các trường bắt buộc
        const requiredFields = [
            { key: "club", label: "Câu lạc bộ" },
            { key: "amount", label: "Số tiền" },
            { key: "purpose", label: "Mục đích" },
            { key: "allocationDate", label: "Ngày phân bổ" },
        ];

        // Kiểm tra trường rỗng
        const emptyFields = requiredFields.filter(
            field => !allocationData[field.key]
        );
        
        if (emptyFields.length > 0) {
            throw new Error(
                `Vui lòng điền đầy đủ thông tin: ${emptyFields.map(f => f.label).join(", ")}`
            );
        }

        // Kiểm tra số tiền
        const amount = Number(allocationData.amount);
        if (amount <= 0) {
            throw new Error("Số tiền phân bổ không được âm hoặc bằng 0");
        }
        if (amount > 50000000) {
            throw new Error("Số tiền phân bổ không được vượt quá 50 triệu đồng");
        }

        // Kiểm tra ngày phân bổ phải là ngày hiện tại
        const allocationDate = new Date(allocationData.allocationDate);
        const today = new Date();
        
        // Reset time để so sánh chỉ theo ngày
        allocationDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (allocationDate.getTime() !== today.getTime()) {
            throw new Error("Ngày phân bổ phải là ngày hiện tại");
        }
    };

    const handleAddAllocation = async () => {
        try {
            validateAllocationData(newAllocation);

            const formattedData = {
                club: newAllocation.club,
                amount: Number(newAllocation.amount),
                purpose: newAllocation.purpose,
                allocationDate: newAllocation.allocationDate,
            };

            const response = await axios.post(
                `${API_URL}/add-budget-allocation`,
                formattedData
            );

            setIsDialogOpen(false);
            fetchAllocations();
        } catch (error) {
            // Xử lý lỗi validation
            if (error.message) {
                alert(error.message);
                return;
            }
            // Xử lý lỗi API
            console.error("Error adding budget allocation:", error);
            if (error.response?.data) {
                alert(
                    `Lỗi khi thêm phân bổ ngân sách: ${
                        error.response.data.message || "Không xác định"
                    }`
                );
            } else {
                alert("Không thể kết nối đến server. Vui lòng thử lại sau.");
            }
        }
    };

    const handleUpdateAllocation = async () => {
        try {
            validateAllocationData(newAllocation);

            const response = await axios.put(
                `${API_URL}/update-budget-allocation/${editingAllocationId}`,
                newAllocation
            );
            setIsDialogOpen(false);
            setEditingAllocationId(null);
            fetchAllocations();
        } catch (error) {
            // Xử lý lỗi validation
            if (error.message) {
                alert(error.message);
                return;
            }
            // Xử lý lỗi API
            console.error("Error updating budget allocation:", error);
            if (error.response?.data) {
                alert(
                    `Lỗi khi cập nhật phân bổ ngân sách: ${
                        error.response.data.message || "Không xác định"
                    }`
                );
            } else {
                alert("Không thể kết nối đến server. Vui lòng thử lại sau.");
            }
        }
    };

    const handleDeleteAllocation = async (id) => {
        if (
            window.confirm("Bạn có chắc chắn muốn xóa phân bổ ngân sách này?")
        ) {
            try {
                const response = await axios.delete(
                    `${API_URL}/delete-budget-allocation/${id}`,
                );
                fetchAllocations();
            } catch (error) {
                console.error("Error deleting budget allocation:", error);
                alert(
                    `Lỗi khi xóa phân bổ ngân sách: ${
                        error.response?.data?.message || "Không xác định"
                    }`,
                );
            }
        }
    };

    const openAddDialog = () => {
        const today = new Date().toISOString().split("T")[0];
        setNewAllocation({
            club: "",
            amount: 0,
            purpose: "",
            allocationDate: today,
        });
        setEditingAllocationId(null);
        setIsDialogOpen(true);
    };

    const openEditDialog = (id) => {
        const allocationToEdit = allocations.find(
            (allocation) => allocation._id === id,
        );
        if (allocationToEdit) {
            setNewAllocation({
                ...allocationToEdit,
                allocationDate: allocationToEdit.allocationDate.split("T")[0],
            });
            setEditingAllocationId(id);
            setIsDialogOpen(true);
        }
    };

    const openDetailDialog = (allocation) => {
        setDetailAllocation(allocation);
        setIsDetailDialogOpen(true);
    };

    const filteredAllocations = useMemo(() => {
        return allocations
            .filter((allocation) => {
                const matchClub = !filters.club || allocation.club._id === filters.club;
                const matchDate = (!filters.startDate ||
                    new Date(allocation.allocationDate) >= new Date(filters.startDate)) &&
                    (!filters.endDate ||
                        new Date(allocation.allocationDate) <= new Date(filters.endDate));
                const matchAmount = (!filters.minAmount ||
                    allocation.amount >= Number(filters.minAmount)) &&
                    (!filters.maxAmount ||
                        allocation.amount <= Number(filters.maxAmount));
                
                const matchSearch = !searchTerm || (
                    allocation.club?.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    allocation.purpose.toLowerCase().includes(searchTerm.toLowerCase())
                );

                return matchClub && matchDate && matchAmount && matchSearch;
            })
            .sort((a, b) => new Date(b.allocationDate) - new Date(a.allocationDate));
    }, [allocations, filters, searchTerm]);

    // Tính toán allocations cho trang hiện tại
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAllocations = filteredAllocations.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredAllocations.length / itemsPerPage);

    // Reset trang khi thay đổi bộ lọc
    useEffect(() => {
        setCurrentPage(1);
    }, [filters, searchTerm]);

    // Thêm hàm format date kiểu VN
    const formatDateToVN = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="flex flex-col gap-12 mt-12 mb-8">
            <Card>
                <CardHeader
                    variant="gradient"
                    color="purple"
                    className="p-6 mb-8"
                >
                    <Typography variant="h6" color="white">
                        Phân bổ ngân sách
                    </Typography>
                </CardHeader>
                <CardBody className="px-0 pt-0 pb-2 overflow-auto">
                    <div className="flex justify-end p-4 px-6 pr-10">
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
                                color="purple"
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
                    {/* Thanh tìm kiếm đơn */}
                    <div className="px-6 py-3">
                        <div className="w-full">
                            <Input
                                label="Tìm kiếm theo tên câu lạc bộ hoặc mục đích"
                                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Phần filter hiện tại */}
                    <div className="px-6 py-3">
                        <div className="grid gap-4 2xl:grid-cols-5 xl:grid-cols-3 md:grid-cols-3 sm:grid-cols-2">
                            <Select
                                label="Câu lạc bộ"
                                value={filters.club}
                                onChange={(value) =>
                                    setFilters({ ...filters, club: value })}
                                menuProps={{ className: "absolute z-[70]" }}
                            >
                                <Option value="" className="bg-transparent">
                                    <strong>Tất cả</strong>
                                </Option>

                                <hr className="my-2 border-t border-gray-300" />

                                <div className="overflow-y-auto max-h-[200px]">
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
                            <Input
                                type="date"
                                label="Từ ngày"
                                value={filters.startDate}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        startDate: e.target.value,
                                    })}
                            />
                            <Input
                                type="date"
                                label="Đến ngày"
                                value={filters.endDate}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        endDate: e.target.value,
                                    })}
                            />
                            <Input
                                type="number"
                                label="Số tiền từ"
                                value={filters.minAmount}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        minAmount: e.target.value,
                                    })}
                            />
                            <Input
                                type="number"
                                label="Số tiền đến"
                                value={filters.maxAmount}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        maxAmount: e.target.value,
                                    })}
                            />
                        </div>
                    </div>

                    {/* Bảng hiển thị */}
                    <table className="w-full min-w-[640px] table-auto 2xl:mt-0 xl:mt-0 lg:mt-0 md:mt-0 sm:mt-0">
                        <thead>
                            <tr>
                                {[
                                    "STT",
                                    "Câu lạc bộ",
                                    "Số tiền",
                                    "Mục đích",
                                    "Ngày phân bổ",
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
                            {currentAllocations.map(
                                ({ _id, club, amount, purpose, allocationDate }, key) => {
                                    const className = `py-3 px-5 ${
                                        key === currentAllocations.length - 1
                                            ? ""
                                            : "border-b border-blue-gray-50"
                                    }`;

                                    return (
                                        <tr key={_id}>
                                            <td className={className}>
                                                <Typography className="text-xs font-semibold text-blue-gray-600">
                                                    {indexOfFirstItem + key + 1}
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Typography className="text-xs font-semibold text-blue-gray-600">
                                                    {club?.ten || "N/A"}
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Typography className="text-xs font-semibold text-blue-gray-600">
                                                    {amount
                                                        .toLocaleString()} VND
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Typography className="text-xs font-semibold text-blue-gray-600">
                                                    {purpose}
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Typography className="text-xs font-semibold text-blue-gray-600">
                                                    {formatDateToVN(allocationDate)}
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
                                                            onClick={() =>
                                                                openDetailDialog(
                                                                    {
                                                                        _id,
                                                                        club,
                                                                        amount,
                                                                        purpose,
                                                                        allocationDate,
                                                                    },
                                                                )}
                                                        >
                                                            <EyeIcon className="w-4 h-4" />
                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip
                                                        content="Sửa"
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
                                                            {" "}
                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip
                                                        content="Xóa"
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
                                                            color="red"
                                                            className="flex items-center gap-2"
                                                            onClick={() =>
                                                                handleDeleteAllocation(
                                                                    _id,
                                                                )}
                                                        >
                                                            <TrashIcon
                                                                strokeWidth={2}
                                                                className="w-4 h-4"
                                                            />
                                                            {" "}
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
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeftIcon strokeWidth={2} className="h-4 w-4" /> Trước
                        </Button>

                        <div className="flex items-center gap-2">
                            {totalPages <= 5 ? (
                                [...Array(totalPages)].map((_, index) => (
                                    <Button
                                        key={index + 1}
                                        variant={currentPage === index + 1 ? "gradient" : "text"}
                                        color="purple"
                                        onClick={() => setCurrentPage(index + 1)}
                                        className="w-10 h-10"
                                    >
                                        {index + 1}
                                    </Button>
                                ))
                            ) : (
                                <>
                                    <Button
                                        variant={currentPage === 1 ? "gradient" : "text"}
                                        color="purple"
                                        onClick={() => setCurrentPage(1)}
                                        className="w-10 h-10"
                                    >
                                        1
                                    </Button>

                                    {currentPage > 3 && <span className="mx-2">...</span>}

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
                                                color="purple"
                                                onClick={() => setCurrentPage(pageNumber)}
                                                className="w-10 h-10"
                                            >
                                                {pageNumber}
                                            </Button>
                                        );
                                    })}

                                    {currentPage < totalPages - 2 && <span className="mx-2">...</span>}

                                    <Button
                                        variant={currentPage === totalPages ? "gradient" : "text"}
                                        color="purple"
                                        onClick={() => setCurrentPage(totalPages)}
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
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Sau <ChevronRightIcon strokeWidth={2} className="h-4 w-4" />
                        </Button>
                    </div>
                </CardBody>
            </Card>

            {/* Dialog Chi tiết */}
            <Dialog
                open={isDetailDialogOpen}
                handler={() => setIsDetailDialogOpen(false)}
                size="lg"
            >
                <DialogHeader className="text-2xl font-bold">
                    Chi tiết Phân bổ Ngân sách
                </DialogHeader>
                {detailAllocation && (
                    <DialogBody divider className="overflow-y-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th colSpan="2" className="bg-purple-50 p-3 text-left text-lg font-bold text-purple-900">
                                        Thông tin phân bổ
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th className="border p-3 bg-gray-50 w-1/3">Câu lạc bộ</th>
                                    <td className="border p-3">{detailAllocation.club?.ten || "N/A"}</td>
                                </tr>
                                <tr>
                                    <th className="border p-3 bg-gray-50">Số tiền</th>
                                    <td className="border p-3 font-semibold text-purple-600">
                                        {detailAllocation.amount.toLocaleString()} VND
                                    </td>
                                </tr>
                                <tr>
                                    <th className="border p-3 bg-gray-50">Mục đích</th>
                                    <td className="border p-3">{detailAllocation.purpose}</td>
                                </tr>
                                <tr>
                                    <th className="border p-3 bg-gray-50">Ngày phân bổ</th>
                                    <td className="border p-3">
                                        {formatDateToVN(detailAllocation.allocationDate)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </DialogBody>
                )}
                <DialogFooter>
                    <Button
                        variant="gradient"
                        color="purple"
                        onClick={() => setIsDetailDialogOpen(false)}
                    >
                        Đóng
                    </Button>
                </DialogFooter>
            </Dialog>

            {/* Dialog thêm/sửa phân bổ ngân sách */}
            <Dialog
                open={isDialogOpen}
                handler={() => setIsDialogOpen(false)}
                size="md"
            >
                <DialogHeader className="lg:text-2xl md:text-xl sm:text-base">
                    {editingAllocationId
                        ? "Chỉnh sửa Phân bổ Ngân sách"
                        : "Thêm Phân bổ Ngân sách Mới"}
                </DialogHeader>
                <DialogBody
                    divider
                    className="grid grid-cols-2 gap-4 lg:max-h-[60vh] sm:max-h-[45vh]"
                >
                    <Select
                        label="Câu lạc bộ"
                        value={newAllocation.club}
                        onChange={(value) => {
                            console.log("Selected club:", value);
                            setNewAllocation({ ...newAllocation, club: value });
                        }}
                        menuProps={{ className: "absolute z-[70]", id: "club-select-dropdown" }}
                    >
                        {clubs.map((club) => (
                            <Option key={club._id} value={club._id}>
                                {club.ten}
                            </Option>
                        ))}
                    </Select>
                    <Input
                        type="number"
                        label="Số tiền"
                        value={newAllocation.amount}
                        onChange={(e) => setNewAllocation({
                            ...newAllocation,
                            amount: Number(e.target.value),
                        })}
                    />
                    <Input
                        label="Mục đích"
                        value={newAllocation.purpose}
                        onChange={(e) =>
                            setNewAllocation({
                                ...newAllocation,
                                purpose: e.target.value,
                            })}
                    />
                    <Input
                        type="date"
                        label="Ngày phân bổ"
                        value={newAllocation.allocationDate}
                        onChange={(e) =>
                            setNewAllocation({
                                ...newAllocation,
                                allocationDate: e.target.value,
                            })}
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
                        onClick={editingAllocationId
                            ? handleUpdateAllocation
                            : handleAddAllocation}
                    >
                        {editingAllocationId ? "Cập nhật" : "Thêm"}
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default BudgetAllocation;
