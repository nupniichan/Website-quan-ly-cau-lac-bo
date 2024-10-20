import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";

const BudgetAllocation = () => {
  return (
    <div className="mt-12">
      <Card>
        <CardHeader color="purple" contentPosition="none">
          <div className="w-full flex items-center justify-between">
            <h2 className="text-white text-2xl">Phân bổ ngân sách</h2>
          </div>
        </CardHeader>
        <CardBody>
          <Typography color="gray" className="mt-4 mb-8">
            Thông tin phân bổ ngân sách sẽ được hiển thị ở đây.
          </Typography>
          {/* Add your budget allocation logic here */}
        </CardBody>
      </Card>
    </div>
  );
};

export default BudgetAllocation;
