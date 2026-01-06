import { cloneElement, useEffect, useMemo, useRef, useState } from 'react'
import MenuItems from './menu-items'
import type { UserType } from '../../interface'
import { BarChart3, BookOpenCheck, Home, LogOut, Menu, Moon, Sun, User } from 'lucide-react'
import { Drawer, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useTheme } from '../../theme/theme-context';
import PageSearch from '../../components/PageSearch';
import { useNavExtension } from '../nav-extension-context';

function Sidebar({user} : {user:UserType}) {
  const [showMoblieMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const { homeSearchConfig } = useNavExtension();

  type NavLink = { name: string; path: string; icon: JSX.Element };

  const normalizedPath = useMemo(() => {
    if (location.pathname === "/") return "/";
    if (location.pathname.startsWith("/home") || location.pathname.startsWith("/events")) {
      return "/";
    }
    return location.pathname;
  }, [location.pathname]);
  const isHomePage = normalizedPath === "/";
  const navLinks: NavLink[] = [
    { name: "Home", path: "/", icon: <Home size={18} /> },
    { name: "Bookings", path: "/bookings", icon: <BookOpenCheck size={18} />},
    { name: "Reports", path: "/reports", icon: <BarChart3 size={18} /> },
    { name: "Profile", path: "/profile", icon: <User size={18} /> },
  ];

  const [currentView, setCurrentView] = useState(navLinks[0].name);
  const [showBottomNav, setShowBottomNav] = useState(true);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const activeLink = navLinks.find((link) => link.path === normalizedPath);
    setCurrentView(activeLink?.name ?? "Discover");
  }, [normalizedPath, navLinks]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBottomNav(false);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      scrollTimeout.current = setTimeout(() => {
        setShowBottomNav(true);
      }, 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);


  const handleNav = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    message.success("Logged out successfully");
    navigate("/login");
  };

  const renderNavLink = (link: NavLink) => {
    const isActive = normalizedPath === link.path;
    return (
      <button
        key={link.name}
        onClick={() => handleNav(link.path)}
        className={`relative flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold tracking-wide transition-colors duration-200 ${isActive ? "text-[var(--text)]" : "text-[var(--muted)] hover:text-[var(--text)]"}`}
        aria-current={isActive ? "page" : undefined}
      >
        {link.icon}
        <span>{link.name}</span>
        <span
          className={`absolute bottom-1 left-1/2 h-[2px] w-10 -translate-x-1/2 rounded-full bg-[var(--primary)] transition-all duration-300 ${isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`}
        />
      </button>
    );
  };

  if (!user.isAdmin) {
    return (
      <div className="w-full">
        <div className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--surface)] shadow-sm">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-lg font-black text-[var(--text)]">Qetero</p>
                <p className="text-[var(--muted)] text-xs uppercase tracking-[0.5em]">Events</p>
              </div>
            </div>
            <div className="hidden flex-1 items-center justify-center gap-6 md:flex">
              <nav className="flex items-center gap-6">
                {navLinks.map(renderNavLink)}
              </nav>
              {isHomePage && homeSearchConfig ? (
                <div className="flex-shrink-0 md:w-[280px]">
                  <PageSearch {...homeSearchConfig} />
                </div>
              ) : null}
            </div>
            <div className="flex items-center gap-3">
              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)] transition hover:text-[var(--text)]"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
                <span className="sr-only">Toggle theme</span>
              </button>
              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)] transition hover:text-[var(--text)]"
                onClick={handleLogout}
                aria-label="Logout"
              >
                <LogOut size={18} />
                <span className="sr-only">Logout</span>
              </button>
            </div>
          </div>
          <div className="hidden border-t border-[var(--border)] px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[var(--primary)] md:block">
            Now viewing: {currentView}
          </div>
        </div>
        <div
          className={`fixed bottom-0 inset-x-0 z-40 md:hidden flex justify-center transition-all duration-500 ${showBottomNav ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="flex w-full max-w-full flex-col gap-3 rounded-t-3xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.3em] shadow-lg">
            <div className="flex h-12 gap-2">
              {navLinks.map((link) => {
                const isActive = normalizedPath === link.path;
                const textColorClass = isActive ? "text-[var(--primary)]" : "text-[var(--muted)] hover:text-[var(--text)]";
                const iconColor = isActive ? "var(--primary)" : "var(--muted)";
                const textStyle = isActive
                  ? { fontWeight: 800, textShadow: "0 4px 8px rgba(15,23,42,0.25)" }
                  : { fontWeight: 600 };
                const iconStyle = isActive
                  ? { filter: "drop-shadow(0 4px 10px rgba(15,23,42,0.2))" }
                  : undefined;
                return (
                  <button
                    key={link.name}
                    onClick={() => handleNav(link.path)}
                    className={`flex-1 px-2 text-[0.65rem] font-semibold tracking-[0.25em] rounded-xl transition duration-200 bg-transparent ${textColorClass}`}
                  >
                    <div className='flex flex-col items-center gap-1'>
                      {cloneElement(link.icon, { color: iconColor, style: iconStyle })}
                      <span style={textStyle}>{link.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:h-full lg:fixed lg:overflow-y-auto">
      <div className="lg:flex hidden">
        <div className="h-full lg:w-72 lg:flex-none">
          <div className="lg:sticky lg:top-0 lg:h-screen">
            <MenuItems user = {user}/>
          </div>
        </div>
      </div>

      <div
        className='lg:hidden flex items-center gap-3 px-4 py-3 sticky top-0 z-50'
        style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
      >
        <button
          type="button"
          onClick={ () => setShowMobileMenu(!showMoblieMenu)}
          className="q-focus-ring inline-flex h-10 w-10 items-center justify-center rounded-xl border"
          style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--muted)' }}
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
        <h1 className='text-base font-extrabold tracking-tight' style={{ color: 'var(--text)' }}>
          Qetero <span className='q-muted font-semibold'>Dashboard</span>
        </h1>
       </div>

       {showMoblieMenu &&  (
        <Drawer
        open={showMoblieMenu}
        placement='left'
        onClose={ () => setShowMobileMenu(false)}>
          <MenuItems user = {user}/>
        </Drawer>
       )}
    </div>
  )
}

export default Sidebar