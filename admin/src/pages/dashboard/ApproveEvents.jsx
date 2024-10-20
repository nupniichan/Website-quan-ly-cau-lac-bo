import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";

const ApproveEvents = () => {
  return (
    <div className="mt-12">
      <Card>
        <CardHeader color="green" contentPosition="none">
          <div className="w-full flex items-center justify-between">
            <h2 className="text-white text-2xl">Phê duyệt sự kiện</h2>
          </div>
        </CardHeader>
        <CardBody>
          <Typography color="gray" className="mt-4 mb-8">
            Danh sách các sự kiện cần phê duyệt sẽ được hiển thị ở đây.
          </Typography>
          {/* Add your event approval logic here */}
        </CardBody>
      </Card>
    </div>
  );
};
export default ApproveEvents;

