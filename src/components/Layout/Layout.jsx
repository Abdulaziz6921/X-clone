import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg">
      {/* Mobile Sidebar */}
      <MobileSidebar />

      {/* Desktop Layout */}
      <div className="flex">
        <div className="flex min-w-[85%] justify-center mx-auto g-red-600">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1 lg:max-w-2xl border-r border-gray-200 dark:border-dark-border">
            <main className="pt-16 lg:pt-0 pb-16 lg:pb-0">{children}</main>
          </div>

          {/* Right Sidebar - Trends */}
          <div className="hidden xl:block w-80 p-4">
            <div className="sticky top-4">
              <div className="bg-gray-50 dark:bg-dark-bg-secondary rounded-2xl p-4 mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text mb-3">
                  What's happening
                </h3>
                <div className="space-y-3">
                  {["Technology", "Sports", "Politics", "Entertainment"].map(
                    (trend, index) => (
                      <div
                        key={trend}
                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary p-2 rounded-lg transition-colors"
                      >
                        <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
                          Trending in United States
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-dark-text">
                          {trend}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
                          {Math.floor(Math.random() * 100)}K Tweets
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
