import {
    BookCheck,
    CandlestickChart,
    Home,
    List,
    LogOut,
    Moon,
    Sun,
    User,
    UserRound,
} from "lucide-react";
import type { UserType } from '../../interface';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { message } from 'antd';
import { useTheme } from '../../theme/theme-context';

type MenuItem = {
    name: string;
    path: string;
    icon: JSX.Element;
    isActive?: boolean;
};

function MenuItems( {user} : {user : UserType}) {  

    const iconSize = 18;
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;
    const { isDark, toggleTheme } = useTheme();

    const userMenu: MenuItem[] = [
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

    const adminMenu: MenuItem[] = [
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
        <div
            className="h-full w-full p-4 lg:p-5"
            style={{ background: "var(--surface)", borderRight: "1px solid var(--border)" }}
        >
            <div className="mt-6 flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                    <h1 className="text-lg font-extrabold tracking-tight" style={{ color: "var(--text)" }}>
                        Qetero
                        <span
                            className="ml-2 align-middle text-xs font-bold"
                            style={{
                                color: "white",
                                background: "linear-gradient(135deg, var(--primary), var(--primary-2))",
                                padding: "4px 10px",
                                borderRadius: 999,
                            }}
                        >
                            EVENTS
                        </span>
                    </h1>
                    <span className="text-sm" style={{ color: "var(--muted)" }}>
                        {user.name}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={toggleTheme}
                    className="q-focus-ring inline-flex h-10 w-10 items-center justify-center rounded-xl border transition"
                    style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--muted)" }}
                    aria-label="Toggle theme"
                    title="Toggle theme"
                >
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
            </div>

            <div className="mt-10 flex flex-col gap-2">
                {menuToRender.map((item) => (
                    <div
                        className="group flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition q-focus-ring"
                        key={item.name}
                        onClick={() => {
                            if (item.name === "Logout") {
                                onLogout();
                            } else {
                                navigate(item.path);
                            }
                        }}
                        style={
                            item.isActive
                                ? {
                                        background: "linear-gradient(135deg, rgba(99,102,241,0.18), rgba(139,92,246,0.14))",
                                        border: "1px solid var(--border)",
                                        color: "var(--text)",
                                        transform: "translateY(-1px)",
                                    }
                                : {
                                        background: "transparent",
                                        color: "var(--muted)",
                                    }
                        }
                    >
                        <span
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border transition"
                            style={{
                                borderColor: "var(--border)",
                                background: item.isActive ? "var(--surface)" : "var(--surface-2)",
                                color: item.isActive ? "var(--primary)" : "var(--muted)",
                            }}
                        >
                            {item.icon}
                        </span>
                        <span className="flex-1">{item.name}</span>
                        <span
                            className="h-2 w-2 rounded-full opacity-0 transition group-hover:opacity-100"
                            style={{ background: "var(--primary)" }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MenuItems