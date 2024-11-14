import React, { useEffect, useState, useMemo } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import {
    Card,
    CardBody,
    CardHeader,
    Typography,
    Avatar,
    Progress,
} from "@material-tailwind/react";
import {
    UserGroupIcon,
    BanknotesIcon,
    TrophyIcon,
    CalendarIcon,
    BuildingLibraryIcon,
} from "@heroicons/react/24/solid";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { StatisticsCard } from "@/components/StatisticsCard";
import { Link } from "react-router-dom";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// Thêm baseURL cho axios
const baseURL = 'http://localhost:5500'; // Port của server backend
axios.defaults.baseURL = baseURL;

// Tạo hàm format date
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
};

// Thêm styles cho cards
const cardHeaderStyles = "rounded-none bg-transparent shadow-none";
const cardBodyStyles = "px-2 pb-0";

// Thêm hàm sắp xếp ngày
const sortEventsByDate = (events) => {
    return [...events].sort((a, b) => new Date(b.ngayToChuc) - new Date(a.ngayToChuc));
};

export function Home() {
    const [userData, setUserData] = useState(null);
    const [role, setRole] = useState(() => {
        return localStorage.getItem('role') || 'student';
    });
    const [eventChartData, setEventChartData] = useState({
        labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
        datasets: [{
            label: 'Số sự kiện',
            data: [],
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    });
    const [awardsChartData, setAwardsChartData] = useState({
        labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
        datasets: [{
            label: 'Số giải thưởng',
            data: [],
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1
        }]
    });
    const [schoolEventsData, setSchoolEventsData] = useState({
        labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
        datasets: [{
            label: 'Sự kiện toàn trường',
            data: [],
            borderColor: 'rgb(53, 162, 235)',
            tension: 0.1
        }]
    });
    const [schoolAwardsData, setSchoolAwardsData] = useState({
        labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
        datasets: [{
            label: 'Giải thưởng toàn trường',
            data: [],
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1
        }]
    });
    const [pendingEvents, setPendingEvents] = useState([]);

    // Thêm state để lưu thông tin tài chính
    const [financialData, setFinancialData] = useState({
        totalAllocations: 0,
        totalIncome: 0,
        totalExpense: 0
    });

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                align: 'start',
                labels: {
                    boxWidth: 15,
                    padding: 15,
                    font: {
                        size: 11
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    font: {
                        size: 11
                    }
                }
            },
            x: {
                ticks: {
                    font: {
                        size: 11
                    }
                }
            }
        }
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const userRole = localStorage.getItem('role');
                console.log('Current role:', userRole);
                setRole(userRole);
                
                const endpoint = userRole === 'student' 
                    ? `${baseURL}/api/dashboard/student/${userId}`
                    : `${baseURL}/api/dashboard/teacher`;
                console.log('Calling endpoint:', endpoint);
                
                const response = await axios.get(endpoint);
                console.log('Response data:', response.data);
                setUserData(response.data);
                
                if (userRole === 'student') {
                    setEventChartData(prev => ({
                        ...prev,
                        datasets: [{
                            ...prev.datasets[0],
                            data: response.data.eventStats
                        }]
                    }));
                    setAwardsChartData(prev => ({
                        ...prev,
                        datasets: [{
                            ...prev.datasets[0],
                            data: response.data.awardStats
                        }]
                    }));
                } else {
                    console.log('Setting school data...');
                    setSchoolEventsData(prev => ({
                        ...prev,
                        datasets: [{
                            ...prev.datasets[0],
                            data: response.data.schoolEventStats
                        }]
                    }));
                    setSchoolAwardsData(prev => ({
                        ...prev,
                        datasets: [{
                            ...prev.datasets[0],
                            data: response.data.schoolAwardsStats
                        }]
                    }));
                }

                // Nếu là student, fetch thêm thông tin tài chính của CLB
                if (userRole === 'student' && response.data.managedClubs?.length > 0) {
                    try {
                        const clubId = response.data.managedClubs[0]._id;
                        console.log('Club ID:', clubId);
                        
                        // Fetch phân bổ ngân sách
                        const allocationsResponse = await axios.get(`${baseURL}/api/budget-allocations/club/${clubId}`);
                        console.log('Allocations Response:', allocationsResponse.data);
                        const totalAllocations = allocationsResponse.data.reduce((sum, item) => sum + item.amount, 0);
                        console.log('Total Allocations:', totalAllocations);

                        // Fetch báo cáo tài chính
                        const reportsResponse = await axios.get(`${baseURL}/api/reports/club/${clubId}`);
                        console.log('Reports Response:', reportsResponse.data);
                        const totalIncome = reportsResponse.data.reduce((sum, report) => sum + (report.tongThu || 0), 0);
                        const totalExpense = reportsResponse.data.reduce((sum, report) => sum + (report.tongNganSachChiTieu || 0), 0);
                        console.log('Total Income:', totalIncome);
                        console.log('Total Expense:', totalExpense);

                        const currentBudget = totalAllocations + totalIncome - totalExpense;
                        console.log('Current Budget:', currentBudget);

                        setFinancialData({
                            totalAllocations,
                            totalIncome,
                            totalExpense
                        });
                    } catch (error) {
                        console.error('Error fetching financial data:', error);
                        console.error('Error details:', {
                            message: error.message,
                            response: error.response?.data
                        });
                        setFinancialData({
                            totalAllocations: 0,
                            totalIncome: 0,
                            totalExpense: 0
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchDashboardData();
    }, []);

    useEffect(() => {
        const fetchPendingEvents = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/get-pending-events`);
                // Sắp xếp events trước khi set state
                const sortedEvents = sortEventsByDate(response.data);
                setPendingEvents(sortedEvents);
            } catch (error) {
                console.error('Error fetching pending events:', error);
            }
        };

        if (role === 'manager') {
            fetchPendingEvents();
        }
    }, [role]);

    // Tính toán ngân sách hiện tại
    const calculateCurrentBudget = () => {
        const { totalAllocations, totalIncome, totalExpense } = financialData;
        return totalAllocations + totalIncome - totalExpense;
    };

    // Student Dashboard Components
    const StudentDashboard = () => {
        const [currentBudget, setCurrentBudget] = useState(0);

        useEffect(() => {
            const fetchClubBudget = async () => {
                try {
                    const clubId = userData?.managedClubs[0]?._id;
                    if (!clubId) return;

                    const response = await axios.get(`${baseURL}/api/get-club-budget/${clubId}`);
                    setCurrentBudget(response.data.budget);
                } catch (error) {
                    console.error('Error fetching club budget:', error);
                }
            };

            if (userData?.managedClubs?.length > 0) {
                fetchClubBudget();
            }
        }, [userData]);

        return (
            <div className="mt-12">
                {/* Statistics Cards - Thêm hover và shadow effects */}
                <div className="grid mb-12 gap-y-10 gap-x-6 md:grid-cols-4">
                    <StatisticsCard
                        title="CLB đang quản lý"
                        value={userData?.managedClubs[0]?.ten}
                        icon={<UserGroupIcon className="w-6 h-6 text-blue-500" />}
                    />
                    <StatisticsCard
                        title="Ngân Sách Hiện Tại"
                        value={`${currentBudget.toLocaleString()}đ`}
                        icon={<BanknotesIcon className="w-6 h-6 text-green-500" />}
                    />
                    <StatisticsCard
                        title="Tổng Thành Viên"
                        value={userData?.totalMembers || 0}
                        icon={<UserGroupIcon className="w-6 h-6" />}
                    />
                    <StatisticsCard
                        title="Tổng Giải Thưởng"
                        value={userData?.totalAwards || 0}
                        icon={<TrophyIcon className="w-6 h-6" />}
                    />
                </div>

                {/* Charts - Improved styling */}
                <div className="grid grid-cols-1 mb-6 gap-y-12 gap-x-6 md:grid-cols-2">
                    <Card className="transition-shadow duration-300 hover:shadow-lg">
                        <CardHeader className={`relative bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-blue-500/40 shadow-lg -mt-6 p-6 mb-8`}>
                            <Typography variant="h6" color="blue-gray" className="text-xl font-semibold text-white">
                                Hoạt Động/Sự Kiện
                            </Typography>
                        </CardHeader>
                        <CardBody className="h-[300px]">
                            <div className="w-full h-full">
                                <Line data={eventChartData} options={chartOptions} />
                            </div>
                        </CardBody>
                    </Card>
                    <Card className="transition-shadow duration-300 hover:shadow-lg">
                        <CardHeader className={`relative bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-blue-500/40 shadow-lg -mt-6 p-6 mb-8`}>
                            <Typography variant="h6" color="blue-gray" className="text-xl font-semibold text-white">
                                Giải Thưởng
                            </Typography>
                        </CardHeader>
                        <CardBody className="h-[300px]">
                            <div className="w-full h-full">
                                <Line data={awardsChartData} options={chartOptions} />
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Recent Members Table - Enhanced styling */}
                <Card className="hover:shadow-lg transition-shadow duration-300 mt-[3.2rem]">
                    <CardHeader className={`relative bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-blue-500/40 shadow-lg -mt-6 p-6 mb-8`}>
                        <Typography variant="h6" color="blue-gray" className="text-xl font-semibold text-white">
                            Thành Viên Mới
                        </Typography>
                    </CardHeader>
                    <CardBody>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[640px] table-auto">
                                <thead>
                                    <tr className="bg-blue-gray-50">
                                        <th className="px-4 py-3 text-left border-b border-blue-gray-50">
                                            <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                                                Họ Tên
                                            </Typography>
                                        </th>
                                        <th className="px-4 py-3 text-left border-b border-blue-gray-50">
                                            <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                                                MSHS
                                            </Typography>
                                        </th>
                                        <th className="px-4 py-3 text-left border-b border-blue-gray-50">
                                            <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                                                Lớp
                                            </Typography>
                                        </th>
                                        <th className="px-4 py-3 text-left border-b border-blue-gray-50">
                                            <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                                                Ngày Tham Gia
                                            </Typography>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userData?.recentMembers?.map((member, index) => (
                                        <tr key={member._id} 
                                            className={`hover:bg-blue-gray-50/50 transition-colors duration-200
                                            ${index % 2 === 0 ? 'bg-blue-gray-50/30' : ''}`}>
                                            <td className="px-4 py-3">
                                                <Typography variant="small" className="text-xs font-semibold text-blue-gray-600">
                                                    {member.hoTen}
                                                </Typography>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Typography variant="small" className="text-xs font-semibold text-blue-gray-600">
                                                    {member.maSoHocSinh}
                                                </Typography>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Typography variant="small" className="text-xs font-semibold text-blue-gray-600">
                                                    {member.lop}
                                                </Typography>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Typography variant="small" className="text-xs font-semibold text-blue-gray-600">
                                                    {formatDate(member.ngayThamGia)}
                                                </Typography>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                </Card>
            </div>
        );
    };

    // Teacher Dashboard Components
    const TeacherDashboard = () => (
        <div className="mt-12">
            {/* Statistics Cards */}
            <div className="grid mb-12 gap-y-10 gap-x-6 md:grid-cols-4">
                <StatisticsCard
                    title="Tổng Câu Lạc Bộ"
                    value={userData?.totalClubs || 0}
                    icon={<BuildingLibraryIcon className="w-6 h-6" />}
                />
                <StatisticsCard
                    title="Tổng Học Sinh Tham Gia"
                    value={userData?.totalStudents || 0}
                    icon={<UserGroupIcon className="w-6 h-6" />}
                />
                <StatisticsCard
                    title="Sự Kiện Đã Tổ Chức"
                    value={userData?.totalEvents || 0}
                    icon={<CalendarIcon className="w-6 h-6" />}
                />
                <StatisticsCard
                    title="Giải Thưởng Đạt Được"
                    value={userData?.totalAwards || 0}
                    icon={<TrophyIcon className="w-6 h-6" />}
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 mb-6 gap-y-12 gap-x-6 md:grid-cols-2">
                <Card>
                    <CardHeader className="p-2">
                        <Typography variant="h6">Thống Kê Sự Kiện</Typography>
                    </CardHeader>
                    <CardBody className="h-72">
                        <Line data={schoolEventsData} options={chartOptions} />
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader className="p-2">
                        <Typography variant="h6">Thống Kê Giải Thưởng</Typography>
                    </CardHeader>
                    <CardBody className="h-72">
                        <Line data={schoolAwardsData} options={chartOptions} />
                    </CardBody>
                </Card>
            </div>

            {/* Pending Events Table - Enhanced styling */}
            <Card className="mt-[3.2rem]">
                <CardHeader className={`relative bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-blue-500/40 shadow-lg -mt-6 p-6 mb-8`}>
                    <div className="flex items-center justify-between">
                        <Typography variant="h6" className="text-xl font-semibold text-white">
                            Sự Kiện Chờ Duyệt
                        </Typography>
                        <Link 
                            to="/dashboard/approve-events" 
                            className="font-medium text-white transition-colors duration-300 hover:text-blue-100"
                        >
                            Xem tất cả →
                        </Link>
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] table-auto">
                            <thead>
                                <tr>
                                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                                        <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                                            Tên Sự Kiện
                                        </Typography>
                                    </th>
                                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                                        <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                                            CLB Tổ Chức
                                        </Typography>
                                    </th>
                                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                                        <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                                            Ngày Tổ Chức
                                        </Typography>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingEvents.map((event, index) => (
                                    <tr key={event._id} 
                                        className={`hover:bg-blue-gray-50/50 transition-colors duration-200
                                        ${index % 2 === 0 ? 'bg-blue-gray-50/30' : ''}`}>
                                        <td className="py-3 px-6">
                                            <Typography variant="small" className="text-sm font-semibold text-blue-gray-600">
                                                {event.ten}
                                            </Typography>
                                        </td>
                                        <td className="py-3 px-6">
                                            <Typography variant="small" className="text-sm font-semibold text-blue-gray-600">
                                                {event.club?.ten}
                                            </Typography>
                                        </td>
                                        <td className="py-3 px-6">
                                            <Typography variant="small" className="text-sm font-semibold text-blue-gray-600">
                                                {formatDate(event.ngayToChuc)}
                                            </Typography>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>
        </div>
    );

    return role === "manager" ? <TeacherDashboard /> : <StudentDashboard />;
}

export default Home;
