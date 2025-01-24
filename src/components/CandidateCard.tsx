import type React from 'react';
import type Candidate from '../interfaces/Candidate.interface';

type CandidateCardProps = {
    currentCandidate: Candidate;
    handleSaveCandidate: () => void | null;
    handleNextCandidate: () => Promise<void> | null;
};


const CandidateCard: React.FC<CandidateCardProps> = ({
    currentCandidate,
    handleSaveCandidate,
    handleNextCandidate,
  }) => {
    return (
      <main>
        <div>
          <h1>Candidate Search</h1>
  
          {currentCandidate ? (
            <section className="candidate-card">
              <figure>
                <img
                  src={currentCandidate.avatar_url || ""}
                  alt={currentCandidate.login || "No Avatar"}
                  className="candidateAvatar"
                />
              </figure>
              <article className="candidateInfo">
                <h2>
                  {currentCandidate.name || "N/A"} ({currentCandidate.login || "N/A"})
                </h2>
                <p>Location: {currentCandidate.location || "N/A"}</p>
                <p>
                  Email:{" "}
                  {currentCandidate.email ? (
                    <a href={`mailto:${currentCandidate.email}`}>
                      {currentCandidate.email}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </p>
                <p>Company: {currentCandidate.company || "N/A"}</p>
                <p>Bio: {currentCandidate.bio || "N/A"}</p>
              </article>
              <div className="candidateControls">
                <button className="nextCandidate" onClick={handleNextCandidate}>
                  -
                </button>
                <button className="savedCandidate" onClick={handleSaveCandidate}>
                  +
                </button>
              </div>
            </section>
          ) : (
            <p>No more candidates available.</p>
          )}
        </div>
      </main>
    );
  };

export default CandidateCard;