import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import StudentPanel from "./pages/StudentPanel";
import AdminPanel from "./pages/AdminPanel";
import Results from "./pages/Results";

export default function App() {
  return (
    <Router>
      <div className="p-4 bg-gray-100 min-h-screen">
        <nav className="flex gap-4 mb-6">
          <Link to="/" className="font-bold">Home</Link>
          <Link to="/student">Student Panel</Link>
          <Link to="/admin">Admin Panel</Link>
          <Link to="/results">Results</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/student" element={<StudentPanel />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </div>
    </Router>
  );
}
