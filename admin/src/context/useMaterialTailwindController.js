import React from "react";
import { MaterialTailwind } from "./index"; // Update the path if needed

export function useMaterialTailwindController() {
    const context = React.useContext(MaterialTailwind);

    if (!context) {
        throw new Error(
            "useMaterialTailwindController must be used within the MaterialTailwindControllerProvider.",
        );
    }

    return context;
}
