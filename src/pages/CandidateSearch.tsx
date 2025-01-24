import { useState, useEffect } from "react";
import { searchGithub, searchGithubUser } from "../api/API";
import type Candidate from "../interfaces/Candidate.interface";

const CandidateSearch = () => {
  const [currentCandidate, setCurrentCandidate] = useState<Candidate>({
    id: 0,
    login: "",
    avatar_url: "",
    name: "",
    location: "",
    email: "",
    company: "",
    bio: "",
  });
  const [searchInput, setSearchInput] = useState<string>('');

  const saveCandidate = () => {
    let parsedCandidate: Candidate[] = [];
    const storedCandidates = localStorage.getItem('savedCandidates');
    if (typeof storedCandidatets === 'string') {
      parsedCandidate = JSON.parse(storedCandidates);
    }
    parsedCandidate.push(currentCandidate);
    localStorage.setItem('savedCandidates', JSON.stringify(parsedCandidate));
  };

  const searchCandidate = async (event: FormEvent, search: string ) => {
    event.preventDefault();
    const data: Candidate = await searchGithubUser(search);

    setCurrentCandidate(data);
    
    }
  };

  const nextCandidate = () => {
    searchGithub().then((data) => {
      setCurrentCandidate(data);
    });
  };

 
}


// const CandidateSearch = () => {
//   const [candidates, setCandidates] = useState<Candidate[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [savedCandidates, setSavedCandidates] = useState<Candidate[]>(() => {
//     const saved = localStorage.getItem("savedCandidates");
//     return saved ? JSON.parse(saved) : [];
//   });

//   useEffect(() => {
//     const fetchCandidates = async () => {
//       // Fetch random users from GitHub API
//       const data = await searchGithub();
//       setCandidates(formattedData);
//     };
//     fetchCandidates();
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("savedCandidates", JSON.stringify(savedCandidates));
//   }, [savedCandidates]);

//   const currentCandidate = candidates[currentIndex];

//   const handleSaveCandidate = () => {
//     if (currentCandidate) {
//       setSavedCandidates((prev) => [...prev, currentCandidate]);
//       handleNextCandidate();
//     }
//   };

//   const handleNextCandidate = () => {
//     if (currentIndex < candidates.length - 1) {
//       setCurrentIndex((prevIndex) => prevIndex + 1);
//     } else {
//       setCandidates([]);
//     }
//   };

  console.log(currentCandidate);
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
            <article>
              <h2>
                {currentCandidate.name} ({currentCandidate.login})
              </h2>
              <p>Location: {currentCandidate.location}</p>
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
            <div>
              <button
                className="nextCandidate"
                onClick={handleNextCandidate}
              >
                -
              </button>
              <button
                className="savedCandidate"
                onClick={handleSaveCandidate}
              >
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

export default CandidateSearch;