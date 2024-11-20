import { setOpenSidenav } from "@/context/action";
import { useMaterialTailwindController } from "@/context/useMaterialTailwindController";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
    Avatar,
    Button,
    IconButton,
    Typography,
} from "@material-tailwind/react";
import PropTypes from "prop-types";
import React from "react";
import { Link, NavLink } from "react-router-dom";

export function Sidenav({ brandImg, brandName, routes }) {
    const [controller, dispatch] = useMaterialTailwindController();
    const { sidenavColor, sidenavType, openSidenav } = controller;
    const sidenavTypes = {
        dark: "bg-gradient-to-br from-gray-800 to-gray-900",
        white: "bg-white shadow-sm",
        transparent: "bg-transparent",
    };

    return (
        <aside
            className={`${sidenavTypes[sidenavType]} ${
                openSidenav ? "translate-x-0" : "-translate-x-80"
            } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100`}
        >
            <div className="sticky top-0">
                <Link to="/" className="py-6 px-8 text-center">
                    <Typography
                        variant="h6"
                        color={sidenavType === "dark" ? "white" : "blue-gray"}
                    >
                        {brandName}
                    </Typography>
                </Link>
                <IconButton
                    variant="text"
                    color="white"
                    size="sm"
                    ripple={false}
                    className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
                    onClick={() => setOpenSidenav(dispatch, false)}
                >
                    <XMarkIcon
                        strokeWidth={2.5}
                        className="h-5 w-5 text-white"
                    />
                </IconButton>
            </div>
            <div className="m-4 overflow-y-auto scrollbar-hide">
                {Array.isArray(routes) &&
                    routes.map((route, key) => (
                        <ul key={key} className="mb-4 flex flex-col gap-1">
                            {Array.isArray(route.pages) &&
                                route.pages.map(({ icon, name, path }) => (
                                    <li key={name}>
                                        <NavLink to={path}>
                                            {({ isActive }) => (
                                                <Button
                                                    variant={isActive
                                                        ? "gradient"
                                                        : "text"}
                                                    color={isActive
                                                        ? sidenavColor
                                                        : sidenavType === "dark"
                                                        ? "white"
                                                        : "blue-gray"}
                                                    className="flex items-center gap-2 px-3 capitalize"
                                                    fullWidth
                                                >
                                                    {React.cloneElement(icon, {
                                                        className: "h-4 w-4",
                                                    })}
                                                    <Typography
                                                        color="inherit"
                                                        className="font-medium capitalize text-sm"
                                                    >
                                                        {name}
                                                    </Typography>
                                                </Button>
                                            )}
                                        </NavLink>
                                    </li>
                                ))}
                        </ul>
                    ))}
            </div>
        </aside>
    );
}

Sidenav.defaultProps = {
    brandImg: "/img/logo-ct.png",
    brandName: "Quản lý câu lạc bộ trường THPT",
};

Sidenav.propTypes = {
    brandImg: PropTypes.string,
    brandName: PropTypes.string,
    routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidenav.displayName = "/src/widgets/layout/sidnave.jsx";

export default Sidenav;
