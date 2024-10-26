import React from "react";
import PropTypes from "prop-types";
import { reducer } from "./actions";

export const MaterialTailwind = React.createContext(null);
MaterialTailwind.displayName = "MaterialTailwindContext";

export function MaterialTailwindControllerProvider({ children }) {
    const initialState = {
        openSidenav: false,
        sidenavColor: "dark",
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

MaterialTailwindControllerProvider.displayName = "/src/context/index.jsx";

MaterialTailwindControllerProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
