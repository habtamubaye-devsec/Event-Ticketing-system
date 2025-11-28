import { BookCheck, CandlestickChart, Home, List, LogOut, User, UserRound } from 'lucide-react'
import type { UserType } from '../../interface';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { message } from 'antd';

function MenuItems( {user} : {user : UserType}) {  

    const iconSize = 18;
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;

    const userMenu = [
        {
            name: "Home",
            path: "/",
            icon: <Home 
                size={iconSize}/>,
            isActive: currentPath === "/",
        },
        {
            name: "Profile",
            path: "/profile",
            icon: <User 
                size={iconSize}/>,
            isActive: currentPath === "/profile",
        },
        {
            name: "Bookings",
            path: "/bookings",
            icon: <List
                size={iconSize}/>,
            isActive: currentPath === "/bookings",
        },
        {
            name: "Reports",
            path: "/reports",
            icon: <CandlestickChart
                size={iconSize}/>,
            isActive: currentPath === "/reports",
        },
        {
            name: "Logout",
            path: "/logout",
            icon: <LogOut
                size={iconSize}/>,
        },
    ];

    const adminMenu = [
        {
            name: "Home",
            path: "/",
            icon: <Home
                size={iconSize}/>,
            isActive: currentPath === "/",
        },
        {
            name: "Events",
            path: "/admin/events",
            icon: <List
                size={iconSize}/>,
            isActive: currentPath.includes("/admin/events"),
        },
        {
            name: "Bookings",
            path: "/admin/bookings",
            icon: <BookCheck
                size={iconSize}/>,
            isActive: currentPath.includes("/admin/bookings"),
        },
        {
            name: "Users",
            path: "/admin/users",
            icon: <UserRound
                size={iconSize}/>,
            isActive: currentPath.includes("/admin/users"),
        },
        {
            name: "Reports",
            path: "/admin/reports",
            icon: <CandlestickChart
                size={iconSize}/>,
            isActive: currentPath.includes("/admin/reports"),
        },
          {
            name: "Logout",
            path: "/admin/logout",
            icon: <LogOut
                size={iconSize}/>
        },
    ]

    const onLogout = () => {
        Cookies.remove("token");
        navigate("/login");
        message.success("Logged out successfully");
    }

    const menuToRender = user.isAdmin ? adminMenu : userMenu;
  return (
    <div className='lg:bg-gray-200 h-full p-5 w-full'>
        <div className='flex flex-col gap-1 mt-10'>
            <h1 className='text-2xl font-bold text-red-600 '>Shey <b className='text-black font-bold'>Events</b></h1>
            <span className='text-sm text-gray-600'>{user.name}</span>
        </div>

        <div className='flex flex-col gap-10 mt-20'>
            {menuToRender.map((item:any) => (
                <div className={`cursor-pointer px-5 py-3 rounded flex gap-5 text-sm items-center  
                    ${item.isActive ? 'bg-red-600 text-white': ''}`}
                    key={item.name}
                    onClick={() => {
                        if (item.name === "Logout"){
                            onLogout();
                        }else{
                            navigate(item.path)
                        }
                    }}>
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                </div>
            ))}
        </div>
    </div>
  )
}

export default MenuItems