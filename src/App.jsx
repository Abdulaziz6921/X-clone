import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

import Auth from "./pages/Auth";
import TweetDetail from "./components/Tweet/TweetDetail";

import { UserCacheProvider } from "./contexts/UserCacheContext";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserCacheProvider>
          {" "}
          <Router>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Home />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/explore"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Explore />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/:username"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Profile />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tweet/:tweetId"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <TweetDetail />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <div className="p-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-4">
                          Notifications
                        </h2>
                        <p className="text-gray-500 dark:text-dark-text-secondary">
                          This feature is coming soon!
                        </p>
                      </div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <div className="p-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-4">
                          Messages
                        </h2>
                        <p className="text-gray-500 dark:text-dark-text-secondary">
                          This feature is coming soon!
                        </p>
                      </div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bookmarks"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <div className="p-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-4">
                          Bookmarks
                        </h2>
                        <p className="text-gray-500 dark:text-dark-text-secondary">
                          This feature is coming soon!
                        </p>
                      </div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Settings />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </UserCacheProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
