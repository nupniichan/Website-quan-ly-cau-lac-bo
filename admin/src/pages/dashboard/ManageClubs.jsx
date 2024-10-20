import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";

const ManageClubs = () => {
  return (
    <div className="mt-12">
      <Card>
        <CardHeader color="blue" contentPosition="none">
          <div className="w-full flex items-center justify-between">
            <h2 className="text-white text-2xl">Quản lý câu lạc bộ</h2>
            <Button color="white" buttonType="link" size="lg" style={{ padding: 0 }}>
              <i className="fas fa-plus" />
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <Typography color="gray" className="mt-4 mb-8">
            Danh sách các câu lạc bộ sẽ được hiển thị ở đây.
          </Typography>
          {/* Add your club management logic here */}
        </CardBody>
      </Card>
      <h1>Câu lạc bộ</h1>
    </div>
  );
};

export default ManageClubs;
