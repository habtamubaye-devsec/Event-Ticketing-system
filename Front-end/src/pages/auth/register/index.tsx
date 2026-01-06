import { Link, useNavigate } from "react-router-dom";
import WelcomeContent from "../common";
import { Button, Form, Input, message } from "antd";
import { registerUser } from "../../../api-services/users-service";

function Register() {

  const navigate = useNavigate();

  const onFinish = async(values: any) => {
    try {
      const response = await registerUser(values) 
      message.success(response.message);
      navigate("/login")
    } catch (error:any) {
      message.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <WelcomeContent />

      <div className="flex w-full items-center justify-center px-4 py-10">
        <div className="w-full max-w-md q-card p-6 sm:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "var(--text)" }}>
              Create your account
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              Register to discover events and book tickets.
            </p>
          </div>

          <Form className="flex flex-col gap-4" layout="vertical" onFinish={onFinish}>
            <Form.Item name="name" required label="Name" rules={[{ required: true }]}>
              <Input placeholder="Your name" />
            </Form.Item>

            <Form.Item name="email" label="Email" rules={[{ required: true }]}>
              <Input placeholder="you@example.com" />
            </Form.Item>

            <Form.Item name="password" required label="Password" rules={[{ required: true }]}>
              <Input.Password placeholder="Create a password" />
            </Form.Item>

            <Button type="primary" htmlType="submit" block>
              Register
            </Button>

            <div className="text-sm" style={{ color: "var(--muted)" }}>
              Already have an account?{" "}
              <Link to="/login" className="font-semibold" style={{ color: "var(--primary)" }}>
                Login
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Register