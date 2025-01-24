import { useEffect, useState } from "react";
import type Candidate from "../interfaces/Candidate.interface";

const SavedCandidates = () => {
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("savedCandidates");
    if (saved) {
      setSavedCandidates(JSON.parse(saved));
    }
  }, []);

  const handleReject = (id: number) => {
    const updatedCandidates = savedCandidates.filter(
      (candidate) => candidate.id !== id
    );
    setSavedCandidates(updatedCandidates);
    localStorage.setItem("savedCandidates", JSON.stringify(updatedCandidates));
  };

  return (
    <main>
      <h1>Potential Candidates</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Location</th>
            <th>Email</th>
            <th>Company</th>
            <th>Bio</th>
            <th>Reject</th>
          </tr>
        </thead>
        <tbody>
          {savedCandidates.length > 0 ? (
            savedCandidates.map((candidate) => (
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
                <td>{candidate.bio || "N/A"}</td>
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
              <td colSpan={7}>No candidates have been saved yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
};

export default SavedCandidates;
