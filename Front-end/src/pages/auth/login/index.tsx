import { Link, useNavigate } from "react-router-dom";
import WelcomeContent from "../common";
import { Button, Form, Input, message } from "antd";
import { useState } from "react";
import { loginUser } from "../../../api-services/users-service";
import Cookies from "js-cookie";

function Login() {
  const [ loading, setloading] = useState(false);
  const navigate = useNavigate();
  const onFinish = async(values: any) => {
    try {
      setloading(true) ;
      const response = await loginUser(values);
      message.success(response.message);
      Cookies.set("token", response.token);
      navigate("/");
    } catch (error: any) {
      message.error(error.response?.data.message || error.message);
    } finally{
      setloading(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <WelcomeContent />

      <div className="flex w-full items-center justify-center px-4 py-10">
        <div className="w-full max-w-md q-card p-6 sm:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "var(--text)" }}>
              Welcome back
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              Login to continue booking events on Qetero.
            </p>
          </div>

          <Form className="flex flex-col gap-4" layout="vertical" onFinish={onFinish}>
            <Form.Item name="email" required label="Email" rules={[{ required: true }]}>
              <Input placeholder="you@example.com" />
            </Form.Item>

            <Form.Item name="password" required label="Password" rules={[{ required: true }]}>
              <Input.Password placeholder="Your password" />
            </Form.Item>

            <Button type="primary" htmlType="submit" block loading={loading}>
              Login
            </Button>

            <div className="text-sm" style={{ color: "var(--muted)" }}>
              Don&apos;t have an account?{" "}
              <Link to="/register" className="font-semibold" style={{ color: "var(--primary)" }}>
                Register
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login