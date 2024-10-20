import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";

const ManageBudget = () => {
  return (
    <div className="mt-12">
      <Card>
        <CardHeader color="cyan" contentPosition="none">
          <div className="w-full flex items-center justify-between">
            <h2 className="text-white text-2xl">Quản lý ngân sách</h2>
            <Button color="white" buttonType="link" size="lg" style={{ padding: 0 }}>
              <i className="fas fa-plus" />
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <Typography color="gray" className="mt-4 mb-8">
            Danh sách ngân sách.
          </Typography>
          {/* Add your event management logic here */}
        </CardBody>
      </Card>
    </div>
  );
};

export default ManageBudget;
