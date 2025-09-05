import { useState } from "react";
import API from "../api/client";

export default function AdminPanel() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [login, setLogin] = useState({ username: "Admin", password: "admiN" });
  const [form, setForm] = useState({ year: "", branch: "", totalVoters: "", candidates: "" });
  const [banRolls, setBanRolls] = useState("");
  const [delPRN, setDelPRN] = useState("");

  async function handleLogin() {
    try {
      await API.post("/admin/login", login);
      setLoggedIn(true);
    } catch (err) {
      alert("Login failed");
    }
  }

  async function startElection() {
    try {
      const body = {
        year: parseInt(form.year),
        branch: form.branch,
        totalVoters: parseInt(form.totalVoters),
        candidates: form.candidates.split(",").map(c => c.trim())
      };
      await API.post("/admin/initiate", body);
      alert("Election started");
    } catch (err) {
      alert(err.response?.data?.error || "Error starting election");
    }
  }

  async function banUsers() {
    try {
      const nums = banRolls.split(",").map(n => parseInt(n.trim()));
      await API.post("/admin/ban", { rollNumbers: nums });
      alert("Users banned");
    } catch (err) {
      alert("Error banning users");
    }
  }

  async function deleteVote() {
    try {
      await API.post("/admin/delete-vote", { userId: delPRN });
      alert("Vote deleted");
    } catch (err) {
      alert("Error deleting vote");
    }
  }

  if (!loggedIn) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">Admin Login</h2>
        <input className="border p-2 m-2" placeholder="Username"
          value={login.username} onChange={e => setLogin({ ...login, username: e.target.value })} />
        <input className="border p-2 m-2" type="password" placeholder="Password"
          value={login.password} onChange={e => setLogin({ ...login, password: e.target.value })} />
        <button onClick={handleLogin} className="bg-green-600 text-white px-4 py-2 rounded">Login</button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
      <div className="mb-6">
        <h3 className="font-bold">Start New Election</h3>
        <input className="border p-2 m-1" placeholder="Year" onChange={e => setForm({ ...form, year: e.target.value })} />
        <input className="border p-2 m-1" placeholder="Branch" onChange={e => setForm({ ...form, branch: e.target.value })} />
        <input className="border p-2 m-1" placeholder="Total Voters" onChange={e => setForm({ ...form, totalVoters: e.target.value })} />
        <input className="border p-2 m-1" placeholder="Candidates (comma separated)" onChange={e => setForm({ ...form, candidates: e.target.value })} />
        <button onClick={startElection} className="bg-blue-600 text-white px-3 py-1 rounded">Start</button>
      </div>

      <div className="mb-6">
        <h3 className="font-bold">Ban Roll Numbers</h3>
        <input className="border p-2 m-1" placeholder="e.g. 1,2,3" value={banRolls} onChange={e => setBanRolls(e.target.value)} />
        <button onClick={banUsers} className="bg-red-600 text-white px-3 py-1 rounded">Ban</button>
      </div>

      <div className="mb-6">
        <h3 className="font-bold">Delete Vote</h3>
        <input className="border p-2 m-1" placeholder="UserID PRN" value={delPRN} onChange={e => setDelPRN(e.target.value)} />
        <button onClick={deleteVote} className="bg-yellow-600 text-white px-3 py-1 rounded">Delete</button>
      </div>
    </div>
  );
}
