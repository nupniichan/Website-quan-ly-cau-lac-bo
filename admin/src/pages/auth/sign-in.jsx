import { useState, useEffect } from "react";
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export function SignIn() {
  const [email, setEmail] = useState("");  // Đổi thành email
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
      const response = await axios.post("http://4.242.20.80:5500/api/login", {
        email,
        password,
      });
      if (response.status === 200 && response.data.token) {
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("token", response.data.token);

        // Decode the JWT token to get the userId
        const decodedToken = JSON.parse(atob(response.data.token.split('.')[1]));
        const userId = decodedToken.userId;

        if (userId) {
          localStorage.setItem("userId", userId);

          // Fetch managed clubs only if userId is available
          try {
            const clubsResponse = await axios.get(`http://4.242.20.80:5500/api/get-managed-clubs/${userId}`);
            localStorage.setItem("managedClubs", JSON.stringify(clubsResponse.data));
          } catch (clubError) {
            console.error("Error fetching managed clubs:", clubError);
          }

          // Redirect to the specified URL after successful login
          navigate(redirectUrl);
        } else {
          console.error("Decoded token doesn't contain userId:", decodedToken);
        }
      } else {
        console.error("Login response doesn't contain token:", response.data);
      }
    } catch (error) {
      console.error("Đăng nhập thất bại:", error);
      alert("Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Đăng Nhập</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
            Nhập email và mật khẩu để đăng nhập.
          </Typography>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Email của bạn
            </Typography>
            <Input
              size="lg"
              placeholder="ten@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
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
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <Button type="submit" className="mt-6" fullWidth disabled={isLoading}>
            {isLoading ? "Đang đăng nhập..." : "Đăng Nhập"}
          </Button>
          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Chưa có tài khoản?
            <Link to="/auth/sign-up" className="text-gray-900 ml-1">Tạo tài khoản</Link>
          </Typography>
        </form>
      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>
    </section>
  );
}

export default SignIn;
