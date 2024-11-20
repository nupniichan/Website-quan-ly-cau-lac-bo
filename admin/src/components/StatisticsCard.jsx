import React from "react";
import {
    Card,
    CardBody,
    IconButton,
    Typography,
} from "@material-tailwind/react";
import { useMaterialTailwindController } from "@/context/useMaterialTailwindController";

export function StatisticsCard({ title, value, icon }) {
    // Lấy controller từ context & màu hiện tại của sidenav
    const [controller] = useMaterialTailwindController();
    const { sidenavColor } = controller;

    return (
        <Card className="shadow-lg">
            <CardBody className="p-4">
                <div className="flex items-center gap-3">
                    <IconButton
                        color={sidenavColor}
                        className={"p-2 transition-shadow duration-500 shadow-md ease hover:shadow-lg bg-clip-border rounded-xl"}
                    >
                        {React.cloneElement(icon, {
                            className: "w-4 h-4 text-white",
                        })}
                    </IconButton>

                    <div className="flex flex-col">
                        <Typography
                            variant="small"
                            className="text-base font-semibold tracking-normal text-gray-900"
                        >
                            {title}
                        </Typography>
                        <Typography
                            variant="h6"
                            className="text-xs font-medium text-gray-600"
                        >
                            {value}
                        </Typography>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
