import { useEffect, useState } from "react";
import API from "../api/client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function Results() {
  const [results, setResults] = useState(null);

  useEffect(() => {
    API.get("/admin/results").then(res => setResults(res.data)).catch(() => {});
  }, []);

  if (!results) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Results</h2>
      <p>Total Voted: {results.totalVoted}</p>
      <p>Voting %: {results.votingPercentage}%</p>
      <p>Winner: {results.winner ? results.winner.name : "Tie"}</p>

      <BarChart width={600} height={300} data={results.candidates} className="mt-6">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="votes" fill="#3182ce" />
      </BarChart>
    </div>
  );
}
