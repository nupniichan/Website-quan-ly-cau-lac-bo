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
<<<<<<< Updated upstream
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import {
  statisticsCardsData,
  statisticsChartsData,
  projectsTableData,
  ordersOverviewData,
} from "@/data";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";

export function Home() {
  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {statisticsCardsData.map(({ icon, title, footer, ...rest }) => (
          <StatisticsCard
            key={title}
            {...rest}
            title={title}
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-white",
            })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong className={footer.color}>{footer.value}</strong>
                &nbsp;{footer.label}
              </Typography>
            }
          />
        ))}
      </div>
      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        {statisticsChartsData.map((props) => (
          <StatisticsChart
            key={props.title}
            {...props}
            footer={
              <Typography
                variant="small"
                className="flex items-center font-normal text-blue-gray-600"
              >
                <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                &nbsp;{props.footer}
              </Typography>
            }
          />
        ))}
      </div>
      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Projects
              </Typography>
              <Typography
                variant="small"
                className="flex items-center gap-1 font-normal text-blue-gray-600"
              >
                <CheckCircleIcon strokeWidth={3} className="h-4 w-4 text-blue-gray-200" />
                <strong>30 done</strong> this month
              </Typography>
            </div>
            <Menu placement="left-start">
              <MenuHandler>
                <IconButton size="sm" variant="text" color="blue-gray">
                  <EllipsisVerticalIcon
                    strokeWidth={3}
                    fill="currenColor"
                    className="h-6 w-6"
                  />
                </IconButton>
              </MenuHandler>
              <MenuList>
                <MenuItem>Action</MenuItem>
                <MenuItem>Another Action</MenuItem>
                <MenuItem>Something else here</MenuItem>
              </MenuList>
            </Menu>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["companies", "members", "budget", "completion"].map(
                    (el) => (
                      <th
                        key={el}
                        className="border-b border-blue-gray-50 py-3 px-6 text-left"
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-medium uppercase text-blue-gray-400"
                        >
                          {el}
                        </Typography>
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {projectsTableData.map(
                  ({ img, name, members, budget, completion }, key) => {
                    const className = `py-3 px-5 ${
                      key === projectsTableData.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;

                    return (
                      <tr key={name}>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <Avatar src={img} alt={name} size="sm" />
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold"
                            >
                              {name}
                            </Typography>
                          </div>
                        </td>
                        <td className={className}>
                          {members.map(({ img, name }, key) => (
                            <Tooltip key={name} content={name}>
                              <Avatar
                                src={img}
                                alt={name}
                                size="xs"
                                variant="circular"
                                className={`cursor-pointer border-2 border-white ${
                                  key === 0 ? "" : "-ml-2.5"
                                }`}
                              />
                            </Tooltip>
                          ))}
                        </td>
                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                            {budget}
                          </Typography>
                        </td>
                        <td className={className}>
                          <div className="w-10/12">
                            <Typography
                              variant="small"
                              className="mb-1 block text-xs font-medium text-blue-gray-600"
                            >
                              {completion}%
                            </Typography>
                            <Progress
                              value={completion}
                              variant="gradient"
                              color={completion === 100 ? "green" : "blue"}
                              className="h-1"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
        <Card className="border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-6"
          >
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Orders Overview
            </Typography>
            <Typography
              variant="small"
              className="flex items-center gap-1 font-normal text-blue-gray-600"
            >
              <ArrowUpIcon
                strokeWidth={3}
                className="h-3.5 w-3.5 text-green-500"
              />
              <strong>24%</strong> this month
            </Typography>
          </CardHeader>
          <CardBody className="pt-0">
            {ordersOverviewData.map(
              ({ icon, color, title, description }, key) => (
                <div key={title} className="flex items-start gap-4 py-3">
                  <div
                    className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${
                      key === ordersOverviewData.length - 1
                        ? "after:h-0"
                        : "after:h-4/6"
                    }`}
                  >
                    {React.createElement(icon, {
                      className: `!w-5 !h-5 ${color}`,
                    })}
                  </div>
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-medium"
                    >
                      {title}
                    </Typography>
                    <Typography
                      as="span"
                      variant="small"
                      className="text-xs font-medium text-blue-gray-500"
                    >
                      {description}
                    </Typography>
                  </div>
                </div>
              )
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
=======
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
            <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-4">
                <StatisticsCard
                    className="hover:scale-105 transition-transform duration-300"
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
            <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2">
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className={`${cardHeaderStyles} p-4`}>
                        <Typography variant="h6" color="blue-gray" className="mb-2 font-bold text-xl">
                            Hoạt Động/Sự Kiện
                        </Typography>
                    </CardHeader>
                    <CardBody className="h-[300px]">
                        <div className="w-full h-full">
                            <Line data={eventChartData} options={chartOptions} />
                        </div>
                    </CardBody>
                </Card>
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className={`${cardHeaderStyles} p-4`}>
                        <Typography variant="h6" color="blue-gray" className="mb-2 font-bold text-xl">
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
            <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className={`${cardHeaderStyles} p-4`}>
                    <Typography variant="h6" color="blue-gray" className="mb-2 font-bold text-xl">
                        Thành Viên Mới
                    </Typography>
                </CardHeader>
                <CardBody>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] table-auto">
                            <thead>
                                <tr className="bg-blue-gray-50">
                                    <th className="border-b border-blue-gray-50 py-3 px-4 text-left">
                                        <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                                            Họ Tên
                                        </Typography>
                                    </th>
                                    <th className="border-b border-blue-gray-50 py-3 px-4 text-left">
                                        <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                                            MSHS
                                        </Typography>
                                    </th>
                                    <th className="border-b border-blue-gray-50 py-3 px-4 text-left">
                                        <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                                            Lớp
                                        </Typography>
                                    </th>
                                    <th className="border-b border-blue-gray-50 py-3 px-4 text-left">
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
                                        <td className="py-3 px-4">
                                            <Typography variant="small" className="text-xs font-semibold text-blue-gray-600">
                                                {member.hoTen}
                                            </Typography>
                                        </td>
                                        <td className="py-3 px-4">
                                            <Typography variant="small" className="text-xs font-semibold text-blue-gray-600">
                                                {member.maSoHocSinh}
                                            </Typography>
                                        </td>
                                        <td className="py-3 px-4">
                                            <Typography variant="small" className="text-xs font-semibold text-blue-gray-600">
                                                {member.lop}
                                            </Typography>
                                        </td>
                                        <td className="py-3 px-4">
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
            <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-4">
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
            <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2">
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
            <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className={`${cardHeaderStyles} p-4 flex items-center justify-between`}>
                    <Typography variant="h6" color="blue-gray" className="font-semibold">
                        Sự Kiện Chờ Duyệt
                    </Typography>
                    <Link 
                        to="/dashboard/approve-events" 
                        className="text-blue-500 hover:text-blue-700 font-medium transition-colors duration-300"
                    >
                        Xem tất cả →
                    </Link>
                </CardHeader>
                <CardBody>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] table-auto">
                            <thead>
                                <tr className="bg-blue-gray-50">
                                    <th className="border-b border-blue-gray-50 py-3 px-4 text-left">
                                        <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                                            Tên Sự Kiện
                                        </Typography>
                                    </th>
                                    <th className="border-b border-blue-gray-50 py-3 px-4 text-left">
                                        <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                                            CLB Tổ Chức
                                        </Typography>
                                    </th>
                                    <th className="border-b border-blue-gray-50 py-3 px-4 text-left">
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
                                        <td className="py-3 px-4">
                                            <Typography variant="small" className="text-xs font-semibold text-blue-gray-600">
                                                {event.ten}
                                            </Typography>
                                        </td>
                                        <td className="py-3 px-4">
                                            <Typography variant="small" className="text-xs font-semibold text-blue-gray-600">
                                                {event.club?.ten}
                                            </Typography>
                                        </td>
                                        <td className="py-3 px-4">
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
>>>>>>> Stashed changes
}

export default Home;
