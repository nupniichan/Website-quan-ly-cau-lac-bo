import {
    setFixedNavbar,
    setOpenConfigurator,
    setSidenavColor,
    setSidenavType
} from "@/context/action";
import { useMaterialTailwindController } from "@/context/useMaterialTailwindController";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
    Button,
    IconButton,
    Switch,
    Typography,
} from "@material-tailwind/react";
import React from "react";

function formatNumber(number, decPlaces) {
    decPlaces = Math.pow(10, decPlaces);

    const abbrev = ["K", "M", "B", "T"];

    for (let i = abbrev.length - 1; i >= 0; i--) {
        var size = Math.pow(10, (i + 1) * 3);

        if (size <= number) {
            number = Math.round((number * decPlaces) / size) / decPlaces;

            if (number == 1000 && i < abbrev.length - 1) {
                number = 1;
                i++;
            }

            number += abbrev[i];

            break;
        }
    }

    return number;
}

export function Configurator() {
    const [controller, dispatch] = useMaterialTailwindController();
    const { openConfigurator, sidenavColor, sidenavType, fixedNavbar } =
        controller;
    const [stars, setStars] = React.useState(0);

    const sidenavColors = {
        // white: "from-gray-100 to-gray-100 border-gray-200",
        // dark: "from-black to-black border-gray-200",
        green: "from-green-400 to-green-600",
        orange: "from-orange-400 to-orange-600",
        red: "from-red-400 to-red-600",
        pink: "from-pink-400 to-pink-600",
        blue: "from-blue-400 to-blue-600",
        teal: "from-teal-400 to-teal-600",
        cyan: "from-cyan-400 to-cyan-600",
        purple: "from-purple-400 to-purple-600",
    };

    // React.useEffect(() => {
    //     const stars = fetch(
    //         "https://api.github.com/repos/creativetimofficial/material-tailwind-dashboard-react",
    //     )
    //         .then((response) => response.json())
    //         .then((data) => setStars(formatNumber(data.stargazers_count, 1)));
    // }, []);

    return (
        <aside
            className={`fixed top-0 right-0 z-50 h-screen w-96 bg-white px-2.5 shadow-lg transition-transform duration-300 sm:overflow-y-scroll scrollbar-hide ${
                openConfigurator ? "translate-x-0" : "translate-x-96"
            }`}
        >
            <div className="flex items-start justify-between px-6 pt-8 pb-6">
                <div>
                    <Typography variant="h5" color="blue-gray">
                        Cấu Hình Bảng Điều Khiển
                    </Typography>
                    <Typography className="font-normal text-blue-gray-600">
                        Các tùy chọn bảng điều khiển.
                    </Typography>
                </div>
                <IconButton
                    variant="text"
                    color="blue-gray"
                    onClick={() => setOpenConfigurator(dispatch, false)}
                >
                    <XMarkIcon strokeWidth={2.5} className="w-5 h-5" />
                </IconButton>
            </div>
            <div className="px-6 py-4">
                <div className="mb-12">
                    <Typography variant="h6" color="blue-gray">
                        Màu Thanh Bên
                    </Typography>
                    <div className="flex items-center gap-2 mt-3">
                        {Object.keys(sidenavColors).map((color) => (
                            <span
                                key={color}
                                className={`h-6 w-6 cursor-pointer rounded-full border bg-gradient-to-br transition-transform hover:scale-105 ${
                                    sidenavColors[color]
                                } ${
                                    sidenavColor === color
                                        ? "border-black"
                                        : "border-transparent"
                                }`}
                                onClick={() => setSidenavColor(dispatch, color)}
                            />
                        ))}
                    </div>
                </div>
                <div className="mb-12">
                    <Typography variant="h6" color="blue-gray">
                        Kiểu Thanh Bên
                    </Typography>
                    <Typography variant="small" color="gray">
                        Chọn một trong 3 kiểu thanh bên khác nhau.
                    </Typography>
                    <div className="flex items-center gap-2 mt-3">
                        <Button
                            variant={sidenavType === "dark" ? "gradient" : "outlined"}
                            onClick={() => setSidenavType(dispatch, "dark")}
                        >
                            Tối
                        </Button>
                        <Button
                            variant={sidenavType === "transparent" ? "gradient" : "outlined"}
                            onClick={() => setSidenavType(dispatch, "transparent")}
                        >
                            Trong Suốt
                        </Button>
                        <Button
                            variant={sidenavType === "white" ? "gradient" : "outlined"}
                            onClick={() => setSidenavType(dispatch, "white")}
                        >
                            Sáng
                        </Button>
                    </div>
                </div>
                <div className="mb-12">
                    <hr />
                    <div className="flex items-center justify-between py-5">
                        <Typography variant="h6" color="blue-gray">
                            Cố Định Thanh Điều Hướng
                        </Typography>
                        <Switch
                            id="navbar-fixed"
                            value={fixedNavbar}
                            onChange={() => setFixedNavbar(dispatch, !fixedNavbar)}
                        />
                    </div>
                    <hr />
                </div>
            </div>
        </aside>
    );
}

Configurator.displayName = "/src/widgets/layout/configurator.jsx";

export default Configurator;
