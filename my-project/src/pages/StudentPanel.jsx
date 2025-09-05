import { useState } from "react";
import API from "../api/client";
import CandidateCard from "../components/CandidateCard";

export default function StudentPanel() {
  const [userId, setUserId] = useState("");
  const [status, setStatus] = useState(null);
  const [candidates, setCandidates] = useState([]);

  async function checkStatus() {
    try {
      const res = await API.get(`/status/${userId}`);
      setStatus(res.data);
      if (res.data.valid && !res.data.banned && !res.data.voted) {
        const cand = await API.get("/candidates");
        setCandidates(cand.data);
      }
    } catch (err) {
      alert(err.response?.data?.error || "Error checking status");
    }
  }

  async function handleVote(cid) {
    try {
      await API.post("/vote", { userId, candidateId: cid });
      alert("Vote submitted successfully!");
      setStatus({ ...status, voted: true });
      setCandidates([]);
    } catch (err) {
      alert(err.response?.data?.error || "Error voting");
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Student Panel</h2>
      <input
        className="border p-2 mr-2"
        placeholder="Enter PRN (14 chars)"
        value={userId}
        onChange={e => setUserId(e.target.value)}
      />
      <button onClick={checkStatus} className="bg-blue-500 text-white px-4 py-2 rounded">
        Check Status
      </button>

      {status && (
        <div className="mt-4">
          <p>Status: {status.valid ? "Valid" : "Invalid"} | 
             {status.banned ? "Banned" : "Not Banned"} | 
             {status.voted ? "Already Voted" : "Not Voted"}
          </p>
        </div>
      )}

      {candidates.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mt-6">
          {candidates.map(c => (
            <CandidateCard key={c.cid} candidate={c} onVote={() => handleVote(c.cid)} />
          ))}
        </div>
      )}
    </div>
  );
}
