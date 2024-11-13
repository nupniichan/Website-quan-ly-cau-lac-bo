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
} from "@heroicons/react/24/solid";

const API_URL = "http://localhost:5500/api";

const ManageClubAccountsPR = () => {
    const [accounts, setAccounts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [newAccount, setNewAccount] = useState({
        userId: '',
        email: '',
        password: '',
        role: 'student',
    });
    const [editAccount, setEditAccount] = useState({});
    const [validationErrors, setValidationErrors] = useState({});
    const [editValidationErrors, setEditValidationErrors] = useState({});
    const [detailAccount, setDetailAccount] = useState(null);
    
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
        if (!newAccount.userId) errors.userId = "User ID is required.";
        if (!newAccount.email) errors.email = "Email is required.";
        if (!newAccount.password) errors.password = "Password is required.";

        const accountExists = accounts.some(
            (account) => account.userId === newAccount.userId
        );
        if (accountExists) errors.userId = "Account with this User ID already exists.";

        setValidationErrors(errors);
        if (Object.keys(errors).length > 0) return;

        try {
            console.log("Sending request to add account...");
            const response = await axios.post(`${API_URL}/add-account`, newAccount);
            console.log("Account added successfully:", response.data);
            setAccounts((prev) => [...prev, response.data]);
            setIsDialogOpen(false);
            setNewAccount({ userId: '', email: '', password: '', role: 'Student' });
            setValidationErrors({});
        } catch (error) {
            console.error("Error adding account:", error);
        }
    };

    const handleDeleteAccount = async (userId) => {
        console.log("Deleting account with User ID:", userId);
        if (window.confirm("Are you sure you want to delete this account?")) {
            try {
                await axios.delete(`${API_URL}/delete-account/${userId}`);
                console.log(`Account with User ID ${userId} deleted`);
                setAccounts((prev) => prev.filter(account => account.userId !== userId));
            } catch (error) {
                console.error("Error deleting account:", error);
            }
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
        if (!editAccount.userId) errors.userId = "User ID is required.";
        if (!editAccount.email) errors.email = "Email is required.";

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

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            {isLoading ? (
                <div className="flex justify-center"><Spinner /></div>
            ) : (
                <Card>
                    <CardHeader variant="gradient" color="blue" className="p-6 mb-8">
                        <Typography variant="h6" color="white">
                            Manage Accounts
                        </Typography>
                    </CardHeader>
                    <CardBody className="px-0 pt-0 pb-2 overflow-auto">
                        <div className="flex justify-between items-center p-4 px-6 pr-10 mb-4">
                            <Tooltip
                                content="Add Account"
                                className="bg-gradient-to-r from-black to-transparent opacity-70"
                            >
                                <Button
                                    className="flex items-center gap-3"
                                    color="blue"
                                    size="sm"
                                    onClick={openAddDialog}
                                >
                                    <FaPlus className="w-4 h-4" />
                                </Button>
                            </Tooltip>
                        </div>

                        {accounts.length === 0 ? (
                            <Typography className="py-4 text-center">
                                No accounts found.
                            </Typography>
                        ) : (
                            <table className="w-full min-w-[640px] table-auto">
                                <thead>
                                    <tr>
                                        {["User ID", "Email", "Role", "Actions"].map((el) => (
                                            <th key={el} className="px-5 py-3 text-left border-b border-blue-gray-50">
                                                <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                                                    {el}
                                                </Typography>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {accounts.map(({ userId, email, role }, key) => {
                                        const className = `py-3 px-5 ${key === accounts.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                                        return (
                                            <tr key={userId}>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {userId}
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
                                                        <Button size="sm" color="blue" onClick={() => openDetailDialog({ userId, email, role })}>
                                                            <EyeIcon className="w-4 h-4" />
                                                        </Button>
                                                        <Button size="sm" color="green" onClick={() => openEditDialog({ userId, email, role })}>
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
                        )}
                    </CardBody>
                </Card>
            )}

            {/* Add Account Dialog */}
            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <DialogHeader>Add New Account</DialogHeader>
                <DialogBody>
                    <div className="space-y-4">
                        <Input label="User ID" value={newAccount.userId} onChange={(e) => setNewAccount({ ...newAccount, userId: e.target.value })} />
                        {validationErrors.userId && <Typography color="red">{validationErrors.userId}</Typography>}

                        <Input label="Email" value={newAccount.email} onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })} />
                        {validationErrors.email && <Typography color="red">{validationErrors.email}</Typography>}

                        <Input label="Password" type="password" value={newAccount.password} onChange={(e) => setNewAccount({ ...newAccount, password: e.target.value })} />
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button color="red" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button color="green" onClick={handleAddAccount}>Add</Button>
                </DialogFooter>
            </Dialog>

            {/* Edit Account Dialog */}
            <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
                <DialogHeader>Edit Account</DialogHeader>
                <DialogBody>
                    <div className="space-y-4">
                        <Input
                            label="User ID"
                            value={editAccount.userId || ""}
                            onChange={(e) => setEditAccount({ ...editAccount, userId: e.target.value })}
                            disabled
                        />
                        {editValidationErrors.userId && <Typography color="red">{editValidationErrors.userId}</Typography>}

                        <Input
                            label="Email"
                            value={editAccount.email || ""}
                            onChange={(e) => setEditAccount({ ...editAccount, email: e.target.value })}
                        />
                        {editValidationErrors.email && <Typography color="red">{editValidationErrors.email}</Typography>}
                        <Input label="Password" type="password" value={editAccount.password || ""} onChange={(e) => setEditAccount({ ...editAccount, password: e.target.value })} />
                        
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button color="red" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                    <Button color="green" onClick={handleEditAccount}>Save</Button>
                </DialogFooter>
            </Dialog>

            {/* Account Details Dialog */}
            <Dialog open={isDetailDialogOpen} onClose={() => setIsDetailDialogOpen(false)}>
                <DialogHeader>Account Details</DialogHeader>
                <DialogBody>
                    <Typography>User ID: {detailAccount?.userId}</Typography>
                    <Typography>Email: {detailAccount?.email}</Typography>
                    <Typography>Role: {detailAccount?.role}</Typography>
                    <Typography><strong>Password:</strong> {detailAccount?.password}</Typography>
                </DialogBody>
                <DialogFooter>
                    <Button color="blue" onClick={() => setIsDetailDialogOpen(false)}>Close</Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default ManageClubAccountsPR;