import React from 'react';
import { Card, CardBody, Typography } from '@material-tailwind/react';

export function StatisticsCard({ title, value, icon }) {
    return (
        <Card className="shadow-lg">
            <CardBody className="p-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 transition-shadow duration-500 shadow-md ease hover:shadow-lg bg-clip-border rounded-xl bg-gradient-to-tr from-blue-600 to-blue-400 hover:shadow-blue-500/30 shadow-blue-500/20">
                        {React.cloneElement(icon, {
                            className: "w-4 h-4 text-white"
                        })}
                    </div>
                    
                    <div className="flex flex-col ">
                        <Typography 
                            variant="small" 
                            className="text-base font-semibold tracking-normal text-gray-900"
                        >
                            {title}
                        </Typography>
                        <Typography 
                            variant="h6"
                            className="text-xs font-normal text-gray-600" 
                        >
                            {value}
                        </Typography>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
} 