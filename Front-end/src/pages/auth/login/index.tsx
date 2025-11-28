import { Link, useNavigate } from "react-router-dom";
import WelcomeContent from "../common"
import { Button, Form, Input, message  } from 'antd'
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
    <div className='grid grid-cols-1 lg:grid-cols-2'>
      <WelcomeContent />

      <div className="h-screen w-full flex items-center justify-center">
        <Form className="flex flex-col gap-5 w-96 " layout="vertical" onFinish={onFinish}>
          <h1 className="text-2xl text-gray-600 font-bold">Login Your Account</h1>

          <Form.Item name="email" required label="Email"
          rules={[{ required: true }]}> 
            <Input  placeholder="Email"/>
          </Form.Item>

          <Form.Item name="password" required label="Password"
          rules={[{ required: true }]}> 
            <Input.Password  placeholder="Password"/>
          </Form.Item> 

          <Button type="primary" htmlType="submit" block
          loading={loading} >
            Login
          </Button>

          <Link  to="/register">Don't have an Account? Register</Link>
        </Form>
      </div>
    </div>
  );
}

export default Login