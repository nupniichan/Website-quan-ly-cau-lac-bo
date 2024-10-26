import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Textarea,
    Spinner,
    Tooltip,
} from "@material-tailwind/react";
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon,
} from "@heroicons/react/24/solid";

const API_URL = "http://localhost:5500/api";

const ManageClubs = () => {
    const [clubs, setClubs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [newClub, setNewClub] = useState({
        ten: "",
        linhVucHoatDong: "",
        ngayThanhLap: "",
        giaoVienPhuTrach: "",
        truongBanCLB: "",
        mieuTa: "",
        quyDinh: "",
        logo: null,
    });
    const [detailClub, setDetailClub] = useState(null);
    const [editingClubId, setEditingClubId] = useState(null);

    useEffect(() => {
        fetchClubs();
    }, []);

    const fetchClubs = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_URL}/get-clubs`);
            setClubs(response.data);
        } catch (error) {
            console.error("Error fetching clubs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddClub = async () => {
        const requiredFields = [
            "ten",
            "linhVucHoatDong",
            "ngayThanhLap",
            "giaoVienPhuTrach",
            "truongBanCLB",
        ];
        const missingFields = requiredFields.filter((field) => !newClub[field]);

        if (missingFields.length > 0) {
            alert(`Vui lòng điền đầy đủ thông tin: ${missingFields.join(", ")}`);
            return;
        }

        try {
            const formData = new FormData();
            Object.keys(newClub).forEach((key) => {
                if (key === "logo") {
                    if (newClub.logo) {
                        formData.append("logo", newClub.logo);
                    }
                } else {
                    formData.append(key, newClub[key]);
                }
            });

            const response = await axios.post(`${API_URL}/add-club`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setIsDialogOpen(false);
            fetchClubs();
        } catch (error) {
            console.error("Error adding club:", error);
            if (error.response) {
                alert(
                    `Lỗi khi thêm câu lạc bộ: ${error.response.data.message || "Không xác định"}`,
                );
            } else {
                alert("Không thể kết nối đến server. Vui lòng thử lại sau.");
            }
        }
    };

    const handleUpdateClub = async () => {
        try {
            const formData = new FormData();
            Object.keys(newClub).forEach((key) => {
                if (key === "logo") {
                    if (newClub.logo && newClub.logo instanceof File) {
                        formData.append("logo", newClub.logo);
                    }
                } else {
                    formData.append(key, newClub[key]);
                }
            });

            const response = await axios.put(
                `${API_URL}/update-club/${editingClubId}`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                },
            );
            setIsDialogOpen(false);
            setEditingClubId(null);
            fetchClubs();
        } catch (error) {
            console.error("Error updating club:", error);
            if (error.response) {
                alert(
                    `Lỗi khi cập nhật câu lạc bộ: ${error.response.data.message || "Không xác định"}`,
                );
            } else {
                alert("Không thể kết nối đến server. Vui lòng thử lại sau.");
            }
        }
    };

    const handleDeleteClub = async (clubId) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa câu lạc bộ này?")) {
            try {
                const response = await axios.delete(`${API_URL}/delete-club/${clubId}`);
                fetchClubs();
            } catch (error) {
                console.error("Error deleting club:", error);
                if (error.response) {
                    alert(`Lỗi khi xóa câu lạc bộ: ${error.response.data.message}`);
                } else {
                    alert("Không thể kết nối đến server. Vui lòng thử lại sau.");
                }
            }
        }
    };

    const openAddDialog = () => {
        setNewClub({
            ten: "",
            linhVucHoatDong: "",
            ngayThanhLap: "",
            giaoVienPhuTrach: "",
            truongBanCLB: "",
            mieuTa: "",
            quyDinh: "",
            logo: null,
        });
        setEditingClubId(null);
        setIsDialogOpen(true);
    };

    const openEditDialog = async (clubId) => {
        try {
            const response = await axios.get(`${API_URL}/get-club/${clubId}`);
            setNewClub({
                ...response.data,
                ngayThanhLap: response.data.ngayThanhLap.split("T")[0],
            });
            setEditingClubId(clubId);
            setIsDialogOpen(true);
        } catch (error) {
            console.error("Error fetching club details:", error);
            if (error.response) {
                alert(
                    `Lỗi khi lấy thông tin câu lạc bộ: ${error.response.data.message || "Không xác định"}`,
                );
            } else {
                alert("Không thể kết nối đến server. Vui lòng thử lại sau.");
            }
        }
    };

    const openDetailDialog = async (clubId) => {
        try {
            const response = await axios.get(`${API_URL}/get-club/${clubId}`);
            setDetailClub(response.data);
            setIsDetailDialogOpen(true);
        } catch (error) {
            console.error("Error fetching club details:", error);
            alert(
                `Lỗi khi lấy thông tin câu lạc bộ: ${error.response?.data?.message || "Không xác định"}`,
            );
        }
    };

    const handleLogoChange = (e) => {
        setNewClub({ ...newClub, logo: e.target.files[0] });
    };

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
                    <Typography variant="h6" color="white">
                        Quản lý câu lạc bộ
                    </Typography>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <div className="flex justify-end mb-4 px-6">
                        <Button
                            className="flex items-center gap-3"
                            color="blue"
                            size="sm"
                            onClick={openAddDialog}
                        >
                            <PlusIcon strokeWidth={2} className="h-4 w-4" /> Thêm CLB
                        </Button>
                    </div>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <Spinner className="h-12 w-12" color="blue" />
                        </div>
                    ) : clubs.length === 0 ? (
                        <Typography className="text-center py-4">
                            Chưa có câu lạc bộ nào.
                        </Typography>
                    ) : (
                        <table className="w-full min-w-[640px] table-auto">
                            <thead>
                                <tr>
                                    {[
                                        "Logo",
                                        "Tên CLB",
                                        "Lĩnh vực hoạt động",
                                        "Ngày thành lập",
                                        "Giáo viên phụ trách",
                                        "Trưởng ban CLB",
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
                                {clubs.map(
                                    (
                                        {
                                            clubId,
                                            ten,
                                            linhVucHoatDong,
                                            ngayThanhLap,
                                            giaoVienPhuTrach,
                                            truongBanCLB,
                                            logo,
                                        },
                                        key,
                                    ) => {
                                        const className = `py-3 px-5 ${key === clubs.length - 1
                                                ? ""
                                                : "border-b border-blue-gray-50"
                                            }`;

                                        return (
                                            <tr key={clubId}>
                                                <td className={className}>
                                                    <img
                                                        src={
                                                            logo
                                                                ? `${API_URL}/${logo}`
                                                                : "/img/default-club-logo.png"
                                                        }
                                                        alt={ten}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = "/img/default-club-logo.png";
                                                        }}
                                                    />
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {ten}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {linhVucHoatDong}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {new Date(ngayThanhLap).toLocaleDateString()}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {giaoVienPhuTrach}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {truongBanCLB}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <div className="flex items-center gap-2">
                                                        <Tooltip
                                                            content="Xem chi tiết"
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
                                                                onClick={() => openDetailDialog(clubId)}
                                                            >
                                                                <EyeIcon strokeWidth={2} className="h-4 w-4" />{" "}
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
                                                                onClick={() => openEditDialog(clubId)}
                                                            >
                                                                <PencilIcon strokeWidth={2} className="h-4 w-4" />{" "}
                                                            </Button>
                                                        </Tooltip>
                                                        <Tooltip
                                                            content="Xoá"
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
                                                                onClick={() => handleDeleteClub(clubId)}
                                                            >
                                                                <TrashIcon strokeWidth={2} className="h-4 w-4" />{" "}
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

            {/* Dialog thêm/sửa câu lạc bộ */}
            <Dialog
                open={isDialogOpen}
                handler={() => setIsDialogOpen(false)}
                size="xl"
            >
                <DialogHeader>
                    {editingClubId ? "Chỉnh sửa Câu Lạc Bộ" : "Thêm Câu Lạc Bộ Mới"}
                </DialogHeader>
                <DialogBody divider className="grid grid-cols-2 gap-4">
                    <Input
                        label="Tên CLB"
                        value={newClub.ten}
                        onChange={(e) => setNewClub({ ...newClub, ten: e.target.value })}
                    />
                    <Input
                        label="Lĩnh vực hoạt động"
                        value={newClub.linhVucHoatDong}
                        onChange={(e) =>
                            setNewClub({ ...newClub, linhVucHoatDong: e.target.value })
                        }
                    />
                    <Input
                        type="date"
                        label="Ngày thành lập"
                        value={newClub.ngayThanhLap}
                        onChange={(e) =>
                            setNewClub({ ...newClub, ngayThanhLap: e.target.value })
                        }
                    />
                    <Input
                        label="Giáo viên phụ trách"
                        value={newClub.giaoVienPhuTrach}
                        onChange={(e) =>
                            setNewClub({ ...newClub, giaoVienPhuTrach: e.target.value })
                        }
                    />
                    <Input
                        label="Trưởng ban CLB"
                        value={newClub.truongBanCLB}
                        onChange={(e) =>
                            setNewClub({ ...newClub, truongBanCLB: e.target.value })
                        }
                    />
                    <Textarea
                        label="Miêu tả"
                        value={newClub.mieuTa}
                        onChange={(e) => setNewClub({ ...newClub, mieuTa: e.target.value })}
                        className="col-span-2"
                    />
                    <Textarea
                        label="Quy định"
                        value={newClub.quyDinh}
                        onChange={(e) =>
                            setNewClub({ ...newClub, quyDinh: e.target.value })
                        }
                        className="col-span-2"
                    />
                    <Input
                        type="file"
                        label="Logo"
                        onChange={handleLogoChange}
                        accept="image/*"
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
                        onClick={editingClubId ? handleUpdateClub : handleAddClub}
                    >
                        {editingClubId ? "Cập nhật" : "Thêm"}
                    </Button>
                </DialogFooter>
            </Dialog>

            {/* Dialog xem chi tiết câu lạc bộ */}
            <Dialog
                open={isDetailDialogOpen}
                handler={() => setIsDetailDialogOpen(false)}
                size="xl"
            >
                <DialogHeader>Chi tiết Câu Lạc Bộ</DialogHeader>
                {detailClub ? (
                    <DialogBody divider className="grid grid-cols-2 gap-4">
                        <img
                            src={
                                detailClub.logo
                                    ? `${API_URL}/${detailClub.logo}`
                                    : "/img/default-club-logo.png"
                            }
                            alt={detailClub.ten}
                            className="w-full h-64 object-cover rounded-lg col-span-2"
                        />
                        <div className="col-span-2">
                            <Typography variant="h6">{detailClub.ten}</Typography>
                            <Typography>
                                Lĩnh vực hoạt động: {detailClub.linhVucHoatDong}
                            </Typography>
                            <Typography>
                                Ngày thành lập:{" "}
                                {new Date(detailClub.ngayThanhLap).toLocaleDateString()}
                            </Typography>
                            <Typography>
                                Giáo viên phụ trách: {detailClub.giaoVienPhuTrach}
                            </Typography>
                            <Typography>Trưởng ban CLB: {detailClub.truongBanCLB}</Typography>
                            <Typography>Miêu tả: {detailClub.mieuTa}</Typography>
                            <Typography>Quy định: {detailClub.quyDinh}</Typography>
                        </div>
                    </DialogBody>
                ) : (
                    <Spinner />
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

export default ManageClubs;
