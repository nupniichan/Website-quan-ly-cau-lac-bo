import React from 'react';
import { Card, CardBody, Typography } from '@material-tailwind/react';

export function StatisticsCard({ title, value, icon }) {
    return (
        <Card className="shadow-lg">
            <CardBody className="p-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-full bg-blue-500 p-2">
                        {React.cloneElement(icon, {
                            className: "w-4 h-4 text-white"
                        })}
                    </div>
                    
                    <div className="flex flex-col gap-1">
                        <Typography 
                            variant="small" 
                            className="font-bold text-gray-900 text-sm uppercase tracking-wider"
                        >
                            {title}
                        </Typography>
                        <Typography 
                            variant="h6"
                            className="text-gray-600 font-normal text-base" 
                        >
                            {value}
                        </Typography>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
} 