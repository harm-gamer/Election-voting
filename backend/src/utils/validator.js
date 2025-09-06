// src/utils/validator.js
export function extractYear(userID) {
  if (typeof userID !== "string" || userID.length < 4) return -1;
  const s = userID.slice(0,4);
  const n = parseInt(s, 10);
  return Number.isNaN(n) ? -1 : n;
}

export function extractRollNo(userID) {
  if (typeof userID !== "string" || userID.length < 14) return -1;
  const s = userID.slice(9,14);
  const n = parseInt(s, 10);
  return Number.isNaN(n) ? -1 : n;
}

export function checkBranchCode(userID, branch) {
  if (typeof userID !== "string" || userID.length < 9) return false;
  const branchCode = userID.slice(4,9);
  return branchCode === branch;
}

/**
 * Overall isValid against a given election object
 * election: { year, branch, totalVoters }
 */
export function isValidUserIdForElection(userID, election) {
  if (typeof userID !== "string" || userID.length !== 14) return false;
  const y = extractYear(userID);
  const r = extractRollNo(userID);
  if (y !== election.year) return false;
  if (!checkBranchCode(userID, election.branch)) return false;
  if (r < 1 || r > election.totalVoters) return false;
  return true;
}
