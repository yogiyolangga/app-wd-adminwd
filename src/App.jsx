import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Grabbed from "./components/Grabbed";
import Admin from "./components/Admin";

function App() {
  return (
    <>
      <div className="w-full min-h-screen p-5 flex justify-center items-center bg-[#DBE8F4]">
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/grabbed" element={<Grabbed />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
