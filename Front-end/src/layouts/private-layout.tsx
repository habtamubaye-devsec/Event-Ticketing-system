import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import { getCurrentUser } from "../api-services/users-service";
import { message } from "antd";

function PrivateLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  const getData = async () => {
    try {
      const response = await getCurrentUser();
      setUser(response.data);
    } catch (error:any) {
      message.error(error.response.data.message || error.message);
      console.log(error.response.data.message || error.message);
    }
  }

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/login");
    } else {      
      getData();
      setShowContent(true);
    }
  }, []); 

  return (
    showContent && user && (
      <div className="flex lg:flex-row flex-col gap-5 h-screen lg:mr-5">
        <Sidebar user={user}/>
        <div className="flex-1 px-2 mx-3 lg:mt-15 pb-10">{children}</div>
      </div>
    )
  );
}

export default PrivateLayout;
