import { type FormEvent, useState, useEffect } from "react";
import { searchGithub, searchGithubUser } from "../api/API";
import type Candidate from "../interfaces/Candidate.interface";
import CandidateCard from "../components/CandidateCard";

const CandidateSearch = () => {
  const [candidateList, setCandidateList] = useState<Candidate[]>([]); // Store the list of candidates
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current candidate index
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null); // Store the current candidate
  const [searchInput, setSearchInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // Track loading state

  // Fetch candidates
  const fetchCandidates = async () => {
    setLoading(true); // Show loading state
    try {
      const data = await searchGithub(); // Fetch 30 random users
      const detailedCandidates: Candidate[] = [];

      for (const user of data) {
        try {
          const detailedUser = await searchGithubUser(user.login || "");
          if (detailedUser && detailedUser.login) {
            detailedCandidates.push(detailedUser);
          }
        } catch (error) {
          console.log(`Skipping user ${user.login} due to error.`);
        }
      }

      setCandidateList(detailedCandidates); // Store the list of valid candidates
      if (detailedCandidates.length > 0) {
        setCurrentCandidate(detailedCandidates[0]); // Set the first candidate
        setCurrentIndex(0);
      } else {
        setCurrentCandidate(null); // No candidates available
      }
    } catch (error) {
      console.log("Error fetching candidates:", error);
    }
    setLoading(false); // Hide loading state
  };

  // Fetch a new batch of candidates when the component loads
  useEffect(() => {
    fetchCandidates();
  }, []);

  // Handle moving to the next candidate
  const nextCandidate = async () => {
    const nextIndex = currentIndex + 1;

    // If the index exceeds the list length, set currentCandidate to null
    if (nextIndex >= candidateList.length) {
      setCurrentCandidate(null);
    } else {
      setCurrentIndex(nextIndex); // Update the index
      setCurrentCandidate(candidateList[nextIndex]); // Set the next candidate
    }
  };

  // Handle saving the current candidate
  const saveCandidate = () => {
    if (!currentCandidate) return;

    let parsedCandidate: Candidate[] = [];
    const storedCandidates = localStorage.getItem("savedCandidates");
    if (typeof storedCandidates === "string") {
      parsedCandidate = JSON.parse(storedCandidates);
    }
    parsedCandidate.push(currentCandidate);
    localStorage.setItem("savedCandidates", JSON.stringify(parsedCandidate));

    // Move to the next candidate
    nextCandidate();
  };

  // Handle searching for a candidate
  const searchCandidate = async (event: FormEvent, search: string) => {
    event.preventDefault();
    try {
      const data: Candidate = await searchGithubUser(search);
      setCurrentCandidate(data); // Update the current candidate with the searched user
    } catch (error) {
      console.log("Error searching for candidate:", error);
    }
    setSearchInput(""); // Clear the search input after submitting
  };

  return (
    <>
      <section id="searchSection">
        <form onSubmit={(event: FormEvent) => searchCandidate(event, searchInput)}>
          <input
            type="text"
            placeholder="Search for a candidate"
            onChange={(event) => setSearchInput(event.target.value)}
            value={searchInput}
            className="searchInput"
          />
          <button type="submit">Search</button>
        </form>
      </section>

      {/* Show loading message or candidate data */}
      {loading ? (
        <p>Loading...</p>
      ) : currentCandidate ? (
        <CandidateCard
          currentCandidate={currentCandidate}
          handleSaveCandidate={saveCandidate}
          handleNextCandidate={nextCandidate}
        />
      ) : (
        <div>
          <p>No more candidates available to review.</p>
          <button onClick={() => fetchCandidates()}>Get new candidates?</button>
        </div>
      )}
    </>
  );
};

export default CandidateSearch;
