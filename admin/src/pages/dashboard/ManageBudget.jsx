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
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";

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

    const handleAddBudget = async () => {
        try {
            if (!club) {
                throw new Error("Club information is not available");
            }

            const budgetData = {
                ...newBudget,
                club: club._id,
            };
            const response = await axios.post(
                `${API_URL}/add-budget`,
                budgetData,
            );
            setIsDialogOpen(false);
            fetchBudgets(club._id);
        } catch (error) {
            console.error("Error adding budget:", error);
            alert(
                `Lỗi khi thêm ngân sách: ${error.message || "Không xác định"}`,
            );
        }
    };

    const handleUpdateBudget = async () => {
        try {
            const response = await axios.put(
                `${API_URL}/update-budget/${editingBudgetId}`,
                newBudget,
            );
            setIsDialogOpen(false);
            setEditingBudgetId(null);
            fetchBudgets(club._id);
        } catch (error) {
            console.error("Error updating budget:", error);
            alert(
                `Lỗi khi cập nhật ngân sách: ${
                    error.response?.data?.message || "Không xác định"
                }`,
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
            ngay: "",
            thanhVienChiuTrachNhiem: "",
            noiDung: "",
            club: "",
        });
        setEditingBudgetId(null);
        setIsDialogOpen(true);
    };

    const openEditDialog = (id) => {
        const budgetToEdit = budgets.find((budget) => budget._id === id);
        if (budgetToEdit) {
            setNewBudget({
                ...budgetToEdit,
                ngay: budgetToEdit.ngay.split("T")[0],
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
                                color="blue"
                                size="sm"
                                onClick={openAddDialog}
                            >
                                <FaPlus className="w-4 h-4" strokeWidth={'2rem'} />
                            </Button>
                        </Tooltip>
                        {/* TODO Add Club filter */}
                    </div>
                    {isLoading
                        ? (
                            <div className="flex items-center justify-center h-64">
                                <Spinner className="w-12 h-12" color="blue" />
                            </div>
                        )
                        : budgets.length === 0
                        ? (
                            <Typography className="py-4 text-center">
                                Chưa có ngân sách nào.
                            </Typography>
                        )
                        : (
                            <table className="w-full min-w-[640px] table-auto">
                                <thead>
                                    <tr>
                                        {[
                                            "Tên ngân sách",
                                            "Khoản chi tiêu",
                                            "Nguồn thu",
                                            "Ngày",
                                            "Thành viên chịu trách nhiệm",
                                            "Câu lạc bộ",
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
                                    {budgets.map(
                                        (
                                            {
                                                _id,
                                                ten,
                                                khoanChiTieu,
                                                nguonThu,
                                                ngay,
                                                thanhVienChiuTrachNhiem,
                                                club,
                                            },
                                            key,
                                        ) => {
                                            const className = `py-3 px-5 ${
                                                key === budgets.length - 1
                                                    ? ""
                                                    : "border-b border-blue-gray-50"
                                            }`;

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
                                                            {new Date(ngay)
                                                                .toLocaleDateString()}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography className="text-xs font-semibold text-blue-gray-600">
                                                            {thanhVienChiuTrachNhiem}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography className="text-xs font-semibold text-blue-gray-600">
                                                            {club && club.ten
                                                                ? club.ten
                                                                : "N/A"}
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
                                        },
                                    )}
                                </tbody>
                            </table>
                        )}
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
                    <Input
                        label="Tên ngân sách"
                        value={newBudget.ten}
                        onChange={(e) =>
                            setNewBudget({ ...newBudget, ten: e.target.value })}
                    />
                    <Input
                        type="number"
                        label="Khoản chi tiêu"
                        value={newBudget.khoanChiTieu}
                        onChange={(e) => setNewBudget({
                            ...newBudget,
                            khoanChiTieu: e.target.value,
                        })}
                    />
                    <Input
                        type="number"
                        label="Nguồn thu"
                        value={newBudget.nguonThu}
                        onChange={(e) => setNewBudget({
                            ...newBudget,
                            nguonThu: e.target.value,
                        })}
                    />
                    <Input
                        type="date"
                        label="Ngày"
                        value={newBudget.ngay}
                        onChange={(e) => setNewBudget({
                            ...newBudget,
                            ngay: e.target.value,
                        })}
                    />
                    <Input
                        label="Thành viên chịu trách nhiệm"
                        value={newBudget.thanhVienChiuTrachNhiem}
                        onChange={(e) => setNewBudget({
                            ...newBudget,
                            thanhVienChiuTrachNhiem: e.target.value,
                        })}
                    />
                    <Input
                        label="Nội dung"
                        value={newBudget.noiDung}
                        onChange={(e) => setNewBudget({
                            ...newBudget,
                            noiDung: e.target.value,
                        })}
                    />
                    <Input
                        label="Câu lạc bộ"
                        value={club?.ten || ""}
                        disabled
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
                size="lg"
            >
                <DialogHeader className="lg:text-2xl md:text-xl sm:text-base">Chi tiết Ngân sách</DialogHeader>
                {detailBudget
                    ? (
                        <DialogBody divider className="grid grid-cols-2 gap-4 overflow-y-auto lg:max-h-[70vh] sm:max-h-[47vh]">
                            <Typography>
                                Tên ngân sách: {detailBudget.ten}
                            </Typography>
                            <Typography>
                                Khoản chi tiêu:{" "}
                                {detailBudget.khoanChiTieu.toLocaleString()} VND
                            </Typography>
                            <Typography>
                                Nguồn thu:{" "}
                                {detailBudget.nguonThu.toLocaleString()} VND
                            </Typography>
                            <Typography>
                                Ngày: {new Date(detailBudget.ngay)
                                    .toLocaleDateString()}
                            </Typography>
                            <Typography>
                                Thành viên chịu trách nhiệm:{" "}
                                {detailBudget.thanhVienChiuTrachNhiem}
                            </Typography>
                            <Typography>
                                Nội dung: {detailBudget.noiDung}
                            </Typography>
                            <Typography>
                                Câu lạc bộ: {club ? club.ten : "N/A"}
                            </Typography>
                        </DialogBody>
                    )
                    : <Spinner />}
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
