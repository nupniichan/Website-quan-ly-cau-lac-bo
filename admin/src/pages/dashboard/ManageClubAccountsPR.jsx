import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa6";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Dialog,
    DialogBody,
    DialogHeader,
    DialogFooter,
    Input,
    Tooltip,
    Spinner,
    Typography,
} from "@material-tailwind/react";
import {
    EyeIcon,
    PencilIcon,
    TrashIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { message } from "antd";
import { useMaterialTailwindController } from "@/context/useMaterialTailwindController";

const API_URL = "http://4.242.20.80:5500/api";

const ManageClubAccountsPR = () => {
    const [accounts, setAccounts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [newAccount, setNewAccount] = useState({
        userId: '',
        name: '',
        email: '',
        password: '',
        role: 'student',
    });
    const [editAccount, setEditAccount] = useState({});
    const [validationErrors, setValidationErrors] = useState({});
    const [editValidationErrors, setEditValidationErrors] = useState({});
    const [detailAccount, setDetailAccount] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [searchQuery, setSearchQuery] = useState("");

    // Lấy controller từ context & màu hiện tại của sidenav
    const [controller] = useMaterialTailwindController();
    const { sidenavColor } = controller;

    const isValidEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@thpt\.edu\.vn$/;
        return emailRegex.test(email);
    };
    

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        setIsLoading(true);
        try {
            console.log("Fetching accounts...");
            const response = await axios.get(`${API_URL}/get-accounts`);
            console.log("Fetched accounts:", response.data);
            setAccounts(response.data);
        } catch (error) {
            console.error("Error fetching accounts:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddAccount = async () => {
        console.log("Adding account:", newAccount);

        // Validation
        const errors = {};
        if (!newAccount.userId) errors.userId = "Vui lòng nhập Mã số học sinh";
        if (!newAccount.name) errors.name = "Vui lòng nhập Họ và tên";
        if (!newAccount.email) errors.email = "Vui lòng nhập Email";
        else if (!isValidEmail(newAccount.email)) errors.email = "Email không hợp lệ";
        if (!newAccount.password) errors.password = "Vui lòng nhập Mật khẩu";

        const accountExists = accounts.some(
            (account) => account.userId === newAccount.userId
        );
        if (accountExists) errors.userId = "Mã số học sinh đã tồn tại";

        setValidationErrors(errors);
        if (Object.keys(errors).length > 0) return;

        try {
            console.log("Sending request to add account...");
            const response = await axios.post(`${API_URL}/add-account`, newAccount);
            console.log("Account added successfully:", response.data);
            setAccounts((prev) => [...prev, response.data]);
            setIsDialogOpen(false);
            setNewAccount({ userId: '', name: '', email: '', password: '', role: 'Student' });
            setValidationErrors({});
        } catch (error) {
            console.error("Error adding account:", error);
        }
    };

    const handleDeleteAccount = async (userId) => {
        console.log("Deleting account with User ID:", userId);
        try {
            // Kiểm tra xem tài khoản có đang quản lý CLB nào không
            const response = await axios.get(`${API_URL}/check-account-clubs/${userId}`);
            const { hasActiveClubs } = response.data;

            if (hasActiveClubs) {
                // alert("Không thể xóa tài khoản này vì đang quản lý câu lạc bộ đang hoạt động!");
                message.warning({content: "Không thể xóa tài khoản này vì đang quản lý câu lạc bộ đang hoạt động!"});
                return;
            }

            if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
                await axios.delete(`${API_URL}/delete-account/${userId}`);
                console.log(`Account with User ID ${userId} deleted`);
                setAccounts((prev) => prev.filter(account => account.userId !== userId));
            }
        } catch (error) {
            console.error("Error deleting account:", error);
            // alert("Có lỗi xảy ra khi xóa tài khoản!");
            message.error({content: "Có lỗi xảy ra khi xóa tài khoản!"});
        }
    };

    const openAddDialog = () => {
        console.log("Opening add account dialog...");
        setIsDialogOpen(true);
    };

    const openDetailDialog = async (account) => {
        const { userId } = account;
        console.log("Fetching account details for User ID:", userId);
        try {
            const response = await axios.get(`${API_URL}/get-account/${userId}`);
            console.log("Fetched account details:", response.data);
            setDetailAccount(response.data);
            setIsDetailDialogOpen(true);
        } catch (error) {
            console.error("Error fetching account details:", error);
        }
    };

    const openEditDialog = async (account) => {
        const { userId } = account;
        console.log("Fetching account for editing with User ID:", userId);
        try {
            const response = await axios.get(`${API_URL}/get-account/${userId}`);
            console.log("Fetched account for editing:", response.data);
            setEditAccount(response.data);
            setIsEditDialogOpen(true);
        } catch (error) {
            console.error("Error fetching account for editing:", error);
        }
    };

    const handleEditAccount = async () => {
        console.log("Editing account:", editAccount);

        // Validation
        const errors = {};
        if (!editAccount.userId) errors.userId = "Vui lòng nhập Mã số học sinh";
        if (!editAccount.name) errors.name = "Vui lòng nhập Họ và tên";
        if (!editAccount.email) errors.email = "Vui lòng nhập Email";
        else if (!isValidEmail(editAccount.email)) errors.email = "Email không hợp lệ";

        setEditValidationErrors(errors);
        if (Object.keys(errors).length > 0) return;

        try {
            console.log("Sending request to update account...");
            await axios.put(`${API_URL}/update-account/${editAccount.userId}`, editAccount);
            console.log("Account updated successfully:", editAccount);
            setAccounts((prev) =>
                prev.map(account =>
                    account.userId === editAccount.userId ? editAccount : account
                )
            );
            setIsEditDialogOpen(false);
            setEditValidationErrors({});
        } catch (error) {
            console.error("Error updating account:", error);
        }
    };

    const filteredAccounts = accounts.filter(account =>
        account.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        account.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAccounts = filteredAccounts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <Card>
                <CardHeader variant="gradient" color={sidenavColor} className="p-6 mb-8">
                    <Typography variant="h6" color="white">
                        Quản lý Tài khoản
                    </Typography>
                </CardHeader>
                <CardBody className="px-0 pt-0 pb-2 overflow-auto">
                    <div className="flex justify-between items-center p-4 px-6 pr-10 mb-4">
                        <div className="flex items-center gap-4">
                            <Input
                                label="Tìm kiếm theo MSHS hoặc tên"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-72"
                            />
                        </div>
                        <Tooltip
                            content="Thêm Tài khoản"
                            className="bg-gradient-to-r from-black to-transparent opacity-70"
                        >
                            <Button
                                className="flex items-center gap-3"
                                color={sidenavColor}
                                size="sm"
                                onClick={openAddDialog}
                            >
                                <FaPlus className="w-4 h-4" />
                            </Button>
                        </Tooltip>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center">
                            <Spinner color="pink" />
                        </div>
                    ) : filteredAccounts.length === 0 ? (
                        <div className="flex items-center justify-center h-64">
                            <Typography variant="h6" color="blue-gray" className="font-normal">
                                Hiện tại chưa có tài khoản nào được thêm
                            </Typography>
                        </div>
                    ) : (
                        <>
                            <table className="w-full min-w-[640px] table-auto">
                                <thead>
                                    <tr>
                                        {["STT", "MSHS", "Họ và tên", "Email", "Vai trò", "Thao tác"].map((el) => (
                                            <th key={el} className="px-5 py-3 text-left border-b border-blue-gray-50">
                                                <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                                                    {el}
                                                </Typography>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentAccounts.map(({ userId, name, email, role }, index) => {
                                        const className = `py-3 px-5 ${index === currentAccounts.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                                        const stt = indexOfFirstItem + index + 1;

                                        return (
                                            <tr key={userId}>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {stt}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {userId}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {name}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {email}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {role}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <div className="flex gap-2">
                                                        <Button size="sm" color="blue" onClick={() => openDetailDialog({ userId, name, email, role })}>
                                                            <EyeIcon className="w-4 h-4" />
                                                        </Button>
                                                        <Button size="sm" color="green" onClick={() => openEditDialog({ userId, name, email, role })}>
                                                            <PencilIcon className="w-4 h-4" />
                                                        </Button>
                                                        <Button size="sm" color="red" onClick={() => handleDeleteAccount(userId)}>
                                                            <TrashIcon className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {totalPages > 0 && (
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
                                            [...Array(totalPages)].map((_, index) => (
                                                <Button
                                                    key={index + 1}
                                                    variant={currentPage === index + 1 ? "gradient" : "text"}
                                                    color={sidenavColor}
                                                    onClick={() => handlePageChange(index + 1)}
                                                    className="w-10 h-10"
                                                >
                                                    {index + 1}
                                                </Button>
                                            ))
                                        ) : (
                                            <>
                                                <Button
                                                    variant={currentPage === 1 ? "gradient" : "text"}
                                                    color={sidenavColor}
                                                    onClick={() => handlePageChange(1)}
                                                    className="w-10 h-10"
                                                >
                                                    1
                                                </Button>

                                                {currentPage > 3 && (
                                                    <span className="mx-2">...</span>
                                                )}

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
                                                            color={sidenavColor}
                                                            onClick={() => handlePageChange(pageNumber)}
                                                            className="w-10 h-10"
                                                        >
                                                            {pageNumber}
                                                        </Button>
                                                    );
                                                })}

                                                {currentPage < totalPages - 2 && (
                                                    <span className="mx-2">...</span>
                                                )}

                                                <Button
                                                    variant={currentPage === totalPages ? "gradient" : "text"}
                                                    color={sidenavColor}
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
                            )}
                        </>
                    )}
                </CardBody>
            </Card>

            {/* Add Account Dialog */}
            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <DialogHeader>Thêm Tài khoản Mới</DialogHeader>
                <DialogBody>
                    <div className="space-y-4">
                        <Input label="Mã số học sinh" value={newAccount.userId}
                            onChange={(e) => setNewAccount({ ...newAccount, userId: e.target.value })} />
                        {validationErrors.userId && <Typography color="red">{validationErrors.userId}</Typography>}

                        <Input label="Họ và tên" value={newAccount.name}
                            onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })} />
                        {validationErrors.name && <Typography color="red">{validationErrors.name}</Typography>}

                        <Input label="Email" value={newAccount.email}
                            onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })} />
                        {validationErrors.email && <Typography color="red">{validationErrors.email}</Typography>}

                        <Input label="Mật khẩu" type="password" value={newAccount.password}
                            onChange={(e) => setNewAccount({ ...newAccount, password: e.target.value })} />
                        {validationErrors.password && <Typography color="red">{validationErrors.password}</Typography>}
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button color="red" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
                    <Button color="green" onClick={handleAddAccount}>Thêm</Button>
                </DialogFooter>
            </Dialog>

            {/* Edit Account Dialog */}
            <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
                <DialogHeader>Chỉnh sửa Tài khoản</DialogHeader>
                <DialogBody>
                    <div className="space-y-4">
                        <Input label="Mã số học sinh" value={editAccount.userId || ""}
                            onChange={(e) => setEditAccount({ ...editAccount, userId: e.target.value })}
                            disabled />
                        {editValidationErrors.userId && <Typography color="red">{editValidationErrors.userId}</Typography>}

                        <Input label="Họ và tên" value={editAccount.name || ""}
                            onChange={(e) => setEditAccount({ ...editAccount, name: e.target.value })} />
                        {editValidationErrors.name && <Typography color="red">{editValidationErrors.name}</Typography>}

                        <Input label="Email" value={editAccount.email || ""}
                            onChange={(e) => setEditAccount({ ...editAccount, email: e.target.value })} />
                        {editValidationErrors.email && <Typography color="red">{editValidationErrors.email}</Typography>}

                        <Input label="Mật khẩu" type="password" value={editAccount.password || ""}
                            onChange={(e) => setEditAccount({ ...editAccount, password: e.target.value })} />
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button color="red" onClick={() => setIsEditDialogOpen(false)}>Hủy</Button>
                    <Button color="green" onClick={handleEditAccount}>Lưu</Button>
                </DialogFooter>
            </Dialog>

            {/* Account Details Dialog */}
            <Dialog open={isDetailDialogOpen} handler={() => setIsDetailDialogOpen(false)} size="xl">
                <DialogHeader className="flex items-center gap-4">
                    <Typography variant="h6">Chi tiết tài khoản</Typography>
                    <Typography
                        variant="small"
                        className={`
                            px-3 py-1 rounded-full font-bold uppercase
                            ${detailAccount?.role === 'admin'
                                ? 'bg-blue-500 text-white'
                                : 'bg-green-500 text-white'}
                        `}
                    >
                        {detailAccount?.role}
                    </Typography>
                </DialogHeader>

                {detailAccount ? (
                    <DialogBody divider className="overflow-y-auto lg:max-h-[65vh] sm:max-h-[50vh] p-6">
                        <div className="bg-blue-gray-50 p-6 rounded-lg">
                            <div className="text-center mb-6">
                                <Typography variant="h4" color="blue" className="font-bold mb-2">
                                    {detailAccount.name}
                                </Typography>
                                <Typography
                                    variant="small"
                                    className="bg-white px-4 py-2 rounded-full text-blue-900 inline-block font-medium"
                                >
                                    MSHS: {detailAccount.userId}
                                </Typography>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded-lg">
                                    <Typography className="text-sm text-gray-600 mb-1">Email</Typography>
                                    <Typography className="font-medium text-blue-900">
                                        {detailAccount.email}
                                    </Typography>
                                </div>

                                <div className="bg-white p-4 rounded-lg">
                                    <Typography className="text-sm text-gray-600 mb-1">Vai trò</Typography>
                                    <Typography className="font-medium">
                                        {detailAccount.role}
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </DialogBody>
                ) : (
                    <DialogBody className="flex justify-center items-center h-64">
                        <Spinner className="h-12 w-12" color="pink" />
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

export default ManageClubAccountsPR;