import { useEffect, useState } from "react";
import {
    Button,
    Card,
    Checkbox,
    Input,
    Typography,
} from "@material-tailwind/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";

export function SignIn() {
    const [email, setEmail] = useState(""); // Đổi thành email
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    // Lấy redirect URL từ query parameter
    const [redirectUrl, setRedirectUrl] = useState("/dashboard/home");

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const redirect = params.get("redirect");
        if (redirect) {
            setRedirectUrl(redirect);
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post(
                "http://4.242.20.80:5500/api/login",
                {
                    email,
                    password,
                },
            );

            if (response.status === 200 && response.data.token) {
                const role = response.data.role;

                // Nếu là manager, cho phép đăng nhập trực tiếp
                if (role === "manager") {
                    localStorage.setItem("role", role);
                    localStorage.setItem("token", response.data.token);
                    const decodedToken = JSON.parse(
                        atob(response.data.token.split(".")[1]),
                    );
                    localStorage.setItem("userId", decodedToken.userId);
                    navigate(redirectUrl);
                    return;
                }

                // Đối với các role khác, kiểm tra xem có quản lý CLB nào không
                const decodedToken = JSON.parse(
                    atob(response.data.token.split(".")[1]),
                );
                const userId = decodedToken.userId;

                try {
                    const clubsResponse = await axios.get(
                        `http://4.242.20.80:5500/api/get-managed-clubs/${userId}`,
                    );

                    if (clubsResponse.data && clubsResponse.data.length > 0) {
                        // Có quản lý CLB, cho phép đăng nhập
                        localStorage.setItem("role", role);
                        localStorage.setItem("token", response.data.token);
                        localStorage.setItem("userId", userId);
                        localStorage.setItem(
                            "managedClubs",
                            JSON.stringify(clubsResponse.data),
                        );
                        navigate(redirectUrl);
                    } else {
                        // Không quản lý CLB nào
                        // alert(
                        //     "Bạn đang không quản lý câu lạc bộ nào. Vui lòng liên hệ quản trị viên.",
                        // );
                        message.warning({content: "Bạn đang không quản lý câu lạc bộ nào. Vui lòng liên hệ quản trị viên."});
                    }
                } catch (clubError) {
                    console.error("Error fetching managed clubs:", clubError);
                    message.error({content: "Có lỗi xảy ra khi kiểm tra thông tin câu lạc bộ."});
                    // alert("Có lỗi xảy ra khi kiểm tra thông tin câu lạc bộ.");
                }
            }
        } catch (error) {
            console.error("Đăng nhập thất bại:", error);
            // alert(
            //     "Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.",
            // );
            message.error({content: "Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu."});
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="m-8 flex justify-center items-center min-h-screen">
            <Card className="w-full max-w-xl p-8 shadow-xl">
                <div className="text-center">
                    <Typography variant="h2" className="font-bold mb-4">
                        Đăng Nhập
                    </Typography>
                    <Typography
                        variant="paragraph"
                        color="blue-gray"
                        className="text-lg font-normal"
                    >
                        Nhập mã và mật khẩu để đăng nhập.
                    </Typography>
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg"
                >
                    <div className="mb-1 flex flex-col gap-6">
                        <Typography
                            variant="small"
                            color="blue-gray"
                            className="-mb-3 font-medium"
                        >
                            Email của bạn
                        </Typography>
                        <Input
                            size="lg"
                            placeholder="ten@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={{
                                className:
                                    "before:content-none after:content-none",
                            }}
                        />
                        <Typography
                            variant="small"
                            color="blue-gray"
                            className="-mb-3 font-medium"
                        >
                            Mật khẩu
                        </Typography>
                        <Input
                            type="password"
                            size="lg"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={{
                                className:
                                    "before:content-none after:content-none",
                            }}
                        />
                    </div>
                    <Button
                        type="submit"
                        className="mt-6"
                        fullWidth
                        disabled={isLoading}
                    >
                        {isLoading ? "Đang đăng nhập..." : "Đăng Nhập"}
                    </Button>
                </form>
            </Card>
        </section>
    );
}

export default SignIn;
