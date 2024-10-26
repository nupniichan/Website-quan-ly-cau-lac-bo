import React, { useEffect, useState } from "react";
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
    Typography,
} from "@material-tailwind/react";
import {
    EyeIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
} from "@heroicons/react/24/solid";

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
            const response = await axios.post(
                `${API_URL}/add-budget-allocation`,
                newAllocation,
            );
            setIsDialogOpen(false);
            fetchAllocations();
        } catch (error) {
            console.error("Error adding budget allocation:", error);
            alert(
                `Lỗi khi thêm phân bổ ngân sách: ${
                    error.response?.data?.message || "Không xác định"
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
            club: "",
            amount: 0,
            purpose: "",
            allocationDate: "",
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

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader
                    variant="gradient"
                    color="purple"
                    className="mb-8 p-6"
                >
                    <Typography variant="h6" color="white">
                        Phân bổ ngân sách
                    </Typography>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <div className="flex justify-end mb-4 px-6">
                        <Button
                            className="flex items-center gap-3"
                            color="purple"
                            size="sm"
                            onClick={openAddDialog}
                        >
                            <PlusIcon strokeWidth={2} className="h-4 w-4" />
                            {" "}
                            Thêm phân bổ
                        </Button>
                    </div>
                    {isLoading
                        ? (
                            <div className="flex justify-center items-center h-64">
                                <Spinner className="h-12 w-12" color="purple" />
                            </div>
                        )
                        : allocations.length === 0
                        ? (
                            <Typography className="text-center py-4">
                                Chưa có phân bổ ngân sách nào.
                            </Typography>
                        )
                        : (
                            <table className="w-full min-w-[640px] table-auto">
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
                                                className="border-b border-blue-gray-50 py-3 px-5 text-left"
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
                                    {allocations.map(
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
                                                key === allocations.length - 1
                                                    ? ""
                                                    : "border-b border-blue-gray-50"
                                            }`;

                                            return (
                                                <tr key={_id}>
                                                    <td className={className}>
                                                        <Typography className="text-xs font-semibold text-blue-gray-600">
                                                            {clubs.find((c) =>
                                                                c._id === club
                                                            )?.ten || "N/A"}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography className="text-xs font-semibold text-blue-gray-600">
                                                            {amount
                                                                .toLocaleString()}
                                                            {" "}
                                                            VND
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
                                                            <Button
                                                                size="sm"
                                                                color="blue"
                                                                className="flex items-center gap-2"
                                                                onClick={() =>
                                                                    openEditDialog(
                                                                        _id,
                                                                    )}
                                                            >
                                                                <PencilIcon
                                                                    strokeWidth={2}
                                                                    className="h-4 w-4"
                                                                />{" "}
                                                                Sửa
                                                            </Button>
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
                                                                    className="h-4 w-4"
                                                                />{" "}
                                                                Xóa
                                                            </Button>
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

            {/* Dialog thêm/sửa phân bổ ngân sách */}
            <Dialog
                open={isDialogOpen}
                handler={() => setIsDialogOpen(false)}
                size="xl"
            >
                <DialogHeader>
                    {editingAllocationId
                        ? "Ch���nh sửa Phân bổ Ngân sách"
                        : "Thêm Phân bổ Ngân sách Mới"}
                </DialogHeader>
                <DialogBody divider className="grid grid-cols-2 gap-4">
                    <Select
                        label="Câu lạc bộ"
                        value={newAllocation.club
                            ? newAllocation.club.toString()
                            : ""}
                        onChange={(value) =>
                            setNewAllocation({ ...newAllocation, club: value })}
                    >
                        {clubs.map((club) => (
                            <Option key={club._id} value={club._id.toString()}>
                                {club.ten}
                            </Option>
                        ))}
                    </Select>
                    <Input
                        type="number"
                        label="Số tiền"
                        value={newAllocation.amount}
                        onChange={(e) =>
                            setNewAllocation({
                                ...newAllocation,
                                amount: e.target.value,
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
                        onChange={(e) => setNewAllocation({
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
