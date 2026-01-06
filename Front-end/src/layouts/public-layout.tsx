import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function PublicLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      navigate("/");
    }else{
        setShowContent(true)
    }
  }, []);

  return showContent && <div className="q-animate-in">{children}</div>;
}

export default PublicLayout;
