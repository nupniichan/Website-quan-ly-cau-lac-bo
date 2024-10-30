import React, { useEffect, useState } from "react";
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
                setPendingEvents(response.data);
            } catch (error) {
                console.error('Error fetching pending events:', error);
            }
        };

        if (role === 'manager') {
            fetchPendingEvents();
        }
    }, [role]);

    // Student Dashboard Components
    const StudentDashboard = () => (
        <div className="mt-12">
            {/* Statistics Cards - Thêm hover và shadow effects */}
            <div className="grid mb-12 gap-y-10 gap-x-6 md:grid-cols-4">
                <StatisticsCard
                    title={'CLB đang quản lý'}
                    value={userData?.managedClubs[0]?.ten}
                    icon={<UserGroupIcon className="w-6 h-6 text-blue-500" />}
                />
                <StatisticsCard
                    title="Tổng Thành Viên"
                    value={userData?.totalMembers || 0}
                    icon={<UserGroupIcon className="w-6 h-6" />}
                />
                <StatisticsCard
                    title="Ngân Sách Hiện Tại"
                    value={`${userData?.budget || 0}đ`}
                    icon={<BanknotesIcon className="w-6 h-6" />}
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
                    <CardHeader>
                        <Typography variant="h6">Thống Kê Sự Kiện</Typography>
                    </CardHeader>
                    <CardBody>
                        <Line data={schoolEventsData} options={chartOptions} />
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader>
                        <Typography variant="h6">Thống Kê Giải Thưởng</Typography>
                    </CardHeader>
                    <CardBody>
                        <Line data={schoolAwardsData} options={chartOptions} />
                    </CardBody>
                </Card>
            </div>

            {/* Pending Events Table - Enhanced styling */}
            <Card className="transition-shadow duration-300 hover:shadow-lg">
                <CardHeader className={`${cardHeaderStyles} p-4 flex items-center justify-between`}>
                    <Typography variant="h6" color="blue-gray" className="font-semibold">
                        Sự Kiện Chờ Duyệt
                    </Typography>
                    <Link 
                        to="/dashboard/approve-events" 
                        className="font-medium text-blue-500 transition-colors duration-300 hover:text-blue-700"
                    >
                        Xem tất cả →
                    </Link>
                </CardHeader>
                <CardBody>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] table-auto">
                            <thead>
                                <tr className="bg-blue-gray-50">
                                    <th className="px-4 py-3 text-left border-b border-blue-gray-50">
                                        <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                                            Tên Sự Kiện
                                        </Typography>
                                    </th>
                                    <th className="px-4 py-3 text-left border-b border-blue-gray-50">
                                        <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                                            CLB Tổ Chức
                                        </Typography>
                                    </th>
                                    <th className="px-4 py-3 text-left border-b border-blue-gray-50">
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
                                        <td className="px-4 py-3">
                                            <Typography variant="small" className="text-xs font-semibold text-blue-gray-600">
                                                {event.ten}
                                            </Typography>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Typography variant="small" className="text-xs font-semibold text-blue-gray-600">
                                                {event.club?.ten}
                                            </Typography>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Typography variant="small" className="text-xs font-semibold text-blue-gray-600">
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
