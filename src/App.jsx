import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Grabbed from "./components/Grabbed";
import Login from "./components/Login";
import Admin from "./components/Admin";
import DataProcess from "./components/DataProcess";
import DataProcessSuperAdmin from "./components/DataProcessSuperAdmin";
import History from "./components/History";
import HistoryDetails from "./components/HistoryDetails";
import Agent from "./components/Agent";
import Profile from "./components/Profile";

function App() {
  return (
    <>
      <div className="relative w-full min-h-screen p-5 flex justify-center items-center bg-[#DBE8F4] dark:bg-[#2a2a2b]">
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/grabbed" element={<Grabbed />} />
            <Route path="/data-process" element={<DataProcess />} />
            <Route
              path="/data-process-supadmin"
              element={<DataProcessSuperAdmin />}
            />
            <Route path="/history" element={<History />} />
            <Route path="/history/:id" element={<HistoryDetails />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/agent" element={<Agent />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
