import { Route, Routes } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
    Configurator,
    DashboardNavbar,
    Footer,
    Sidenav,
} from "@/widgets/layout";
import { setOpenConfigurator } from "@/context/action";
import { useMaterialTailwindController } from "@/context/useMaterialTailwindController";
import { useEffect, useState } from "react";
import {
    CalendarIcon,
    CheckCircleIcon,
    CurrencyDollarIcon,
    DocumentTextIcon,
    HomeIcon,
    TrophyIcon,
    UserGroupIcon,
} from "@heroicons/react/24/solid";

// Import components for each route
import Home from "../pages/dashboard/Home";
import ManageClubs from "../pages/dashboard/ManageClubs";
import ApproveEvents from "../pages/dashboard/ApproveEvents";
import ClubReports from "../pages/dashboard/ClubReports";
import BudgetAllocation from "../pages/dashboard/BudgetAllocation";
import ManageMembers from "../pages/dashboard/ManageMembers";
import ManageEvents from "../pages/dashboard/ManageEvents";
import ManageBudget from "../pages/dashboard/ManageBudget";
import ManagePrizes from "../pages/dashboard/ManagePrizes";
import ActivityReports from "../pages/dashboard/ActivityReports";
import Table from "../pages/dashboard/tables";
import Profile from "../pages/dashboard/profile";

export function Dashboard() {
    const [controller, dispatch] = useMaterialTailwindController();
    const { sidenavType } = controller;
    const [role, setRole] = useState(null);

    useEffect(() => {
        const userRole = localStorage.getItem("role");
        setRole(userRole);
    }, []);

    const principalRoutes = [
        {
            icon: <HomeIcon />,
            name: "Trang chủ",
            path: "/dashboard/home",
            element: <Home />,
        },
        {
            icon: <UserGroupIcon />,
            name: "Quản lý câu lạc bộ",
            path: "/dashboard/manage-clubs",
            element: <ManageClubs />,
        },
        {
            icon: <CheckCircleIcon />,
            name: "Phê duyệt sự kiện",
            path: "/dashboard/approve-events",
            element: <ApproveEvents />,
        },
        {
            icon: <DocumentTextIcon />,
            name: "Báo cáo từ câu lạc bộ",
            path: "/dashboard/club-reports",
            element: <ClubReports />,
        },
        {
            icon: <CurrencyDollarIcon />,
            name: "Phân bổ ngân sách",
            path: "/dashboard/budget-allocation",
            element: <BudgetAllocation />,
        },
        {
            icon: <CurrencyDollarIcon />,
            name: "Table",
            path: "/dashboard/table",
            element: <Table />,
        },
        {
            icon: <CurrencyDollarIcon />,
            name: "Profile",
            path: "/dashboard/profile",
            element: <Profile />,
        },
    ];

    const studentRoutes = [
        {
            icon: <HomeIcon />,
            name: "Trang chủ",
            path: "/dashboard/home",
            element: <Home />,
        },
        {
            icon: <UserGroupIcon />,
            name: "Quản lý thành viên",
            path: "/dashboard/manage-members",
            element: <ManageMembers />,
        },
        {
            icon: <CalendarIcon />,
            name: "Quản lý sự kiện & lịch trình",
            path: "/dashboard/manage-events",
            element: <ManageEvents />,
        },
        {
            icon: <CurrencyDollarIcon />,
            name: "Quản lý ngân sách",
            path: "/dashboard/manage-budget",
            element: <ManageBudget />,
        },
        {
            icon: <TrophyIcon />,
            name: "Quản lý giải thưởng",
            path: "/dashboard/manage-prizes",
            element: <ManagePrizes />,
        },
        {
            icon: <DocumentTextIcon />,
            name: "Báo cáo hoạt động",
            path: "/dashboard/activity-reports",
            element: <ActivityReports />,
        },
        {
            icon: <CurrencyDollarIcon />,
            name: "Table",
            path: "/dashboard/table",
            element: <Table />,
        },
        {
            icon: <CurrencyDollarIcon />,
            name: "Profile",
            path: "/dashboard/profile",
            element: <Profile />,
        },
    ];

    const currentRoutes = role === "manager" ? principalRoutes : studentRoutes;

    return (
        <div className="min-h-screen bg-blue-gray-50/50">
            <Sidenav
                routes={[{ pages: currentRoutes }]}
                brandImg={sidenavType === "dark"
                    ? "/img/logo-ct.png"
                    : "/img/logo-ct-dark.png"}
            />
            <div className="p-4 xl:ml-80">
                <DashboardNavbar />
                <Configurator />
                <IconButton
                    size="lg"
                    color="white"
                    className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
                    ripple={false}
                    onClick={() => setOpenConfigurator(dispatch, true)}
                >
                    <Cog6ToothIcon className="h-5 w-5" />
                </IconButton>
                <div className="mt-12">
                    <h1>Dashboard Content</h1>
                    <Routes>
                        <Route index element={<Home />} />
                        {currentRoutes.map(({ path, element }) => (
                            <Route
                                key={path}
                                path={path.replace("/dashboard", "")}
                                element={element}
                            />
                        ))}
                    </Routes>
                </div>
                <div className="text-blue-gray-600">
                    <Footer />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;