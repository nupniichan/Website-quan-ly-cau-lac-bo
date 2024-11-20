import React from "react";
import PropTypes from "prop-types";
import { reducer } from "./action";
import { MaterialTailwind } from "./MaterialTailwindContext"; // Updated import

export function MaterialTailwindControllerProvider({ children }) {
    const initialState = {
        openSidenav: false,
        sidenavColor: "pink",
        sidenavType: "white",
        transparentNavbar: true,
        fixedNavbar: false,
        openConfigurator: false,
    };

    const [controller, dispatch] = React.useReducer(reducer, initialState);
    const value = React.useMemo(
        () => [controller, dispatch],
        [controller, dispatch],
    );

    return (
        <MaterialTailwind.Provider value={value}>
            {children}
        </MaterialTailwind.Provider>
    );
}

MaterialTailwindControllerProvider.displayName = "../context/index.jsx";

MaterialTailwindControllerProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
