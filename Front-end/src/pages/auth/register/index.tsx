import { Link, useNavigate } from "react-router-dom";
import WelcomeContent from "../common"
import { Button, Form, Input, message } from 'antd'
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
    <div className='grid grid-cols-1 lg:grid-cols-2'>
      <WelcomeContent />

      <div className="h-screen w-full flex items-center justify-center">
        <Form className="flex flex-col gap-5 w-96 " layout="vertical" onFinish={onFinish}>
          <h1 className="text-2xl text-gray-600 font-bold">Register Your Account</h1>
          <Form.Item name="name" required label="Name"
          rules={[{ required: true }]}>  
            <Input  placeholder="Name"/>
          </Form.Item>

          <Form.Item name="email"  label="Email"
          rules={[{ required: true }]}> 
            <Input  placeholder="Email"/>
          </Form.Item>

          <Form.Item name="password" required label="Password"
          rules={[{ required: true }]}> 
            <Input.Password  placeholder="Password"/>
          </Form.Item> 

          <Button type="primary" htmlType="submit" block >
            Register
          </Button>

          <Link  to="/login">Already have an account? Login</Link>
        </Form>
      </div>
    </div>
  );
}

export default Register