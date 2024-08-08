import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";
import InternetChecker from "./Component/Internet Checker/Internet Checker";
import ScrollToTop from "./ScrollToTop";
import Dashboard from "./Component/Pages/Dashboard/Dashboard";
import Bill from "./Component/Pages/Bill/Bill";
import Profile from "./Component/Pages/Profile/Profile";
import SidebarComp from "./Component/SidebarComp/SidebarComp";
import Navbar from "./Component/Navbar/Navbar";
import Login from "./Component/Login_verification/login/Login";
import Verification from "./Component/Login_verification/verification/Verification";
import Lab_Report from "./Component/Pages/Lab_Report/Lab_Report";
import SignUp from "./Component/SignUp/SignUp/SignUp";
import ForgotPasswordFlow from "./Component/Login_verification/login/ForgotPassword/ForgotPassword";
import Signup_Verification from "./Component/Signup otp verification/Verification";

const MainLayout = ({ children, handleLogout }) => {
  const location = useLocation();
  const { pathname } = location;

  // Define the paths where Navbar and Sidebar should not be displayed
  const hideNavAndSidebar = ["/", "/verification", "/signup", "/signup_verification"];
  const hideSidebar = ["/profile", "/signup"];

  return (
    <>
      {/* Render Navbar only if the current path is not in hideNavAndSidebar */}
      {!hideNavAndSidebar.includes(pathname) && <Navbar onLogout={handleLogout} />}
      
      {/* Render SidebarComp only if the current path is not in hideNavAndSidebar and not in hideSidebar */}
      {!hideNavAndSidebar.includes(pathname) && !hideSidebar.includes(pathname) && <SidebarComp />}
      
      {children}
    </>
  );
};

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isVendorLoggedIn");
    const encryptedToken = localStorage.getItem("encryptedTokenForVendorOfHanaiHealth");

    if (isLoggedIn === "true" && encryptedToken) {
      setLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    // Optionally clear tokens or perform other cleanup here
  };

  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <MainLayout handleLogout={handleLogout}>
          <ScrollToTop />
          {isOffline && <InternetChecker />}
          <Routes>
            {/* Redirect logged-in users from these routes */}
            {loggedIn && (
              <>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/verification" element={<Navigate to="/dashboard" />} />
                <Route path="/signup_verification" element={<Navigate to="/dashboard" />} />
                <Route path="/signup" element={<Navigate to="/dashboard" />} />
                <Route path="/forgot_password" element={<Navigate to="/dashboard" />} />
              </>
            )}

            {/* Regular routes */}
            <Route
              path="/profile"
              element={loggedIn ? <Profile onLogout={handleLogout} /> : <Navigate to="/" />}
            />
            <Route
              path="/dashboard"
              element={loggedIn ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/" />}
            />
            <Route
              path="/Lab_Report"
              element={loggedIn ? <Lab_Report onLogout={handleLogout} /> : <Navigate to="/" />}
            />
            <Route
              path="/bill"
              element={loggedIn ? <Bill onLogout={handleLogout} /> : <Navigate to="/" />}
            />
            <Route path="/" element={<Login onLogin={handleLogin} onLogout={handleLogout} />} />
            <Route path="/verification" element={<Verification onLogin={handleLogin} />} />
            <Route path="/signup_verification" element={<Signup_Verification onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignUp onLogin={handleLogin} onLogout={handleLogout} />} />
            <Route path="/forgot_password" element={<ForgotPasswordFlow onLogin={handleLogin} onLogout={handleLogout} />} />

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </MainLayout>
      </div>
    </Router>
  );
}

export default App;
