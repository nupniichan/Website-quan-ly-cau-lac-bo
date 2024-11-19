import React from "react";
import { MaterialTailwind } from "./MaterialTailwindContext"; // Updated import

export function useMaterialTailwindController() {
    const context = React.useContext(MaterialTailwind);

    if (!context) {
        throw new Error(
            "useMaterialTailwindController must be used within the MaterialTailwindControllerProvider.",
        );
    }

    return context;
}