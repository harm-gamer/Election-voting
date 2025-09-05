export default function CandidateCard({ candidate, onVote }) {
  return (
    <div className="border rounded-xl p-4 shadow bg-white">
      <h3 className="text-lg font-bold">{candidate.name}</h3>
      <p>Candidate ID: {candidate.cid}</p>
      <button onClick={onVote} className="bg-green-600 text-white px-3 py-1 mt-2 rounded">
        Vote
      </button>
    </div>
  );
}
