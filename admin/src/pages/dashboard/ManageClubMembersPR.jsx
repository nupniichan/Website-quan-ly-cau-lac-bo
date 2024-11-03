import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Button,
    Card,
    CardBody,
    Dialog,
    DialogBody,
    DialogFooter,
    Input,
    Spinner,
    Typography,
} from "@material-tailwind/react";

const API_URL = "http://localhost:5500/api";

const ManageClubMembersPR = () => {
    const [members, setMembers] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [selectedClubId, setSelectedClubId] = useState(null);
    const [existingMembers, setExistingMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedMemberId, setSelectedMemberId] = useState("");

    useEffect(() => {
        fetchClubs();
    }, []);

    useEffect(() => {
        if (selectedClubId) {
            fetchMembers(selectedClubId);
            fetchExistingMembers(); // Fetch existing members when a club is selected
        }
    }, [selectedClubId]);

    const fetchClubs = async () => {
        try {
            const response = await axios.get(`${API_URL}/get-clubs`);
            setClubs(response.data);
        } catch (error) {
            console.error("Error fetching clubs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMembers = async (clubId) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_URL}/get-members-by-club/${clubId}`);
            setMembers(response.data);
        } catch (error) {
            console.error("Error fetching members:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchExistingMembers = async () => {
        try {
            const response = await axios.get(`${API_URL}/get-members`); // Ensure you have this endpoint
            setExistingMembers(response.data);
        } catch (error) {
            console.error("Error fetching existing members:", error);
        }
    };

    const handleAddMember = async () => {
        if (!selectedMemberId) {
            alert("Please select a member to add.");
            return;
        }
        try {
            // Fetch the complete details of the selected member
            const memberResponse = await axios.get(`${API_URL}/get-member/${selectedMemberId}`);
            const memberData = memberResponse.data;
    
            // Ensure all required fields are available
            const memberToAdd = {
                maSoHocSinh: memberData.maSoHocSinh,
                hoTen: memberData.hoTen,
                gioiTinh: memberData.gioiTinh,
                lop: memberData.lop,
                toHopHocTap: memberData.toHopHocTap,
                thongTinLienLac: memberData.thongTinLienLac,
                ngayThamGia: memberData.ngayThamGia,
                vaiTro: memberData.vaiTro,
                tinhTrang: memberData.tinhTrang,
                club: selectedClubId,
            };
    
            // Add the member to the club
            const response = await axios.post(`${API_URL}/add-member`, memberToAdd);
            setMembers((prev) => [...prev, response.data]);
            setIsDialogOpen(false);
            setSelectedMemberId(""); // Reset selected member state
        } catch (error) {
            console.error("Error adding member:", error);
        }
    };
    

    const handleDeleteMember = async (maSoHocSinh) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa thành viên này?")) {
            try {
                await axios.delete(`${API_URL}/delete-member/${maSoHocSinh}/${selectedClubId}`);
                setMembers((prev) => prev.filter(member => member.maSoHocSinh !== maSoHocSinh));
            } catch (error) {
                console.error("Error deleting member:", error);
            }
        }
    };

    const openAddDialog = () => {
        setIsDialogOpen(true);
    };

    return (
        <div className="p-4">
            <Typography variant="h4" className="mb-4">Quản lý thành viên câu lạc bộ</Typography>
            <select
                onChange={(e) => setSelectedClubId(e.target.value)}
                value={selectedClubId || ""}
                className="mb-4 p-2 border border-gray-300 rounded"
            >
                <option value="" disabled>Chọn câu lạc bộ</option>
                {clubs.map((club) => (
                    <option key={club._id} value={club._id}>{club.ten}</option>
                ))}
            </select>

            {isLoading ? (
                <Spinner />
            ) : (
                <Card className="mb-4">
                    <CardBody>
                        <Button onClick={openAddDialog} className="mb-4">Thêm thành viên</Button>
                        <ul className="space-y-2">
                            {members.map((member) => (
                                <li key={member.maSoHocSinh} className="flex justify-between items-center p-2 border-b border-gray-200">
                                    <span>{member.maSoHocSinh} - {member.hoTen}</span>
                                    <Button onClick={() => handleDeleteMember(member.maSoHocSinh)} color="red">Xóa</Button>
                                </li>
                            ))}
                        </ul>
                    </CardBody>
                </Card>
            )}

            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <DialogBody>
                    <select 
                        onChange={(e) => setSelectedMemberId(e.target.value)}
                        value={selectedMemberId}
                        className="mb-4 p-2 border border-gray-300 rounded"
                    >
                        <option value="" disabled>Chọn thành viên</option>
                        {existingMembers.map((member) => (
                            <option key={member.maSoHocSinh} value={member.maSoHocSinh}>
                                {member.maSoHocSinh} - {member.hoTen}
                            </option>
                        ))}
                    </select>
                </DialogBody>
                <DialogFooter>
                    <Button onClick={handleAddMember} color="green">Thêm</Button>
                    <Button onClick={() => setIsDialogOpen(false)} color="gray">Hủy</Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default ManageClubMembersPR;
