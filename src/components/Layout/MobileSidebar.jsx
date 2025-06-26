import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Search,
  Bell,
  Mail,
  User,
  Menu,
  X,
  LogOut,
  Moon,
  Sun,
  Twitter,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, userProfile, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
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
      name: "Profile",
      icon: User,
      path: `/profile/${userProfile?.username}`,
      active: location.pathname.includes("/profile"),
    },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-dark-bg border-b border-gray-200 dark:border-dark-border px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-bg-secondary transition-colors"
          >
            <Menu className="h-6 w-6 text-gray-700 dark:text-dark-text" />
          </button>
          <Link to="/" className="flex items-center">
            <Twitter className="h-8 w-8 text-twitter-blue" />
          </Link>
          <div className="w-10"></div> {/* Spacer */}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-dark-bg border-t border-gray-200 dark:border-dark-border">
        <div className="flex justify-around py-2">
          {menuItems.slice(0, 4).map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                item.active
                  ? "text-twitter-blue"
                  : "text-gray-500 dark:text-dark-text-secondary"
              }`}
            >
              <item.icon className="h-6 w-6" />
            </Link>
          ))}
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out Menu */}
      <div
        className={`lg:hidden fixed top-0 left-0 z-50 h-full w-80 bg-white dark:bg-dark-bg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <Twitter className="h-8 w-8 text-twitter-blue" />
              <span className="text-xl font-bold text-gray-900 dark:text-dark-text">
                Twitter
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-bg-secondary transition-colors"
            >
              <X className="h-6 w-6 text-gray-700 dark:text-dark-text" />
            </button>
          </div>

          {/* User Profile */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-twitter-blue rounded-full flex items-center justify-center">
                {userProfile.avatarUrl ? (
                  <img
                    src={userProfile.avatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-white font-semibold text-lg">
                    {userProfile?.displayName?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-dark-text">
                  {userProfile?.displayName || "User"}
                </p>
                <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
                  @{userProfile?.username || "username"}
                </p>
              </div>
            </div>
            <div className="flex space-x-4 text-sm">
              <span className="text-gray-500 dark:text-dark-text-secondary">
                <span className="font-semibold text-gray-900 dark:text-dark-text">
                  {userProfile?.followingCount || 0}
                </span>{" "}
                Following
              </span>
              <span className="text-gray-500 dark:text-dark-text-secondary">
                <span className="font-semibold text-gray-900 dark:text-dark-text">
                  {userProfile?.followersCount || 0}
                </span>{" "}
                Followers
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-4 p-3 rounded-full text-xl transition-colors ${
                  item.active
                    ? "bg-twitter-blue text-white"
                    : "text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-bg-secondary"
                }`}
              >
                <item.icon className="h-6 w-6" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Theme Toggle & Logout */}
          <div className="border-t border-gray-200 dark:border-dark-border pt-4 space-y-2">
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-4 p-3 rounded-full text-xl text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-bg-secondary transition-colors w-full"
            >
              {isDark ? (
                <Sun className="h-6 w-6" />
              ) : (
                <Moon className="h-6 w-6" />
              )}
              <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
            </button>

            <button
              onClick={() => {
                setShowLogoutConfirm(true);
              }}
              className="flex items-center space-x-4 p-3 rounded-full text-xl text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-bg-secondary transition-colors w-full"
            >
              <LogOut className="h-6 w-6" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </div>
      {showLogoutConfirm && (
        <div className=" lg:hidden fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 w-full">
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

export default MobileSidebar;
