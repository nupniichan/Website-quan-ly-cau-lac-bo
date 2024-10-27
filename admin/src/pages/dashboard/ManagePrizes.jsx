import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
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
    Input,
    Option,
    Select,
    Spinner,
    Textarea,
    Tooltip,
    Typography,
} from "@material-tailwind/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";

const API_URL = "http://localhost:5500/api";

const ManagePrizes = () => {
    const [prizes, setPrizes] = useState([]);
    const [members, setMembers] = useState([]);
    const [managedClub, setManagedClub] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [newPrize, setNewPrize] = useState({
        tenGiaiThuong: "",
        ngayDatGiai: "",
        loaiGiai: "",
        thanhVienDatGiai: "",
        ghiChu: "",
        anhDatGiai: null,
    });
    const [detailPrize, setDetailPrize] = useState(null);
    const [editingPrizeId, setEditingPrizeId] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        const managedClubsString = localStorage.getItem("managedClubs");
        if (managedClubsString) {
            try {
                const managedClubs = JSON.parse(managedClubsString);
                if (managedClubs && managedClubs.length > 0) {
                    setManagedClub(managedClubs[0]);
                    fetchPrizes(managedClubs[0]._id);
                    fetchMembers(managedClubs[0]._id);
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
    }, []);

    const fetchPrizes = async (clubId) => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `${API_URL}/get-prizes-by-club/${clubId}`,
            );
            setPrizes(response.data);
        } catch (error) {
            console.error("Error fetching prizes:", error);
            alert("Lỗi khi tải danh sách giải thưởng");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMembers = async (clubId) => {
        try {
            const response = await axios.get(
                `${API_URL}/get-members-by-club/${clubId}`,
            );
            setMembers(response.data);
        } catch (error) {
            console.error("Error fetching members:", error);
        }
    };

    const handleAddPrize = async () => {
        try {
            if (!managedClub) {
                throw new Error("Managed club information is not available");
            }

            const prizeData = {
                ...newPrize,
                club: managedClub._id,
                anhDatGiai: newPrize.anhDatGiai
                    ? newPrize.anhDatGiai.name
                    : null, // Send file name or null
            };

            // If using FormData (for file upload)
            const formData = new FormData();
            Object.keys(prizeData).forEach((key) => {
                if (key === "anhDatGiai" && prizeData[key] instanceof File) {
                    formData.append("anhDatGiai", prizeData[key]);
                } else {
                    formData.append(key, prizeData[key]);
                }
            });

            const response = await axios.post(
                `${API_URL}/add-prize`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                },
            );

            setIsDialogOpen(false);
            fetchPrizes(managedClub._id);
        } catch (error) {
            console.error("Error adding prize:", error);
            alert(
                `Lỗi khi thêm giải thưởng: ${
                    error.response?.data?.message || error.message ||
                    "Không xác định"
                }`,
            );
        }
    };

    const handleUpdatePrize = async () => {
        try {
            const formData = new FormData();
            Object.keys(newPrize).forEach((key) => {
                if (key === "anhDatGiai") {
                    if (
                        newPrize.anhDatGiai &&
                        newPrize.anhDatGiai instanceof File
                    ) {
                        formData.append("anhDatGiai", newPrize.anhDatGiai);
                    }
                } else if (key !== "club") { // Không thêm trường 'club' vào formData
                    formData.append(key, newPrize[key]);
                }
            });
            // Thêm club ID riêng biệt
            formData.append("club", managedClub._id);

            const response = await axios.put(
                `${API_URL}/update-prize/${editingPrizeId}`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                },
            );
            setIsDialogOpen(false);
            setEditingPrizeId(null);
            fetchPrizes(managedClub._id);
        } catch (error) {
            console.error("Error updating prize:", error);
            alert(
                `Lỗi khi cập nhật giải thưởng: ${
                    error.response?.data?.message || error.message ||
                    "Không xác định"
                }`,
            );
        }
    };

    const handleDeletePrize = async (prizeId) => {
        if (window.confirm("Bạn c chắc chắn muốn xóa giải thưởng này?")) {
            try {
                const response = await axios.delete(
                    `${API_URL}/delete-prize/${prizeId}/${managedClub.clubId}`,
                );
                fetchPrizes(managedClub.clubId);
            } catch (error) {
                console.error("Error deleting prize:", error);
                alert(
                    `Lỗi khi xóa giải thưởng: ${
                        error.response?.data?.message || "Không xác định"
                    }`,
                );
            }
        }
    };

    const openAddDialog = () => {
        setNewPrize({
            tenGiaiThuong: "",
            ngayDatGiai: "",
            loaiGiai: "",
            thanhVienDatGiai: "",
            ghiChu: "",
            anhDatGiai: null,
        });
        setEditingPrizeId(null);
        setIsDialogOpen(true);
    };

    const openEditDialog = (id) => {
        const prizeToEdit = prizes.find((prize) => prize._id === id);
        if (prizeToEdit) {
            setNewPrize({
                ...prizeToEdit,
                anhDatGiai: null, // We'll keep the file input empty, but display the current image separately
            });
            setCurrentImage(
                prizeToEdit.anhDatGiai
                    ? `${API_URL}/uploads/${prizeToEdit.anhDatGiai}`
                    : null,
            );
            setPreviewImage(null);
            setEditingPrizeId(id);
            setIsDialogOpen(true);
        }
    };

    const openDetailDialog = (id) => {
        const prizeDetail = prizes.find((prize) => prize._id === id);
        if (prizeDetail) {
            setDetailPrize(prizeDetail);
            setIsDetailDialogOpen(true);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setNewPrize({ ...newPrize, anhDatGiai: file });

        // Create a preview of the new image
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
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
                        Quản lý Giải thưởng
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
                                <FaPlus
                                    className="w-4 h-4"
                                    strokeWidth={"2rem"}
                                />
                            </Button>
                        </Tooltip>
                    </div>
                    {isLoading
                        ? (
                            <div className="flex items-center justify-center h-64">
                                <Spinner className="w-16 h-16 text-blue-500/10" />
                            </div>
                        )
                        : (
                            <table className="w-full min-w-[640px] table-auto">
                                <thead>
                                    <tr>
                                        {[
                                            "Tên giải thưởng",
                                            "Ngày đạt giải",
                                            "Loại giải",
                                            "Thành viên đạt giải",
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
                                    {prizes.map(
                                        (
                                            {
                                                _id,
                                                tenGiaiThuong,
                                                ngayDatGiai,
                                                loaiGiai,
                                                thanhVienDatGiai,
                                            },
                                            index,
                                        ) => {
                                            const className = `py-3 px-5 ${
                                                index === prizes.length - 1
                                                    ? ""
                                                    : "border-b border-blue-gray-50"
                                            }`;

                                            return (
                                                <tr key={_id}>
                                                    <td className={className}>
                                                        <Typography className="text-xs font-semibold text-blue-gray-600">
                                                            {tenGiaiThuong}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography className="text-xs font-semibold text-blue-gray-600">
                                                            {new Date(
                                                                ngayDatGiai,
                                                            ).toLocaleDateString()}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography className="text-xs font-semibold text-blue-gray-600">
                                                            {loaiGiai}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography className="text-xs font-semibold text-blue-gray-600">
                                                            {members.find((m) =>
                                                                m._id ===
                                                                    thanhVienDatGiai
                                                            )?.hoTen || "N/A"}
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
                                                                        handleDeletePrize(
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

            {/* Dialog thêm/sửa giải thưởng */}
            <Dialog
                open={isDialogOpen}
                handler={() => setIsDialogOpen(false)}
                size="lg"
            >
                <DialogHeader className="lg:text-2xl md:text-xl sm:text-base">
                    {editingPrizeId
                        ? "Chỉnh sửa Giải thưởng"
                        : "Thêm Giải thưởng Mới"}
                </DialogHeader>

                        {/* NOTE Responsiveness for Dialog */}
                <DialogBody divider className="grid lg:grid-cols-2 gap-4 overflow-y-auto max-h-[80vh] sm:max-h-[47vh]">
                    <Input
                        label="Tên giải thưởng"
                        value={newPrize.tenGiaiThuong}
                        onChange={(e) => setNewPrize({
                            ...newPrize,
                            tenGiaiThuong: e.target.value,
                        })}
                    />
                    <Input
                        type="date"
                        label="Ngày đạt giải"
                        value={newPrize.ngayDatGiai?.split("T")[0]}
                        onChange={(e) => setNewPrize({
                            ...newPrize,
                            ngayDatGiai: e.target.value,
                        })}
                    />
                    <Input
                        label="Loại giải"
                        value={newPrize.loaiGiai}
                        onChange={(e) => setNewPrize({
                            ...newPrize,
                            loaiGiai: e.target.value,
                        })}
                    />
                    <Select
                        label="Thành viên đạt giải"
                        value={newPrize.thanhVienDatGiai}
                        onChange={(value) => setNewPrize({
                            ...newPrize,
                            thanhVienDatGiai: value,
                        })}
                    >
                        {members.map((member) => (
                            <Option key={member._id} value={member._id}>
                                {member.hoTen}
                            </Option>
                        ))}
                    </Select>
                    <Textarea
                        label="Ghi chú"
                        value={newPrize.ghiChu}
                        onChange={(e) => setNewPrize({
                            ...newPrize,
                            ghiChu: e.target.value,
                        })}
                    />
                    <div className="flex flex-col gap-2">
                        <Button
                            variant="gradient"
                            className="flex items-center gap-3 w-[10.6rem]"
                            color= "blue"
                        >
                            <CloudArrowUpIcon className="w-5 h-5 stroke-2" />
                            Upload Image
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0"
                            />
                        </Button>
                        <div className="grid grid-cols-2">
                            {editingPrizeId && currentImage && (
                                <>
                                    <p><strong>Ảnh hiện tại:</strong></p>
                                    <img
                                        src={currentImage}
                                        alt="Ảnh đạt giải hiện tại"
                                        className="h-auto max-w-full mt-2"
                                        style={{ maxHeight: "100px" }}
                                    />
                                </>
                            )}
                            {previewImage && (
                                <>
                                    <p><strong>Ảnh mới:</strong></p>
                                    <img
                                        src={previewImage}
                                        alt="Ảnh đạt giải mới"
                                        className="h-auto max-w-full mt-2"
                                        style={{ maxHeight: "100px" }}
                                    />
                                </>
                            )}
                        </div>
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
                        onClick={editingPrizeId
                            ? handleUpdatePrize
                            : handleAddPrize}
                    >
                        {editingPrizeId ? "Cập nhật" : "Thêm"}
                    </Button>
                </DialogFooter>
            </Dialog>

            {/* Dialog xem chi tiết giải thưởng */}
            <Dialog
                open={isDetailDialogOpen}
                handler={() => setIsDetailDialogOpen(false)}
                size="lg"
            >
                <DialogHeader className="lg:text-2xl md:text-xl sm:text-base">Chi tiết Giải thưởng</DialogHeader>
                {detailPrize && (
                    <DialogBody divider className="grid grid-cols-2 gap-4 overflow-y-auto lg:max-h-[65vh] sm:max-h-[50vh]">
                        <Typography>
                            Tên giải thưởng: {detailPrize.tenGiaiThuong}
                        </Typography>
                        <Typography>
                            Ngày đạt giải: {new Date(detailPrize.ngayDatGiai)
                                .toLocaleDateString()}
                        </Typography>
                        <Typography>
                            Loại giải: {detailPrize.loaiGiai}
                        </Typography>
                        <Typography>
                            Thành viên đạt giải: {members.find((m) =>
                                m._id === detailPrize.thanhVienDatGiai
                            )?.hoTen || "N/A"}
                        </Typography>
                        <Typography className="col-span-2">
                            Ghi chú: {detailPrize.ghiChu}
                        </Typography>
                        {detailPrize.anhDatGiai && (
                            <div className="col-span-2">
                                <Typography>Ảnh đạt giải:</Typography>
                                <img
                                    src={`${API_URL}/uploads/${detailPrize.anhDatGiai}`}
                                    alt="Ảnh đạt giải"
                                    className="h-auto max-w-full mt-2"
                                    style={{ maxHeight: "300px" }}
                                />
                            </div>
                        )}
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

export default ManagePrizes;
