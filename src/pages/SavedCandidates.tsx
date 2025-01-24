import { useEffect, useState } from "react";
import type Candidate from "../interfaces/Candidate.interface";

const SavedCandidates = () => {
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);
  const [filterQuery, setFilterQuery] = useState<string>("");

  // Load candidates from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("savedCandidates");
    if (saved) {
      setSavedCandidates(JSON.parse(saved));
    }
  }, []);

  // Function to handle candidate rejection
  const handleReject = (id: number) => {
    const updatedCandidates = savedCandidates.filter(
      (candidate) => candidate.id !== id
    );
    setSavedCandidates(updatedCandidates);
    localStorage.setItem("savedCandidates", JSON.stringify(updatedCandidates));
  };

  // Filter candidates
  const filteredCandidates = savedCandidates.filter((candidate) =>
    filterQuery
      ? candidate.name?.toLowerCase().includes(filterQuery.toLowerCase()) ||
        candidate.login?.toLowerCase().includes(filterQuery.toLowerCase()) ||
        candidate.location?.toLowerCase().includes(filterQuery.toLowerCase()) ||
        candidate.company?.toLowerCase().includes(filterQuery.toLowerCase())
      : true
  );

  return (
    <main>
      <h1>Potential Candidates</h1>

      {/* Filter Input */}
      <div>
        <label>Filter Candidates: </label>
        <input
          type="text"
          placeholder="Search by name, username, location, or company"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
        />
      </div>

      {/* Candidates Table */}
      <table className="table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Location</th>
            <th>Email</th>
            <th>Company</th>
            <th>Reject</th>
          </tr>
        </thead>
        <tbody>
          {filteredCandidates.length > 0 ? (
            filteredCandidates.map((candidate) => (
              <tr key={candidate.id}>
                <td>
                  <img
                    src={candidate.avatar_url || ""}
                    alt={candidate.login || "No Avatar"}
                    className="avatar"
                  />
                </td>
                <td>
                  {candidate.name || "N/A"} <br />
                  <span style={{ fontStyle: "italic" }}>
                    ({candidate.login || "N/A"})
                  </span>
                </td>
                <td>{candidate.location || "N/A"}</td>
                <td>
                  {candidate.email ? (
                    <a href={`mailto:${candidate.email}`}>
                      {candidate.email}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>{candidate.company || "N/A"}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => candidate.id !== null && handleReject(candidate.id)}
                  >
                    &#8722;
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>No candidates match the current criteria.</td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
};

export default SavedCandidates;

