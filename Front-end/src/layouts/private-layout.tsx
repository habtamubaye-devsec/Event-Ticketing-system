import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import { getCurrentUser } from "../api-services/users-service";
import { message } from "antd";
import { NavExtensionProvider } from "./nav-extension-context";

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

  if (!showContent || !user) {
    return null;
  }

  if (user.isAdmin) {
    return (
      <NavExtensionProvider>
        <div className="min-h-screen lg:flex">
          <div className="lg:w-72 lg:flex-none">
            <Sidebar user={user} />
          </div>
          <main className="flex-1 min-h-screen overflow-y-auto px-4 py-6 lg:px-8 lg:py-10 q-animate-in scroll">
            {children}
          </main>
        </div>
      </NavExtensionProvider>
    );
  }

  return (
    <NavExtensionProvider>
      <div className="min-h-screen flex flex-col">
        <Sidebar user={user} />
        <main className="flex-1 overflow-y-auto px-4 py-6 lg:px-8 lg:py-10 q-animate-in scroll">
          {children}
        </main>
      </div>
    </NavExtensionProvider>
  );
}

export default PrivateLayout;
