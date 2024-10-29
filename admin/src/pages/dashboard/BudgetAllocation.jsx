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

    const handleAddAllocation = async () => {
        try {
            if (!newAllocation.club) {
                alert("Vui lòng chọn câu lạc bộ");
                return;
            }

            const formattedData = {
                club: newAllocation.club, // Đây là ObjectId
                amount: Number(newAllocation.amount),
                purpose: newAllocation.purpose,
                allocationDate: newAllocation.allocationDate,
            };

            console.log("Data being sent:", formattedData);

            const response = await axios.post(
                `${API_URL}/add-budget-allocation`,
                formattedData,
            );

            console.log("Response:", response.data);
            setIsDialogOpen(false);
            fetchAllocations();
        } catch (error) {
            console.error("Error adding budget allocation:", error);
            if (error.response?.data) {
                console.error("Error response data:", error.response.data);
            }
            alert(
                `Lỗi khi thêm phân bổ ngân sách: ${
                    error.response?.data?.message || error.message ||
                    "Không xác định"
                }`,
            );
        }
    };

    const handleUpdateAllocation = async () => {
        try {
            const response = await axios.put(
                `${API_URL}/update-budget-allocation/${editingAllocationId}`,
                newAllocation,
            );
            setIsDialogOpen(false);
            setEditingAllocationId(null);
            fetchAllocations();
        } catch (error) {
            console.error("Error updating budget allocation:", error);
            alert(
                `Lỗi khi cập nhật phân bổ ngân sách: ${
                    error.response?.data?.message || "Không xác định"
                }`,
            );
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
        setNewAllocation({
            club: "", // Để trống, người dùng sẽ chọn
            amount: 0,
            purpose: "",
            allocationDate: new Date().toISOString().split("T")[0], // Set ngày hiện tại
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
        return allocations.filter((allocation) => {
            const matchClub = !filters.club ||
                allocation.club._id === filters.club;
            const matchDate = (!filters.startDate ||
                new Date(allocation.allocationDate) >=
                    new Date(filters.startDate)) &&
                (!filters.endDate ||
                    new Date(allocation.allocationDate) <=
                        new Date(filters.endDate));
            const matchAmount = (!filters.minAmount ||
                allocation.amount >= Number(filters.minAmount)) &&
                (!filters.maxAmount ||
                    allocation.amount <= Number(filters.maxAmount));
            return matchClub && matchDate && matchAmount;
        });
    }, [allocations, filters]);

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
                    {/* Thêm phần filter */}
                    <div className="px-6 py-3 absolute z-[60]">
                        <div className="grid gap-4 2xl:grid-cols-5 xl:grid-cols-3 md:grid-cols-3 sm:grid-cols-2">
                            <Select
                                label="Câu lạc bộ"
                                value={filters.club}
                                onChange={(value) =>
                                    setFilters({ ...filters, club: value })}
                            >
                                <Option value="" className="bg-transparent">
                                    <strong>Tất cả</strong>
                                </Option>

                                <hr className="my-2 border-t border-gray-300" />

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
                            {/* Display filtered club */}
                            {filters.club && (
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal translate-x-3 translate-y-[0.65rem] absolute z-0 pointer-events-none"
                                >
                                    {clubs.find((c) => c._id === filters.club)?.ten}
                                </Typography>
                            )}
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
                    <table className="w-full min-w-[640px] table-auto 2xl:mt-24 xl:mt-40 lg:mt-44 md:mt-48 sm:mt-52">
                        <thead>
                            <tr>
                                {[
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
                            {filteredAllocations.map(
                                (
                                    {
                                        _id,
                                        club,
                                        amount,
                                        purpose,
                                        allocationDate,
                                    },
                                    key,
                                ) => {
                                    const className = `py-3 px-5 ${
                                        key === filteredAllocations.length - 1
                                            ? ""
                                            : "border-b border-blue-gray-50"
                                    }`;

                                    return (
                                        <tr key={_id}>
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
                                                    {new Date(
                                                        allocationDate,
                                                    ).toLocaleDateString()}
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
                </CardBody>
            </Card>

            {/* Dialog Chi tiết */}
            <Dialog
                open={isDetailDialogOpen}
                handler={() => setIsDetailDialogOpen(false)}
                size="md"
            >
                <DialogHeader className="lg:text-2xl md:text-xl sm:text-base">
                    Chi tiết Phân bổ Ngân sách
                </DialogHeader>
                <DialogBody divider>
                    {detailAllocation && (
                        <div className="grid grid-cols-2 gap-4 overflow-y-auto lg:max-h-[60vh] sm:max-h-[45vh]">
                            <div>
                                <Typography
                                    variant="small"
                                    className="font-bold"
                                >
                                    Câu lạc bộ:
                                </Typography>
                                <Typography>
                                    {detailAllocation.club?.ten || "N/A"}
                                </Typography>
                            </div>
                            <div>
                                <Typography
                                    variant="small"
                                    className="font-bold"
                                >
                                    Số tiền:
                                </Typography>
                                <Typography>
                                    {detailAllocation.amount.toLocaleString()}
                                    {" "}
                                    VND
                                </Typography>
                            </div>
                            <div>
                                <Typography
                                    variant="small"
                                    className="font-bold"
                                >
                                    Mục đích:
                                </Typography>
                                <Typography>
                                    {detailAllocation.purpose}
                                </Typography>
                            </div>
                            <div>
                                <Typography
                                    variant="small"
                                    className="font-bold"
                                >
                                    Ngày phân bổ:
                                </Typography>
                                <Typography>
                                    {new Date(detailAllocation.allocationDate)
                                        .toLocaleDateString()}
                                </Typography>
                            </div>
                        </div>
                    )}
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
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
                        ? "Chnh sửa Phân bổ Ngân sách"
                        : "Thêm Phân bổ Ngân sách Mới"}
                </DialogHeader>
                <DialogBody
                    divider
                    className="grid grid-cols-2 gap-4 overflow-y-auto lg:max-h-[60vh] sm:max-h-[45vh]"
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
