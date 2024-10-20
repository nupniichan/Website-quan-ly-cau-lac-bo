import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";

const ClubReports = () => {
  return (
    <div className="mt-12">
      <Card>
        <CardHeader color="orange" contentPosition="none">
          <div className="w-full flex items-center justify-between">
            <h2 className="text-white text-2xl">Báo cáo từ câu lạc bộ</h2>
          </div>
        </CardHeader>
        <CardBody>
          <Typography color="gray" className="mt-4 mb-8">
            Các báo cáo từ câu lạc bộ sẽ được hiển thị ở đây.
          </Typography>
          {/* Add your club reports logic here */}
        </CardBody>
      </Card>
    </div>
  );
};

export default ClubReports;
