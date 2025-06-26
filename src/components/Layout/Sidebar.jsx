import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Search,
  Bell,
  Mail,
  Bookmark,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
  Twitter,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useState } from "react";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  console.log(userProfile?.avatarUrl);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const menuItems = [
    { name: "Home", icon: Home, path: "/", active: location.pathname === "/" },
    {
      name: "Explore",
      icon: Search,
      path: "/explore",
      active: location.pathname === "/explore",
    },
    {
      name: "Notifications",
      icon: Bell,
      path: "/notifications",
      active: location.pathname === "/notifications",
    },
    {
      name: "Messages",
      icon: Mail,
      path: "/messages",
      active: location.pathname === "/messages",
    },
    {
      name: "Bookmarks",
      icon: Bookmark,
      path: "/bookmarks",
      active: location.pathname === "/bookmarks",
    },
    {
      name: "Profile",
      icon: User,
      path: `/profile/${userProfile?.username}`,
      active: location.pathname.includes("/profile"),
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/settings",
      active: location.pathname === "/settings",
    },
  ];

  return (
    <>
      <div className="w-64 h-screen sticky top-0 p-4 border-r border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="mb-8">
            <Link
              to="/"
              className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-bg-secondary transition-colors"
            >
              <Twitter className="h-8 w-8 text-twitter-blue" />
              <span className="text-xl font-bold text-gray-900 dark:text-dark-text">
                Twitter
              </span>
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-4 p-3 rounded-full text-xl transition-colors ${
                  item.active
                    ? "bg-twitter-blue text-white"
                    : "text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-bg-secondary"
                }`}
              >
                <item.icon className="h-6 w-6" />
                <span className="hidden lg:inline">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Theme Toggle */}
          <div className="mb-4">
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-4 p-3 rounded-full text-xl text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-bg-secondary transition-colors w-full"
            >
              {isDark ? (
                <Sun className="h-6 w-6" />
              ) : (
                <Moon className="h-6 w-6" />
              )}
              <span className="hidden lg:inline">
                {isDark ? "Light Mode" : "Dark Mode"}
              </span>
            </button>
          </div>

          {/* User Profile */}
          <div className="border-t border-gray-200 dark:border-dark-border pt-4">
            <div className="flex items-center justify-between p-3 rounded-full hover:bg-gray-100 dark:hover:bg-dark-bg-secondary transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-twitter-blue">
                  {userProfile?.avatarUrl ? (
                    <img
                      src={userProfile.avatarUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-semibold">
                      {userProfile?.displayName?.charAt(0)?.toUpperCase() ||
                        "U"}
                    </span>
                  )}
                </div>
                <div className="hidden lg:block">
                  <p className="font-semibold text-gray-900 dark:text-dark-text">
                    {userProfile?.displayName || "User"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
                    @{userProfile?.username || "username"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-bg-tertiary transition-colors"
              >
                <LogOut className="h-5 w-5 text-gray-500 dark:text-dark-text-secondary" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white dark:bg-dark-bg p-6 rounded-2xl shadow-2xl w-[90%] max-w-md animate-fade-in-up border dark:border-dark-border">
            <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text mb-3">
              Log out of Twitter?
            </h2>
            <p className="text-sm text-gray-600 dark:text-dark-text-secondary mb-6">
              You can always log back in at any time. Are you sure you want to
              log out?
            </p>

            <div className="space-y-3">
              <button
                onClick={async () => {
                  setShowLogoutConfirm(false);
                  await handleLogout();
                }}
                className="w-full py-3 text-white bg-red-500 hover:bg-red-600 transition-colors font-semibold rounded-full"
              >
                Log Out
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full py-3 bg-gray-100 dark:bg-dark-bg-secondary hover:bg-gray-200 dark:hover:bg-dark-bg-tertiary text-gray-900 dark:text-dark-text transition-colors font-semibold rounded-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
