/* ----------------------------------------------------------------------------*/
/*   ( The Authentic JS/JAVA/PYTHON CodeBuff )
 ___ _                      _              _ 
 | _ ) |_  __ _ _ _ __ _ __| |_ __ ____ _ (_)
 | _ \ ' \/ _` | '_/ _` / _` \ V  V / _` || |
 |___/_||_\__,_|_| \__,_\__,_|\_/\_/\__,_|/ |
                                        |__/ 
 */
/* --------------------------------------------------------------------------*/

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Groups from "./pages/Groups";
import AddExpense from "./pages/AddExpense";
import Summary from "./pages/Summary";
import AddMembers from "./pages/AddMembers";

// Aurora Loader Component (teal -> blue -> violet, matches the Profile page)
function Loader() {
  return (
    <div className="loader-overlay">
      <div className="loader-card">
        <div className="loader-spinner">
          <div className="loader-ring" />
          <div className="loader-ring-soft" />
          <div className="loader-core" />
        </div>

        <h2 className="loader-text">Wohoo! Wait...</h2>

        <div className="loader-dots">
          <span />
          <span />
          <span />
        </div>

        <div className="loader-bar">
          <div className="loader-bar-fill" />
        </div>
      </div>

      <style>{`
        .loader-overlay {
          position: fixed;
          inset: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #F8FAFC;
          overflow: hidden;
          z-index: 9999;
          animation: loaderFadeIn 0.25s ease-out;
        }

        /* Soft aurora glows in the corners */
        .loader-overlay::before,
        .loader-overlay::after {
          content: "";
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        .loader-overlay::before {
          top: -160px;
          left: -120px;
          width: 520px;
          height: 520px;
          background: radial-gradient(circle, rgba(20, 184, 166, 0.22), transparent 65%);
        }
        .loader-overlay::after {
          bottom: -180px;
          right: -140px;
          width: 560px;
          height: 560px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.20), transparent 65%);
        }

        .loader-card {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 44px 56px;
          border-radius: 32px;
          background-color: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 40px 80px -32px rgba(59, 130, 246, 0.45),
                      0 2px 8px rgba(15, 23, 42, 0.04);
        }

        .loader-spinner {
          position: relative;
          width: 96px;
          height: 96px;
          margin-bottom: 26px;
        }

        /* Rainbow conic ring, hollowed out with a mask */
        .loader-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: conic-gradient(
            from 0deg,
            #14B8A6, #3B82F6, #8B5CF6, #F43F5E, #F59E0B, #14B8A6
          );
          -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 7px), #000 calc(100% - 6px));
                  mask: radial-gradient(farthest-side, transparent calc(100% - 7px), #000 calc(100% - 6px));
          animation: loaderSpin 1.6s linear infinite;
        }

        /* Faint counter-rotating inner ring */
        .loader-ring-soft {
          position: absolute;
          inset: 14px;
          border-radius: 50%;
          border: 3px solid rgba(20, 184, 166, 0.18);
          border-top-color: #14B8A6;
          border-right-color: #3B82F6;
          animation: loaderSpin 1.1s linear infinite reverse;
        }

        .loader-core {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 22px;
          height: 22px;
          margin: -11px 0 0 -11px;
          border-radius: 50%;
          background: linear-gradient(135deg, #14B8A6 0%, #3B82F6 50%, #8B5CF6 100%);
          box-shadow: 0 0 18px rgba(59, 130, 246, 0.5);
          animation: loaderPulse 1.2s ease-in-out infinite;
        }

        .loader-text {
          margin: 0 0 14px;
          font-family: "Arial", sans-serif;
          font-weight: 800;
          font-size: 1.5rem;
          letter-spacing: -0.5px;
          background: linear-gradient(90deg, #14B8A6, #3B82F6, #8B5CF6, #3B82F6, #14B8A6);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: loaderShimmer 2.5s linear infinite;
        }

        .loader-dots {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
        }
        .loader-dots span {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          animation: loaderBounce 1s ease-in-out infinite;
        }
        .loader-dots span:nth-child(1) { background: #14B8A6; }
        .loader-dots span:nth-child(2) { background: #3B82F6; animation-delay: 0.15s; }
        .loader-dots span:nth-child(3) { background: #8B5CF6; animation-delay: 0.3s; }

        .loader-bar {
          width: 170px;
          height: 4px;
          border-radius: 4px;
          background: rgba(100, 116, 139, 0.15);
          overflow: hidden;
        }
        .loader-bar-fill {
          width: 45%;
          height: 100%;
          border-radius: 4px;
          background: linear-gradient(90deg, #14B8A6, #3B82F6, #8B5CF6);
          animation: loaderSlide 1.2s ease-in-out infinite;
        }

        @keyframes loaderSpin { to { transform: rotate(360deg); } }
        @keyframes loaderPulse {
          0%, 100% { transform: scale(0.75); opacity: 0.75; }
          50% { transform: scale(1.2); opacity: 1; }
        }
        @keyframes loaderShimmer { to { background-position: -200% center; } }
        @keyframes loaderBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-8px); opacity: 1; }
        }
        @keyframes loaderSlide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(260%); }
        }
        @keyframes loaderFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .loader-ring,
          .loader-ring-soft,
          .loader-core,
          .loader-text,
          .loader-dots span,
          .loader-bar-fill { animation: none; }
        }
      `}</style>
    </div>
  );
}

// Wrap routes to handle loader on route change
function AppRoutes() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 700); // visible ~0.7s
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      {loading && <Loader />}
      <Routes>
        <Route path="/" element={<Navigate to="/groups" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/groups/:groupId/add-expense" element={<AddExpense />} />
        <Route path="/summary/:groupId" element={<Summary />} />
        <Route path="/groups/:id/add-members" element={<AddMembers />} />
        <Route path="/groups/:id" element={<Navigate to="/groups" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Navbar />
        <AppRoutes />
        <Footer />
      </Router>
    </AppProvider>
  );
}